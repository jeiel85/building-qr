import * as THREE from 'three';
import { colorsForType, getPalette, type BlockScene } from '../art';
import { createBlockGeometry, createBlockMaterial } from './materials';

/** Near-flat height for the scan (top-down) end-state. */
const SCAN_FLAT_HEIGHT = 0.08;

export interface InstancedCity {
  mesh: THREE.InstancedMesh;
  /** progress 0 = full 3D art, 1 = flat high-contrast top-down scan. */
  apply(progress: number): void;
}

/**
 * One InstancedMesh for the whole city (single draw call). `apply(progress)`
 * interpolates every instance between the 3D skyline and a flat black/white
 * top-down QR so the renderer can morph between art and scan modes.
 */
export function createInstancedBlocks(scene: BlockScene): InstancedCity {
  const palette = getPalette(scene.paletteId);
  const geometry = createBlockGeometry();
  const material = createBlockMaterial();
  const mesh = new THREE.InstancedMesh(geometry, material, scene.blocks.length);

  const center = (scene.size - 1) / 2;
  const dummy = new THREE.Object3D();
  const tmp = new THREE.Color();

  const baseColors: THREE.Color[] = [];
  const scanColors: THREE.Color[] = [];
  const heights: number[] = [];
  const scanDark = new THREE.Color(palette.scanDark);
  const scanLight = new THREE.Color(palette.scanLight);

  scene.blocks.forEach((block) => {
    const variants = colorsForType(palette, block.type);
    baseColors.push(new THREE.Color(variants[block.colorVariant] ?? variants[0] ?? '#ffffff'));
    scanColors.push(block.type === 'ground' ? scanLight : scanDark);
    heights.push(block.height);
  });

  function apply(progress: number): void {
    const p = Math.min(1, Math.max(0, progress));
    scene.blocks.forEach((block, i) => {
      const h = heights[i] * (1 - p) + SCAN_FLAT_HEIGHT * p;
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
