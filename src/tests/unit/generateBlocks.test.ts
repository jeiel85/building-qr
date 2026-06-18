import { beforeAll, describe, expect, it } from 'vitest';
import { generateBlocks, generateQrMatrix, type QrMatrix } from '@/features/building-qr';

let matrix: QrMatrix;
beforeAll(() => {
  matrix = generateQrMatrix('https://github.com/jeiel85/building-qr');
});

describe('generateBlocks', () => {
  it('emits one block per module', () => {
    const scene = generateBlocks(matrix);
    expect(scene.blockCount).toBe(matrix.size * matrix.size);
    expect(scene.truncated).toBe(false);
    expect(scene.size).toBe(matrix.size);
  });

  it('is deterministic for the same input + preset + palette', () => {
    const a = generateBlocks(matrix, { presetId: 'dusk-city' });
    const b = generateBlocks(matrix, { presetId: 'dusk-city' });
    expect(a.blocks).toEqual(b.blocks);
  });

  it('preserves finder patterns as critical landmark towers', () => {
    const scene = generateBlocks(matrix);
    const finderBlocks = scene.blocks.filter((b) => b.type === 'finderTower');
    // 3 finder patterns x 33 dark modules each (spec-fixed)
    expect(finderBlocks.length).toBe(99);
    expect(finderBlocks.every((b) => b.isQrCritical)).toBe(true);
    const corner = scene.blocks.find((b) => b.qrModuleX === 0 && b.qrModuleY === 0);
    expect(corner?.type).toBe('finderTower');
  });

  it('maps light modules to non-critical ground tiles', () => {
    const scene = generateBlocks(matrix);
    const ground = scene.blocks.filter((b) => b.type === 'ground');
    expect(ground.length).toBeGreaterThan(0);
    expect(ground.every((b) => !b.isQrCritical)).toBe(true);
    expect(ground.every((b) => b.height < 1)).toBe(true);
  });

  it('respects the block cap', () => {
    const scene = generateBlocks(matrix, { maxBlocks: 100 });
    expect(scene.blockCount).toBeLessThanOrEqual(100);
    expect(scene.truncated).toBe(true);
  });

  it('reports the palette background and grid ids', () => {
    const scene = generateBlocks(matrix, { paletteId: 'sunrise' });
    expect(scene.background).toBe('#2a1530');
    expect(scene.blocks[0].id).toBe('0-0');
    expect(scene.blocks.every((b) => b.x === b.qrModuleX && b.z === b.qrModuleY)).toBe(true);
  });
});
