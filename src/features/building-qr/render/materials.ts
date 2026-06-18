import * as THREE from 'three';

/** Unit cube whose base sits at y=0 so scaling y grows it upward from the ground. */
export function createBlockGeometry(): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  return geo;
}

/** White lit material — per-instance color comes from InstancedMesh.setColorAt. */
export function createBlockMaterial(): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({ color: 0xffffff });
}
