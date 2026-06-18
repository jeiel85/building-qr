import * as THREE from 'three';
import type { BlockScene } from '../art';
import type { ViewMode } from '../store/buildingQrStore';
import { prefersReducedMotion } from '@/platform';
import { createScene } from './createScene';
import { createLights, type SceneLights } from './lighting';
import { createInstancedBlocks, type InstancedCity } from './createInstancedBlocks';
import { CameraController } from './cameraController';

const MAX_DPR = 2;
const TRANSITION_SECONDS = 0.7;
const AMBIENT_ART = 0.62;
const AMBIENT_FLAT = 0.92;
const KEY_ART = 1.15;
const KEY_FLAT = 0.55;

/** Smootherstep — ease-in-out for a livelier morph. */
function smootherstep(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
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

  constructor(container: HTMLElement, initial: BlockScene) {
    this.container = container;
    this.reducedMotion = prefersReducedMotion();

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
    if (this.reducedMotion) {
      this.rawProgress = this.targetRaw;
      this.applyProgress(smootherstep(this.rawProgress));
    }
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
      this.rawProgress += (dir * dt) / TRANSITION_SECONDS;
      this.rawProgress = Math.min(1, Math.max(0, this.rawProgress));
      if (Math.abs(this.rawProgress - this.targetRaw) < dt / TRANSITION_SECONDS) {
        this.rawProgress = this.targetRaw;
      }
      this.camera.advanceAngle(dt, 0.55); // swing while morphing
      this.applyProgress(smootherstep(this.rawProgress));
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
