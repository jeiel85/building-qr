import { describe, expect, it } from 'vitest';
import { moduleSizeForResolution, qrLayout } from '@/features/building-qr';

describe('qrLayout', () => {
  it('adds the quiet zone on both sides and sizes pixels', () => {
    const l = qrLayout(21, 4, 8);
    expect(l.modules).toBe(29); // 21 + 4*2
    expect(l.pixels).toBe(232); // 29 * 8
    expect(l.moduleSize).toBe(8);
    expect(l.quietZone).toBe(4);
  });

  it('scales with module size and matrix size', () => {
    expect(qrLayout(41, 4, 8).modules).toBe(49);
    expect(qrLayout(41, 4, 16).pixels).toBe(49 * 16);
  });
});

describe('moduleSizeForResolution', () => {
  it('fits the largest whole module size into the target resolution', () => {
    expect(moduleSizeForResolution(29, 4, 1024)).toBe(Math.floor(1024 / 37));
    expect(moduleSizeForResolution(29, 4, 2048)).toBe(Math.floor(2048 / 37));
  });

  it('never goes below 1', () => {
    expect(moduleSizeForResolution(177, 4, 100)).toBe(1);
  });
});
