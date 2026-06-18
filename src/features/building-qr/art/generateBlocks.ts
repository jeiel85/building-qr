import { isInFinderPattern, type QrMatrix } from '../qr';
import {
  BLOCK_UNIT,
  GROUND_HEIGHT,
  MAX_BLOCKS,
  type BlockData,
  type BlockType,
} from './blockTypes';
import { DEFAULT_PRESET_ID, getPreset } from './presets';
import { colorsForType, getPalette } from './palette';
import { makeRng } from './seededRandom';

export interface GenerateBlocksOptions {
  presetId?: string;
  paletteId?: string;
  maxBlocks?: number;
}

export interface BlockScene {
  blocks: BlockData[];
  blockCount: number;
  truncated: boolean;
  size: number;
  presetId: string;
  paletteId: string;
  background: string;
}

/**
 * Pure: turn a QR matrix into building block data. Deterministic for a given
 * (input, preset, palette). Light modules become ground; dark modules become
 * buildings/towers/parks, with finder patterns preserved as landmark towers
 * (isQrCritical) so the scan structure is never decorated away.
 */
export function generateBlocks(matrix: QrMatrix, options: GenerateBlocksOptions = {}): BlockScene {
  const preset = getPreset(options.presetId ?? DEFAULT_PRESET_ID);
  const paletteId = options.paletteId ?? preset.paletteId;
  const palette = getPalette(paletteId);
  const maxBlocks = options.maxBlocks ?? MAX_BLOCKS;

  const size = matrix.size;
  const rng = makeRng(`${matrix.input}|${preset.id}|${paletteId}`);
  const center = (size - 1) / 2;
  const maxRadius = Math.hypot(center, center) || 1;

  const blocks: BlockData[] = [];
  let truncated = false;

  for (let row = 0; row < size && !truncated; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (blocks.length >= maxBlocks) {
        truncated = true;
        break;
      }

      const isDark = matrix.modules[row][col];
      let type: BlockType;
      let height: number;
      let isQrCritical = false;

      if (!isDark) {
        type = 'ground';
        height = GROUND_HEIGHT;
      } else if (isInFinderPattern(row, col, size)) {
        type = 'finderTower';
        height = preset.finderTowerHeight;
        isQrCritical = true;
      } else {
        const dist = Math.hypot(col - center, row - center) / maxRadius;
        const roll = rng();
        if (roll < preset.parkChance && dist > preset.centerRadiusFactor) {
          type = 'park';
          height = 0.4 + rng() * 0.4;
        } else if (dist < preset.centerRadiusFactor) {
          type = 'tower';
          height = preset.maxBuildingHeight * 0.7 + rng() * preset.towerHeightBoost;
        } else {
          type = 'building';
          height = 1 + rng() * (preset.maxBuildingHeight - 1);
        }
      }

      const variants = colorsForType(palette, type);
      const colorVariant = Math.floor(rng() * variants.length);

      blocks.push({
        id: `${row}-${col}`,
        x: col,
        z: row,
        y: 0,
        width: BLOCK_UNIT,
        depth: BLOCK_UNIT,
        height,
        type,
        colorVariant,
        qrModuleX: col,
        qrModuleY: row,
        isQrCritical,
      });
    }
  }

  return {
    blocks,
    blockCount: blocks.length,
    truncated,
    size,
    presetId: preset.id,
    paletteId,
    background: palette.background,
  };
}
