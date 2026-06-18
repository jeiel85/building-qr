import { beforeEach, describe, expect, it } from 'vitest';
import { useBuildingQrStore } from '@/features/building-qr';

describe('buildingQrStore', () => {
  beforeEach(() => {
    useBuildingQrStore.setState({ input: '' });
  });

  it('starts empty', () => {
    expect(useBuildingQrStore.getState().input).toBe('');
  });

  it('setInput updates the input', () => {
    useBuildingQrStore.getState().setInput('https://example.com');
    expect(useBuildingQrStore.getState().input).toBe('https://example.com');
  });

  it('applySample fills a non-empty sample link', () => {
    useBuildingQrStore.getState().applySample();
    expect(useBuildingQrStore.getState().input.length).toBeGreaterThan(0);
    expect(useBuildingQrStore.getState().input).toMatch(/^https?:\/\//);
  });

  it('clear resets the input', () => {
    useBuildingQrStore.getState().setInput('something');
    useBuildingQrStore.getState().clear();
    expect(useBuildingQrStore.getState().input).toBe('');
  });
});
