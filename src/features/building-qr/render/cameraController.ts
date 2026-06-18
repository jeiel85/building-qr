import * as THREE from 'three';

/**
 * Auto camera: a fixed isometric angle that slowly orbits, interpolating to a
 * near-top-down view as scan progress goes 0 -> 1. The orbit angle keeps
 * advancing during the morph, so the city visibly swings as it lies down.
 */
export class CameraController {
  readonly camera: THREE.PerspectiveCamera;
  private angle = Math.PI * 0.25;
  private progress = 0;
  private readonly radius: number;
  private readonly height: number;
  private readonly size: number;
  private readonly target = new THREE.Vector3();

  constructor(size: number) {
    this.size = size;
    this.radius = size * 1.35;
    this.height = size * 0.95;
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 4000);
    this.apply();
  }

  private apply(): void {
    const p = this.progress;
    const ix = Math.sin(this.angle) * this.radius;
    const iz = Math.cos(this.angle) * this.radius;
    // lerp iso -> high top-down (extra height keeps the flat grid low-distortion)
    this.camera.position.set(
      ix * (1 - p),
      this.height * (1 - p) + this.size * 2.4 * p,
      iz * (1 - p) + 0.0001 * p,
    );
    this.target.set(0, this.size * 0.05 * (1 - p), 0);
    this.camera.lookAt(this.target);
  }

  /** Advance the orbit angle without re-applying (caller applies after). */
  advanceAngle(dt: number, speed = 0.12): void {
    this.angle += dt * speed;
  }

  /** Art-mode gentle orbit (advance + apply). */
  orbit(dt: number): void {
    this.advanceAngle(dt);
    this.apply();
  }

  setProgress(p: number): void {
    this.progress = Math.min(1, Math.max(0, p));
    this.apply();
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
