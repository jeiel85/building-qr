import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { CameraController } from '@/features/building-qr/render/cameraController';

/** Screen-space vector from world `a` to world `b` after projection. */
function screenVec(cam: THREE.Camera, a: THREE.Vector3, b: THREE.Vector3): [number, number] {
  const pa = a.clone().project(cam);
  const pb = b.clone().project(cam);
  return [pb.x - pa.x, pb.y - pa.y];
}

/** 0 = perfectly axis-aligned (one component ~0), ~1 = diagonal (45°). */
function offAxisRatio([x, y]: [number, number]): number {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  return Math.min(ax, ay) / Math.max(ax, ay);
}

function alignmentAtAzimuth(azimuth: number) {
  const cc = new CameraController(21);
  cc.setAspect(1);
  cc.setAngle(azimuth);
  cc.setProgress(1); // fully flat / top-down
  cc.camera.updateMatrixWorld(true);
  const origin = new THREE.Vector3(0, 0, 0);
  const sx = screenVec(cc.camera, origin, new THREE.Vector3(1, 0, 0));
  const sz = screenVec(cc.camera, origin, new THREE.Vector3(0, 0, 1));
  return { sx, sz };
}

describe('CameraController 2D alignment', () => {
  it('renders an axis-aligned grid at every snapped (90°) azimuth', () => {
    for (const az of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 8 * Math.PI]) {
      const { sx, sz } = alignmentAtAzimuth(az);
      expect(offAxisRatio(sx), `X axis @ ${az}`).toBeLessThan(0.05);
      expect(offAxisRatio(sz), `Z axis @ ${az}`).toBeLessThan(0.05);
    }
  });

  it('world X and Z map to perpendicular screen axes (one horizontal, one vertical)', () => {
    const { sx, sz } = alignmentAtAzimuth(Math.PI / 2);
    // one axis is horizontal (|x| dominates), the other vertical (|y| dominates)
    const xHoriz = Math.abs(sx[0]) > Math.abs(sx[1]);
    const zHoriz = Math.abs(sz[0]) > Math.abs(sz[1]);
    expect(xHoriz).not.toBe(zHoriz);
  });

  it('a non-snapped azimuth (45°) is clearly NOT axis-aligned', () => {
    const { sx } = alignmentAtAzimuth(Math.PI / 4);
    expect(offAxisRatio(sx)).toBeGreaterThan(0.3);
  });
});

describe('CameraController 2D framing (no clipping)', () => {
  const SIZE = 29;
  const half = SIZE / 2;
  const corners = [
    new THREE.Vector3(-half, 0, -half),
    new THREE.Vector3(half, 0, -half),
    new THREE.Vector3(-half, 0, half),
    new THREE.Vector3(half, 0, half),
  ];

  it('keeps the whole QR footprint inside the frustum at any aspect', () => {
    for (const aspect of [0.5, 0.7, 1, 1.6]) {
      const cc = new CameraController(SIZE);
      cc.setAspect(aspect);
      cc.setAngle(0);
      cc.setProgress(1);
      cc.camera.updateMatrixWorld(true);
      for (const corner of corners) {
        const ndc = corner.clone().project(cc.camera);
        expect(Math.abs(ndc.x), `x @ aspect ${aspect}`).toBeLessThan(0.99);
        expect(Math.abs(ndc.y), `y @ aspect ${aspect}`).toBeLessThan(0.99);
      }
    }
  });
});
