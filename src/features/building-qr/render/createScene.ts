import * as THREE from 'three';
import { addLights } from './lighting';

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  addLights(scene);
  return scene;
}
