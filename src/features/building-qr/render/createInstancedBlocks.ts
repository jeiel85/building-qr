import * as THREE from 'three';
import { colorsForType, getPalette, type BlockScene } from '../art';
import { createBlockGeometry, createBlockMaterial } from './materials';

/** Near-flat height for the top-down 2D end-state. */
const FLAT_HEIGHT = 0.06;
/** How far the dark (building) modules darken toward black in 2D, for scan contrast. */
const SCAN_DARKEN = 0.55;

export interface InstancedCity {
  mesh: THREE.InstancedMesh;
  /** progress 0 = full 3D skyline, 1 = flat high-contrast top-down QR. */
  apply(progress: number): void;
}

/**
 * One InstancedMesh for the whole city (single draw call). `apply` interpolates
 * height AND color: at progress 0 it's the vibrant 3D skyline; at progress 1 it
 * morphs to a scan-optimized flat QR — light modules go white, dark modules keep
 * their hue but darken for strong contrast (standard dark-on-light = best scan).
 */
export function createInstancedBlocks(scene: BlockScene): InstancedCity {
  const palette = getPalette(scene.paletteId);
  const geometry = createBlockGeometry();
  const material = createBlockMaterial();
  const mesh = new THREE.InstancedMesh(geometry, material, scene.blocks.length);

  const center = (scene.size - 1) / 2;
  const dummy = new THREE.Object3D();
  const tmp = new THREE.Color();
  const black = new THREE.Color(0x000000);
  const scanLight = new THREE.Color(palette.scanLight);

  const count = scene.blocks.length;
  const heights: number[] = [];
  const baseColors: THREE.Color[] = [];
  const scanColors: THREE.Color[] = [];
  // per-instance window-shader attributes
  const aSeed = new Float32Array(count);
  const aBuilding = new Float32Array(count);
  const aHeight = new Float32Array(count);

  scene.blocks.forEach((block, i) => {
    heights.push(block.height);
    const variants = colorsForType(palette, block.type);
    const base = new THREE.Color(variants[block.colorVariant] ?? variants[0] ?? '#ffffff');
    baseColors.push(base);
    // light modules (streets) -> white; dark modules -> darkened hue
    scanColors.push(
      block.type === 'ground' ? scanLight.clone() : base.clone().lerp(black, SCAN_DARKEN),
    );
    // windows only on buildings/towers
    aBuilding[i] = block.type === 'building' || block.type === 'tower' ? 1 : 0;
    aHeight[i] = block.height;
    aSeed[i] = (Math.sin(block.x * 12.9898 + block.z * 78.233) * 43758.5453) % 1;
  });

  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
  geometry.setAttribute('aBuilding', new THREE.InstancedBufferAttribute(aBuilding, 1));
  geometry.setAttribute('aHeight', new THREE.InstancedBufferAttribute(aHeight, 1));

  function apply(progress: number): void {
    const p = Math.min(1, Math.max(0, progress));
    const shader = material.userData.shader as { uniforms: { uWindowStrength: { value: number } } } | undefined;
    if (shader) shader.uniforms.uWindowStrength.value = 1 - p;
    scene.blocks.forEach((block, i) => {
      const h = heights[i] * (1 - p) + FLAT_HEIGHT * p;
      dummy.position.set(block.x - center, 0, block.z - center);
      dummy.scale.set(block.width, Math.max(h, 0.001), block.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      tmp.copy(baseColors[i]).lerp(scanColors[i], p);
      mesh.setColorAt(i, tmp);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  apply(0);
  return { mesh, apply };
}
