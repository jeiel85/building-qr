import * as THREE from 'three';

/**
 * Auto camera (spherical: azimuth + elevation). In art mode it orbits at an
 * isometric elevation; for the 2D view it tilts the elevation up to nearly
 * top-down and snaps the azimuth to the nearest 90° so the flat grid is
 * axis-aligned. `up` stays (0,1,0) throughout (no roll). The camera distance is
 * computed from the viewport aspect so the city/QR always fits (no clipping on
 * tall phone screens).
 */
const ISO_ELEVATION = Math.PI * 0.19; // ~34° above the ground
const FLAT_ELEVATION = Math.PI * 0.495; // ~89° (near top-down; not 90° to avoid degeneracy)
const ISO_FIT = 1.5; // fit the footprint's diagonal at any orbit angle
const FLAT_FIT = 1.1; // fit the square QR with a small margin
const MIN_ELEVATION = Math.PI * 0.05; // ~9°: floor so a user drag never dips below the ground
// User vertical-tilt offset bounds (added on top of ISO in 3D, faded out in 2D).
const MIN_ELEVATION_OFFSET = MIN_ELEVATION - ISO_ELEVATION; // down to ~9°
const MAX_ELEVATION_OFFSET = Math.PI * 0.44 - ISO_ELEVATION; // up to ~79°

export class CameraController {
  readonly camera: THREE.PerspectiveCamera;
  private aspect = 1;
  private azimuth = Math.PI * 0.25;
  private elevationOffset = 0; // user drag tilt (3D only)
  private progress = 0;
  private readonly size: number;
  private readonly target = new THREE.Vector3();

  constructor(size: number) {
    this.size = size;
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 4000);
    this.apply();
  }

  /** Distance so a `targetWidth`-wide subject fits both FOV dimensions. */
  private fitDistance(targetWidth: number): number {
    const vHalf = THREE.MathUtils.degToRad(this.camera.fov) / 2;
    const hHalf = Math.atan(Math.tan(vHalf) * this.aspect);
    const half = targetWidth / 2;
    return Math.max(half / Math.tan(vHalf), half / Math.tan(hHalf));
  }

  private apply(): void {
    const p = this.progress;
    // ISO base + the user's drag tilt (only in 3D; the tilt fades as it flattens
    // so the 2D scan view always lands near top-down). Clamped above ground.
    const elevation = THREE.MathUtils.clamp(
      ISO_ELEVATION + (FLAT_ELEVATION - ISO_ELEVATION) * p + this.elevationOffset * (1 - p),
      MIN_ELEVATION,
      FLAT_ELEVATION,
    );
    const radius =
      this.fitDistance(this.size * ISO_FIT) * (1 - p) + this.fitDistance(this.size * FLAT_FIT) * p;
    const cosE = Math.cos(elevation);
    const sinE = Math.sin(elevation);

    this.target.set(0, this.size * 0.06 * (1 - p), 0);
    this.camera.up.set(0, 1, 0);
    this.camera.position.set(
      this.target.x + radius * cosE * Math.sin(this.azimuth),
      this.target.y + radius * sinE,
      this.target.z + radius * cosE * Math.cos(this.azimuth),
    );
    this.camera.lookAt(this.target);
  }

  /** Advance the orbit azimuth (no apply; caller applies after). */
  advanceAngle(dt: number, speed = 0.12): void {
    this.azimuth += dt * speed;
  }

  /** User drag: spin horizontally + tilt vertically (radians). 3D only. */
  dragOrbit(dAzimuth: number, dElevation: number): void {
    this.azimuth += dAzimuth;
    this.elevationOffset = THREE.MathUtils.clamp(
      this.elevationOffset + dElevation,
      MIN_ELEVATION_OFFSET,
      MAX_ELEVATION_OFFSET,
    );
    this.apply();
  }

  getAngle(): number {
    return this.azimuth;
  }

  setAngle(angle: number): void {
    this.azimuth = angle;
  }

  getElevationOffset(): number {
    return this.elevationOffset;
  }

  setElevationOffset(offset: number): void {
    this.elevationOffset = offset;
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
    this.aspect = aspect;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.apply();
  }
}
