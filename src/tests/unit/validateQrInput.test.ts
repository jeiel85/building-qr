import { describe, expect, it } from 'vitest';
import { validateQrInput } from '@/features/building-qr';

describe('validateQrInput', () => {
  it('rejects empty and whitespace-only input', () => {
    for (const value of ['', '   ', '\n\t']) {
      const v = validateQrInput(value);
      expect(v.ok).toBe(false);
      expect(v.level).toBe('bad');
      expect(v.length).toBe(0);
    }
  });

  it('accepts a short link as good', () => {
    const v = validateQrInput('https://a.bc');
    expect(v.ok).toBe(true);
    expect(v.level).toBe('good');
    expect(v.isTooLong).toBe(false);
  });

  it('warns when over the recommended length', () => {
    const v = validateQrInput('a'.repeat(85));
    expect(v.ok).toBe(true);
    expect(v.level).toBe('warning');
    expect(v.isTooLong).toBe(false);
  });

  it('flags very long input as too long (still generatable)', () => {
    const v = validateQrInput('a'.repeat(130));
    expect(v.ok).toBe(true);
    expect(v.level).toBe('warning');
    expect(v.isTooLong).toBe(true);
  });

  it('refuses pathologically long input', () => {
    const v = validateQrInput('a'.repeat(1001));
    expect(v.ok).toBe(false);
    expect(v.level).toBe('bad');
    expect(v.isTooLong).toBe(true);
  });
});
