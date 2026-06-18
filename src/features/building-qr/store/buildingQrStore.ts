import { create } from 'zustand';
import { REPO_URL } from '@/shared/constants/app';

export type ViewMode = 'art3d' | 'scan2d';

/**
 * Phase 1 store grew with the app: raw input + the current view mode.
 * Matrix/art/render are derived (pure) from input, not stored here.
 */
export interface BuildingQrState {
  input: string;
  viewMode: ViewMode;
  setInput: (value: string) => void;
  applySample: () => void;
  clear: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const SAMPLE_INPUT = REPO_URL;

export const useBuildingQrStore = create<BuildingQrState>((set) => ({
  input: '',
  viewMode: 'art3d',
  setInput: (value) => set({ input: value }),
  applySample: () => set({ input: SAMPLE_INPUT }),
  clear: () => set({ input: '' }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () => set((s) => ({ viewMode: s.viewMode === 'art3d' ? 'scan2d' : 'art3d' })),
}));
