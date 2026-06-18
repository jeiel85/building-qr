import { describe, expect, it } from 'vitest';
import {
  assessScanReliability,
  countDarkModules,
  getFinderPatternRegions,
  isInFinderPattern,
  quietZoneGridSize,
} from '@/features/building-qr';

describe('finder patterns', () => {
  it('locates three 7x7 regions at the correct corners', () => {
    const regions = getFinderPatternRegions(21);
    expect(regions).toHaveLength(3);
    expect(regions.map((r) => r.name)).toEqual(['top-left', 'top-right', 'bottom-left']);
    expect(regions.every((r) => r.size === 7)).toBe(true);
    expect(regions[1]).toMatchObject({ row: 0, col: 14 }); // top-right
    expect(regions[2]).toMatchObject({ row: 14, col: 0 }); // bottom-left
  });

  it('detects membership inside finder regions', () => {
    expect(isInFinderPattern(0, 0, 21)).toBe(true);
    expect(isInFinderPattern(0, 20, 21)).toBe(true); // top-right corner
    expect(isInFinderPattern(20, 0, 21)).toBe(true); // bottom-left corner
    expect(isInFinderPattern(10, 10, 21)).toBe(false); // data region
    expect(isInFinderPattern(20, 20, 21)).toBe(false); // no finder bottom-right
  });
});

describe('quiet zone', () => {
  it('adds the margin on both sides', () => {
    expect(quietZoneGridSize(21, 4)).toBe(29);
    expect(quietZoneGridSize(41)).toBe(49); // default quiet zone = 4
  });
});

describe('countDarkModules', () => {
  it('counts true cells', () => {
    expect(
      countDarkModules([
        [true, false],
        [true, true],
      ]),
    ).toBe(3);
  });
});

describe('assessScanReliability', () => {
  it('is good for a small, short-input matrix', () => {
    const r = assessScanReliability({ matrixSize: 21, inputLength: 10, darkModuleCount: 100 });
    expect(r.level).toBe('good');
    expect(r.estimatedBlockCount).toBe(21 * 21 + 100 * 2);
  });

  it('is bad when the matrix exceeds the scannable size', () => {
    const r = assessScanReliability({ matrixSize: 45, inputLength: 10, darkModuleCount: 300 });
    expect(r.level).toBe('bad');
  });

  it('warns on long input within a scannable matrix', () => {
    const r = assessScanReliability({ matrixSize: 33, inputLength: 130, darkModuleCount: 200 });
    expect(r.level).toBe('warning');
  });
});
