import * as THREE from 'three';

/** Soft ambient + a key/fill directional pair for the isometric face shading. */
export function addLights(scene: THREE.Scene): void {
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));

  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(-1.2, 2.4, 1.4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x9bb0ff, 0.25);
  fill.position.set(1.5, 0.6, -1);
  scene.add(fill);
}
