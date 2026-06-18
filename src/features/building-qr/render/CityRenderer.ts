import * as THREE from 'three';
import type { BlockScene } from '../art';
import type { ViewMode } from '../store/buildingQrStore';
import { prefersReducedMotion } from '@/platform';
import { createScene } from './createScene';
import { createLights, type SceneLights } from './lighting';
import { createInstancedBlocks, type InstancedCity } from './createInstancedBlocks';
import { CameraController } from './cameraController';

const MAX_DPR = 2;
const AMBIENT_ART = 0.62;
const AMBIENT_SCAN = 1.0;
const KEY_ART = 1.15;
const KEY_SCAN = 0.12;

/**
 * Owns the WebGL renderer lifecycle and the art<->scan morph: scene, auto
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
  private progress = 0;
  private targetProgress = 0;

  constructor(container: HTMLElement, initial: BlockScene) {
    this.container = container;
    this.reducedMotion = prefersReducedMotion();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    this.applyProgress(this.progress);
    this.resize();
  }

  setViewMode(mode: ViewMode): void {
    this.targetProgress = mode === 'scan2d' ? 1 : 0;
    if (this.reducedMotion) {
      this.progress = this.targetProgress;
      this.applyProgress(this.progress);
    }
  }

  private applyProgress(p: number): void {
    this.city?.apply(p);
    this.camera.setProgress(p);
    this.lights.ambient.intensity = AMBIENT_ART + (AMBIENT_SCAN - AMBIENT_ART) * p;
    this.lights.key.intensity = KEY_ART + (KEY_SCAN - KEY_ART) * p;
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

    if (Math.abs(this.progress - this.targetProgress) > 0.001) {
      this.progress += (this.targetProgress - this.progress) * Math.min(1, dt * 6);
      if (Math.abs(this.progress - this.targetProgress) <= 0.001) this.progress = this.targetProgress;
      this.applyProgress(this.progress);
    } else if (this.progress < 0.02 && !this.reducedMotion) {
      this.camera.orbit(dt);
    }

    this.renderer.render(this.scene, this.camera.camera);
    this.raf = requestAnimationFrame(this.loop);
  };

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
