import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
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
const AMBIENT_ART = 0.6;
const AMBIENT_FLAT = 1.0;
const KEY_ART = 1.1;
const KEY_FLAT = 0.0; // flat-lit in 2D so colors hit at face value (max scan contrast)
const FOG_COLOR = 0x120b30;
// Gentle, tight bloom. Strength is the anti-blowout lever: dense city centers
// pack many lit windows, and bloom is additive, so a high strength stacks them
// into a white-hot core ("on fire"). Keep it low — a soft halo, not a flare.
const BLOOM_STRENGTH = 0.35;
const BLOOM_RADIUS = 0.4;
const BLOOM_THRESHOLD = 0.78;
// Pointer drag-to-orbit (mouse + touch via Pointer Events).
const DRAG_AZ_SENS = 0.0045; // radians per px, horizontal spin (was 0.008 — too fast)
const DRAG_EL_SENS = 0.0045; // radians per px, vertical tilt
const AUTO_ORBIT_RESUME_MS = 700; // short beat after release, then auto-orbit resumes

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
 * camera, instanced city, night-sky fog, bloom glow, animation loop, resize,
 * and full disposal. Window lights + bloom + fog all fade out in 2D so scan
 * contrast is unaffected.
 */
export class CityRenderer {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly lights: SceneLights;
  private readonly composer: EffectComposer;
  private readonly renderPass: RenderPass;
  private readonly bloomPass: UnrealBloomPass;
  private readonly fog: THREE.Fog;
  private camera: CameraController;
  private city: InstancedCity | null = null;
  private citySize: number;
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
  private dragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private now = 0;
  private lastInteractAt = -Infinity; // auto-orbits freely until the first drag

