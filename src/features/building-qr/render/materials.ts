import * as THREE from 'three';

/** Unit cube whose base sits at y=0 so scaling y grows it upward from the ground. */
export function createBlockGeometry(): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  return geo;
}

/**
 * White lit material with emissive window lights injected via a shader patch.
 * Per-instance attributes (aSeed/aBuilding/aHeight) drive a window grid on the
 * side faces; the `uWindowStrength` uniform fades the windows out in 2D so scan
 * contrast is unaffected. Per-instance color still comes from setColorAt.
 */
export function createBlockMaterial(): THREE.MeshLambertMaterial {
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  material.defines = { ...material.defines, USE_UV: '' };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindowStrength = { value: 1 };

    shader.vertexShader =
      `attribute float aSeed;
       attribute float aBuilding;
       attribute float aHeight;
       varying vec3 vWinNormal;
       varying float vWinSeed;
       varying float vWinBuilding;
       varying float vWinHeight;
      ` +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vWinNormal = normal;
         vWinSeed = aSeed;
         vWinBuilding = aBuilding;
         vWinHeight = aHeight;`,
      );

    shader.fragmentShader =
      `uniform float uWindowStrength;
       varying vec3 vWinNormal;
       varying float vWinSeed;
       varying float vWinBuilding;
       varying float vWinHeight;
      ` +
      shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
         {
           float isSide = step(abs(vWinNormal.y), 0.5);
           float rows = max(1.0, floor(vWinHeight * 1.3));
           vec2 g = vec2(2.0, rows);
           vec2 cf = fract(vUv * g);
           vec2 cid = floor(vUv * g);
           float wx = step(0.24, cf.x) * step(cf.x, 0.76);
           float wy = step(0.18, cf.y) * step(cf.y, 0.82);
           float hsh = fract(sin(dot(cid + vec2(vWinSeed * 53.0), vec2(12.9898, 78.233))) * 43758.5453);
           float lit = step(0.45, hsh);
           float glow = isSide * vWinBuilding * wx * wy * lit * uWindowStrength;
           totalEmissiveRadiance += vec3(1.0, 0.86, 0.55) * glow;
         }`,
      );

    material.userData.shader = shader;
  };

  return material;
}
