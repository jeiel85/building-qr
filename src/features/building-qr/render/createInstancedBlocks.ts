import * as THREE from 'three';
import { colorsForType, getPalette, type BlockScene } from '../art';
import { createBlockGeometry, createBlockMaterial } from './materials';

/** Near-flat height for the top-down 2D end-state (buildings keep their color). */
const FLAT_HEIGHT = 0.06;

export interface InstancedCity {
  mesh: THREE.InstancedMesh;
  /** progress 0 = full 3D skyline, 1 = flat top-down (colors preserved). */
  apply(progress: number): void;
}

/**
 * One InstancedMesh for the whole city (single draw call). Colors are set once
 * (the building palette is kept in both 3D and the flat 2D view); `apply`
 * only interpolates height so the city lies down without losing its color.
 */
export function createInstancedBlocks(scene: BlockScene): InstancedCity {
  const palette = getPalette(scene.paletteId);
  const geometry = createBlockGeometry();
  const material = createBlockMaterial();
  const mesh = new THREE.InstancedMesh(geometry, material, scene.blocks.length);

  const center = (scene.size - 1) / 2;
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const heights: number[] = [];

  scene.blocks.forEach((block, i) => {
    heights.push(block.height);
    const variants = colorsForType(palette, block.type);
    color.set(variants[block.colorVariant] ?? variants[0] ?? '#ffffff');
    mesh.setColorAt(i, color);
  });
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  function apply(progress: number): void {
    const p = Math.min(1, Math.max(0, progress));
    scene.blocks.forEach((block, i) => {
      const h = heights[i] * (1 - p) + FLAT_HEIGHT * p;
      dummy.position.set(block.x - center, 0, block.z - center);
      dummy.scale.set(block.width, Math.max(h, 0.001), block.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  apply(0);
  return { mesh, apply };
}
