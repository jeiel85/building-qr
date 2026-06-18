import * as THREE from 'three';

/** Dusk night-sky scene (fog is added/animated by the renderer per progress). */
export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#120b30');
  return scene;
}
