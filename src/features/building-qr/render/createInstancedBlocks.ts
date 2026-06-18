import * as THREE from 'three';
import { colorsForType, getPalette, type BlockScene } from '../art';
import { createBlockGeometry, createBlockMaterial } from './materials';

/**
 * One InstancedMesh for the whole city — a single draw call for thousands of
 * blocks. Position/scale per instance encode the building footprint + height;
 * setColorAt carries the palette color.
 */
export function createInstancedBlocks(scene: BlockScene): THREE.InstancedMesh {
  const palette = getPalette(scene.paletteId);
  const geometry = createBlockGeometry();
  const material = createBlockMaterial();
  const mesh = new THREE.InstancedMesh(geometry, material, scene.blocks.length);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const center = (scene.size - 1) / 2;

  scene.blocks.forEach((block, i) => {
    dummy.position.set(block.x - center, block.y, block.z - center);
    dummy.scale.set(block.width, Math.max(block.height, 0.001), block.depth);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    const variants = colorsForType(palette, block.type);
    color.set(variants[block.colorVariant] ?? variants[0] ?? '#ffffff');
    mesh.setColorAt(i, color);
  });

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}
