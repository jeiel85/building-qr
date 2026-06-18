import * as THREE from 'three';

/**
 * Auto camera: a fixed isometric angle that slowly orbits, interpolating to a
 * near-top-down view as scan progress goes 0 -> 1. The camera `up` vector is
 * tilted toward the orbit azimuth so the top-down view is stable (no degenerate
 * lookAt) and the grid orientation follows the angle — letting the renderer
 * settle on the nearest 90° instead of snapping to a fixed orientation.
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
    this.camera.position.set(
      ix * (1 - p),
      this.height * (1 - p) + this.size * 2.4 * p,
      iz * (1 - p) + 0.0001 * p,
    );
    // up: iso (0,1,0) -> top-down oriented by azimuth (sin,0,cos)
    this.camera.up.set(Math.sin(this.angle) * p, 1 - p, Math.cos(this.angle) * p).normalize();
    this.target.set(0, this.size * 0.05 * (1 - p), 0);
    this.camera.lookAt(this.target);
  }

  /** Advance the orbit angle (no apply; caller applies after). */
  advanceAngle(dt: number, speed = 0.12): void {
    this.angle += dt * speed;
  }

  getAngle(): number {
    return this.angle;
  }

  setAngle(angle: number): void {
    this.angle = angle;
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
