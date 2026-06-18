import { describe, expect, it } from 'vitest';
import { hashSeed, makeRng } from '@/features/building-qr';

describe('seededRandom', () => {
  it('hashSeed is stable and differs by input', () => {
    expect(hashSeed('abc')).toBe(hashSeed('abc'));
    expect(hashSeed('abc')).not.toBe(hashSeed('abd'));
    expect(hashSeed('x')).toBeGreaterThanOrEqual(0);
  });

  it('makeRng is deterministic and bounded in [0, 1)', () => {
    const a = makeRng('seed');
    const b = makeRng('seed');
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
    for (const v of seqA) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('different seeds diverge', () => {
    expect(makeRng('one')()).not.toBe(makeRng('two')());
  });
});
