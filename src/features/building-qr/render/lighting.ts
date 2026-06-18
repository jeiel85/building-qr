import * as THREE from 'three';

export interface SceneLights {
  ambient: THREE.AmbientLight;
  key: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
}

/** Soft ambient + key/fill directional pair for the isometric face shading. */
export function createLights(): SceneLights {
  const ambient = new THREE.AmbientLight(0xffffff, 0.62);
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(-1.2, 2.4, 1.4);
  const fill = new THREE.DirectionalLight(0x9bb0ff, 0.25);
  fill.position.set(1.5, 0.6, -1);
  return { ambient, key, fill };
}
