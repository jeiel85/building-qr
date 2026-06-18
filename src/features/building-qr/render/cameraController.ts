import * as THREE from 'three';

/**
 * Auto camera: a fixed isometric angle that slowly orbits in art mode, and
 * interpolates to a top-down view as the scan progress goes 0 -> 1. No manual
 * OrbitControls (docs/design/06 Goal 5/6).
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
    // lerp iso -> top-down
    this.camera.position.set(
      ix * (1 - p),
      this.height * (1 - p) + this.size * 1.85 * p,
      iz * (1 - p) + 0.0001 * p,
    );
    this.target.set(0, this.size * 0.05 * (1 - p), 0);
    this.camera.lookAt(this.target);
  }

  orbit(dt: number): void {
    this.angle += dt * 0.12;
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
