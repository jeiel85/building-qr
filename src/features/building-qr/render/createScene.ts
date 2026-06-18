import * as THREE from 'three';

/** Bare scene; lights are owned by the renderer so it can animate intensities. */
export function createScene(): THREE.Scene {
  return new THREE.Scene();
}
