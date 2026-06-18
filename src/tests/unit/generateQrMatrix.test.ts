import { describe, expect, it } from 'vitest';
import { generateQrMatrix, QrGenerationError } from '@/features/building-qr';

describe('generateQrMatrix', () => {
  it('produces a version-1 21x21 matrix for a tiny input', () => {
    const qr = generateQrMatrix('HI');
    expect(qr.version).toBe(1);
    expect(qr.size).toBe(21);
    expect(qr.modules).toHaveLength(21);
    expect(qr.modules.every((row) => row.length === 21)).toBe(true);
    expect(qr.size).toBe(qr.version * 4 + 17);
  });

  it('renders the top-left finder pattern (dark ring, light gap, dark center)', () => {
    const { modules } = generateQrMatrix('HI');
    expect(modules[0].slice(0, 7).every(Boolean)).toBe(true); // top edge dark
    expect(modules[6].slice(0, 7).every(Boolean)).toBe(true); // finder bottom edge dark
    expect(modules[1][1]).toBe(false); // light ring
    expect(modules[3][3]).toBe(true); // 3x3 center dark
  });

  it('is deterministic for the same input + ECL', () => {
    const a = generateQrMatrix('https://github.com/jeiel85/building-qr');
    const b = generateQrMatrix('https://github.com/jeiel85/building-qr');
    expect(a.modules).toEqual(b.modules);
    expect(a.size).toBe(b.size);
  });

  it('grows the matrix as input gets longer', () => {
    const small = generateQrMatrix('HI');
    const big = generateQrMatrix('x'.repeat(200));
    expect(big.size).toBeGreaterThan(small.size);
  });

  it('throws a user-facing error on empty / whitespace input', () => {
    expect(() => generateQrMatrix('')).toThrow(QrGenerationError);
    expect(() => generateQrMatrix('   ')).toThrow(QrGenerationError);
    try {
      generateQrMatrix('');
    } catch (e) {
      expect((e as QrGenerationError).userMessage).toContain('입력');
    }
  });
});
