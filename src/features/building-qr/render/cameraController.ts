import * as THREE from 'three';

/**
 * Product-friendly auto camera: a fixed isometric angle that slowly orbits the
 * city. No manual OrbitControls (per docs/design/06 Goal 5).
 */
export class CameraController {
  readonly camera: THREE.PerspectiveCamera;
  private angle = Math.PI * 0.25;
  private readonly radius: number;
  private readonly height: number;
  private readonly target: THREE.Vector3;

  constructor(size: number) {
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2000);
    this.radius = size * 1.35;
    this.height = size * 0.95;
    this.target = new THREE.Vector3(0, size * 0.05, 0);
    this.apply();
  }

  private apply(): void {
    this.camera.position.set(
      Math.sin(this.angle) * this.radius,
      this.height,
      Math.cos(this.angle) * this.radius,
    );
    this.camera.lookAt(this.target);
  }

  update(dt: number, allowMotion: boolean): void {
    if (!allowMotion) return;
    this.angle += dt * 0.12;
    this.apply();
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
