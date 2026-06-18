import * as THREE from 'three';
import type { BlockScene } from '../art';
import type { ViewMode } from '../store/buildingQrStore';
import { prefersReducedMotion } from '@/platform';
import { createScene } from './createScene';
import { createLights, type SceneLights } from './lighting';
import { createInstancedBlocks, type InstancedCity } from './createInstancedBlocks';
import { CameraController } from './cameraController';

const MAX_DPR = 2;
const TRANSITION_SECONDS = 1.0;
const TRANSITION_SECONDS_REDUCED = 0.32; // reduced-motion: short, not an instant jump
const AMBIENT_ART = 0.62;
const AMBIENT_FLAT = 0.92;
const KEY_ART = 1.15;
const KEY_FLAT = 0.55;

/** Smootherstep — ease-in-out for a livelier morph. */
function smootherstep(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Nearest quarter-turn — the scan view only needs to be axis-aligned. */
function snapToQuarterTurn(angle: number): number {
  const q = Math.PI / 2;
  return Math.round(angle / q) * q;
}

/**
 * Owns the WebGL renderer lifecycle and the art<->flat morph: scene, auto
 * camera, instanced city, animation loop, resize, and full disposal.
 */
export class CityRenderer {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly lights: SceneLights;
  private camera: CameraController;
  private city: InstancedCity | null = null;
  private readonly observer: ResizeObserver;
  private readonly reducedMotion: boolean;
  private raf = 0;
  private lastTime = 0;
  private rawProgress = 0;
  private targetRaw = 0;
  private snapping = false;
  private snapFromAngle = 0;
  private snapToAngle = 0;
  private readonly transitionSeconds: number;

  constructor(container: HTMLElement, initial: BlockScene) {
    this.container = container;
    this.reducedMotion = prefersReducedMotion();
    this.transitionSeconds = this.reducedMotion ? TRANSITION_SECONDS_REDUCED : TRANSITION_SECONDS;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    this.scene = createScene();
    this.lights = createLights();
    this.scene.add(this.lights.ambient, this.lights.key, this.lights.fill);

    this.camera = new CameraController(initial.size);
    this.setScene(initial);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.raf = requestAnimationFrame(this.loop);
  }

  setScene(blockScene: BlockScene): void {
    this.disposeCity();
    this.city = createInstancedBlocks(blockScene);
    this.scene.add(this.city.mesh);
    this.camera = new CameraController(blockScene.size);
    this.applyProgress(smootherstep(this.rawProgress));
    this.resize();
  }

  setViewMode(mode: ViewMode): void {
    this.targetRaw = mode === 'scan2d' ? 1 : 0;
    if (mode === 'scan2d') {
      // settle on the nearest 90° from the current orbit — minimal rotation
      this.snapFromAngle = this.camera.getAngle();
      this.snapToAngle = snapToQuarterTurn(this.snapFromAngle);
      this.snapping = true;
    } else {
      this.snapping = false;
    }
    // Always animate (the loop eases over transitionSeconds). Reduced-motion
    // uses a short duration instead of an instant jump so it never feels abrupt.
  }

  private applyProgress(p: number): void {
    this.city?.apply(p);
    this.camera.setProgress(p);
    this.lights.ambient.intensity = AMBIENT_ART + (AMBIENT_FLAT - AMBIENT_ART) * p;
    this.lights.key.intensity = KEY_ART + (KEY_FLAT - KEY_ART) * p;
  }

  private resize(): void {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 320;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    this.renderer.setSize(w, h);
    this.camera.setAspect(w / h);
  }

  private readonly loop = (time: number): void => {
    const dt = this.lastTime ? (time - this.lastTime) / 1000 : 0;
    this.lastTime = time;

    if (Math.abs(this.rawProgress - this.targetRaw) > 0.0001) {
      const dir = Math.sign(this.targetRaw - this.rawProgress);
      this.rawProgress += (dir * dt) / this.transitionSeconds;
      this.rawProgress = Math.min(1, Math.max(0, this.rawProgress));
      if (Math.abs(this.rawProgress - this.targetRaw) < dt / this.transitionSeconds) {
        this.rawProgress = this.targetRaw;
      }
      const eased = smootherstep(this.rawProgress);
      if (this.snapping) {
        // rotate the minimal amount to the nearest axis-aligned orientation
        this.camera.setAngle(this.snapFromAngle + (this.snapToAngle - this.snapFromAngle) * eased);
      } else {
        this.camera.advanceAngle(dt, 0.55); // gentle swing back into orbit
      }
      this.applyProgress(eased);
    } else if (this.rawProgress < 0.02 && !this.reducedMotion) {
      this.camera.orbit(dt);
    }

    this.renderer.render(this.scene, this.camera.camera);
    this.raf = requestAnimationFrame(this.loop);
  };

  /** Render the current city to a transparent-background PNG at `pixels` square. */
  async capture(pixels: number): Promise<Blob> {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(pixels, pixels, false);
    this.camera.setAspect(1);
    this.renderer.render(this.scene, this.camera.camera);
    const blob = await new Promise<Blob>((resolve, reject) => {
      this.renderer.domElement.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('이미지 캡처에 실패했습니다.'))),
        'image/png',
      );
    });
    this.resize();
    return blob;
  }

  private disposeCity(): void {
    if (!this.city) return;
    this.scene.remove(this.city.mesh);
    this.city.mesh.geometry.dispose();
    (this.city.mesh.material as THREE.Material).dispose();
    this.city.mesh.dispose();
    this.city = null;
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.disposeCity();
    this.renderer.dispose();
    this.renderer.domElement.parentNode?.removeChild(this.renderer.domElement);
  }
}
