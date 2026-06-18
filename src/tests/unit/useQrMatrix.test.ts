import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQrMatrix } from '@/features/building-qr';

describe('useQrMatrix', () => {
  it('returns a matrix + good reliability for a short link', () => {
    const { result } = renderHook(() => useQrMatrix('https://a.bc'));
    expect(result.current.matrix).not.toBeNull();
    expect(result.current.matrix?.size).toBeGreaterThanOrEqual(21);
    expect(result.current.reliability?.level).toBe('good');
    expect(result.current.errorKey).toBeNull();
  });

  it('returns no matrix for empty input', () => {
    const { result } = renderHook(() => useQrMatrix(''));
    expect(result.current.matrix).toBeNull();
    expect(result.current.reliability).toBeNull();
    expect(result.current.validation.ok).toBe(false);
  });

  it('reports the dark-module (building) count', () => {
    const { result } = renderHook(() => useQrMatrix('https://github.com/jeiel85/building-qr'));
    expect(result.current.reliability?.darkModuleCount).toBeGreaterThan(0);
  });
});
