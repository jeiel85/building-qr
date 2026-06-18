import { create } from 'zustand';
import { REPO_URL } from '@/shared/constants/app';

/**
 * Phase 1 store: just the raw input. QR matrix, art, render, view-mode, and
 * export slices are added in later phases (see docs/design/05_data_model.md).
 */
export interface BuildingQrState {
  input: string;
  setInput: (value: string) => void;
  applySample: () => void;
  clear: () => void;
}

const SAMPLE_INPUT = REPO_URL;

export const useBuildingQrStore = create<BuildingQrState>((set) => ({
  input: '',
  setInput: (value) => set({ input: value }),
  applySample: () => set({ input: SAMPLE_INPUT }),
  clear: () => set({ input: '' }),
}));
