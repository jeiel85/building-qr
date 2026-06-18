import * as THREE from 'three';
import type { BlockScene } from '../art';
import { prefersReducedMotion } from '@/platform';
import { createScene } from './createScene';
import { createInstancedBlocks } from './createInstancedBlocks';
import { CameraController } from './cameraController';

const MAX_DPR = 2;

/**
 * Owns the WebGL renderer lifecycle: scene, auto camera, instanced city,
 * animation loop, resize handling, and full disposal.
 */
export class CityRenderer {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private camera: CameraController;
  private mesh: THREE.InstancedMesh | null = null;
  private readonly observer: ResizeObserver;
  private readonly allowMotion: boolean;
  private raf = 0;
  private lastTime = 0;

  constructor(container: HTMLElement, initial: BlockScene) {
    this.container = container;
    this.allowMotion = !prefersReducedMotion();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    this.scene = createScene();
    this.camera = new CameraController(initial.size);
    this.setScene(initial);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.raf = requestAnimationFrame(this.loop);
  }

  setScene(blockScene: BlockScene): void {
    this.disposeMesh();
    this.mesh = createInstancedBlocks(blockScene);
    this.scene.add(this.mesh);
    this.camera = new CameraController(blockScene.size);
    this.resize();
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
    this.camera.update(dt, this.allowMotion);
    this.renderer.render(this.scene, this.camera.camera);
    this.raf = requestAnimationFrame(this.loop);
  };

  private disposeMesh(): void {
    if (!this.mesh) return;
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.mesh.dispose();
    this.mesh = null;
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.disposeMesh();
    this.renderer.dispose();
    this.renderer.domElement.parentNode?.removeChild(this.renderer.domElement);
  }
}