  constructor(container: HTMLElement, initial: BlockScene) {
    this.container = container;
    this.citySize = initial.size;
    this.reducedMotion = prefersReducedMotion();
    this.transitionSeconds = this.reducedMotion ? TRANSITION_SECONDS_REDUCED : TRANSITION_SECONDS;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    container.appendChild(this.renderer.domElement);

    // Drag-to-orbit (mouse + touch). touch-action:none stops the browser from
    // scrolling/zooming the page while the user spins the city.
    const el = this.renderer.domElement;
    el.style.touchAction = 'none';
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointercancel', this.onPointerUp);

    this.scene = createScene();
    this.fog = new THREE.Fog(FOG_COLOR, 1, 100);
    this.scene.fog = this.fog;
    this.lights = createLights();
    this.scene.add(this.lights.ambient, this.lights.key, this.lights.fill);

    this.camera = new CameraController(initial.size);

    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera.camera);
    this.composer.addPass(this.renderPass);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      BLOOM_STRENGTH,
      BLOOM_RADIUS,
      BLOOM_THRESHOLD,
    );
    this.composer.addPass(this.bloomPass);

    this.setScene(initial);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.raf = requestAnimationFrame(this.loop);
  }

  setScene(blockScene: BlockScene): void {
    this.disposeCity();
    this.citySize = blockScene.size;
    this.city = createInstancedBlocks(blockScene);
    this.scene.add(this.city.mesh);
    // Preserve the current azimuth so changing preset in 2D keeps the QR
    // axis-aligned (a fresh camera would reset to 45° → a rhombus).
    const azimuth = this.camera.getAngle();
    const elevationOffset = this.camera.getElevationOffset();
    this.camera = new CameraController(blockScene.size);
    this.camera.setAngle(azimuth);
    this.camera.setElevationOffset(elevationOffset);
    this.renderPass.camera = this.camera.camera;
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
    // No grab cursor on the flat scan view (it's a fixed top-down QR, not orbitable).
    this.renderer.domElement.style.cursor = mode === 'scan2d' ? 'default' : 'grab';
    // Always animate (the loop eases over transitionSeconds). Reduced-motion
    // uses a short duration instead of an instant jump so it never feels abrupt.
  }

  private readonly onPointerDown = (e: PointerEvent): void => {
    if (this.targetRaw !== 0) return; // orbit only in the 3D view
    this.dragging = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    try {
      this.renderer.domElement.setPointerCapture(e.pointerId);
    } catch {
      /* no active pointer (e.g. synthetic event) — drag still tracks via state */
    }
    this.renderer.domElement.style.cursor = 'grabbing';
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    // drag right → city follows the hand; drag down → tilt toward top-down
    this.camera.dragOrbit(-dx * DRAG_AZ_SENS, dy * DRAG_EL_SENS);
    e.preventDefault();
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    if (!this.dragging) return;
    this.dragging = false;
    this.lastInteractAt = this.now;
    try {
      this.renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
    if (this.targetRaw === 0) this.renderer.domElement.style.cursor = 'grab';
  };

  private applyProgress(p: number): void {
    this.city?.apply(p);
    this.camera.setProgress(p);
    this.lights.ambient.intensity = AMBIENT_ART + (AMBIENT_FLAT - AMBIENT_ART) * p;
    this.lights.key.intensity = KEY_ART + (KEY_FLAT - KEY_ART) * p;
    // Bloom + fog belong to the 3D night view only; both fade out as it flattens
    // so the 2D scan view stays crisp and high-contrast.
    this.bloomPass.strength = BLOOM_STRENGTH * (1 - p);
    this.updateFog(p);
  }

  /**
   * Anchor fog to the actual camera distance (not citySize) so it tracks the
   * aspect-aware fit on tall phone screens. It starts just short of the city
   * center — front faces stay sharp, only the deepest blocks fade into the dusk.
   * At p→1 (flat scan view) `far` is pushed far away so fog effectively turns off.
   */
  private updateFog(p: number): void {
    const camDist = this.camera.camera.position.length();
    this.fog.near = camDist - this.citySize * 0.2;
    this.fog.far = camDist + this.citySize * (1.6 + 60 * p);
  }

  private resize(): void {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 320;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);
    this.camera.setAspect(w / h);
    // aspect change moves the camera → refresh fog so it stays anchored to it
    this.updateFog(smootherstep(this.rawProgress));
  }

  private readonly loop = (time: number): void => {
    const dt = this.lastTime ? (time - this.lastTime) / 1000 : 0;
    this.lastTime = time;
    this.now = time;

    if (Math.abs(this.rawProgress - this.targetRaw) > 0.0001) {
      const dir = Math.sign(this.targetRaw - this.rawProgress);
      this.rawProgress += (dir * dt) / this.transitionSeconds;
      this.rawProgress = Math.min(1, Math.max(0, this.rawProgress));
      if (Math.abs(this.rawProgress - this.targetRaw) < dt / this.transitionSeconds) {
        this.rawProgress = this.targetRaw;
      }
      const eased = smootherstep(this.rawProgress);
      if (this.snapping) {
        this.camera.setAngle(this.snapFromAngle + (this.snapToAngle - this.snapFromAngle) * eased);
      } else {
        this.camera.advanceAngle(dt, 0.55);
      }
      this.applyProgress(eased);
    } else if (
      this.rawProgress < 0.02 &&
      !this.reducedMotion &&
      !this.dragging &&
      this.now - this.lastInteractAt > AUTO_ORBIT_RESUME_MS
    ) {
      // gentle idle orbit — paused while dragging and for a short beat after
      // release, then it resumes spinning from wherever the user left it
      this.camera.orbit(dt);
    }

    this.composer.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  /** Render the current city to a PNG at `pixels` square (with bloom). */
  async capture(pixels: number): Promise<Blob> {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(pixels, pixels, false);
    this.composer.setPixelRatio(1);
    this.composer.setSize(pixels, pixels);
    this.camera.setAspect(1);
    this.composer.render();
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
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointercancel', this.onPointerUp);
    this.disposeCity();
    this.bloomPass.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.domElement.parentNode?.removeChild(this.renderer.domElement);
  }
}
