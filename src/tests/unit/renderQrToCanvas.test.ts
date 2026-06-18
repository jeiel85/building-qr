import { describe, expect, it } from 'vitest';
import { qrLayout } from '@/features/building-qr';

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
