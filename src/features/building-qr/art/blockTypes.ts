/**
 * Building-skyline reinterpretation of the QR art (see memory: theme pivot from
 * the cherry-blossom design bundle). Dark modules rise as buildings, light
 * modules are ground/streets.
 */
export type BlockType = 'ground' | 'road' | 'building' | 'tower' | 'park' | 'finderTower';

export interface BlockData {
  id: string;
  /** Grid column (x axis). */
  x: number;
  /** Grid row (z axis). */
  z: number;
  /** Base elevation (0 = ground). */
  y: number;
  width: number;
  depth: number;
  /** Vertical extent in grid units ("floors"). */
  height: number;
  type: BlockType;
  /** Index into the palette array for this block's type. */
  colorVariant: number;
  qrModuleX: number;
  qrModuleY: number;
  /** Finder-pattern / scan-critical module — never decorated away. */
  isQrCritical: boolean;
}

/** Hard cap on emitted blocks (docs/design/03_rendering_design.md). */
export const MAX_BLOCKS = 8000;

/** One block occupies one grid unit footprint. */
export const BLOCK_UNIT = 1;

/** Flat ground tiles sit just above zero so they read as a surface. */
export const GROUND_HEIGHT = 0.12;
