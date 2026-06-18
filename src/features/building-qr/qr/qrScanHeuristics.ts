import type { MatrixRegion, ScanReliability } from './qrTypes';

/** Minimum quiet-zone margin (modules) per the QR spec. */
export const DEFAULT_QUIET_ZONE = 4;

/** Side length of a finder pattern, in modules. */
export const FINDER_PATTERN_SIZE = 7;

/**
 * Largest matrix we treat as comfortably scannable. version 6 = 41x41
 * (docs/design/04_qr_scan_reliability.md). Above this we flag `bad`.
 */
export const MAX_SCANNABLE_MATRIX_SIZE = 41;

/** Average stacked building layers used to estimate rendered block count. */
const AVG_BUILDING_LAYERS = 3;

/** Full grid size including the quiet zone on both sides. */
export function quietZoneGridSize(size: number, quietZone: number = DEFAULT_QUIET_ZONE): number {
  return size + quietZone * 2;
}

/** The three finder-pattern regions (top-left, top-right, bottom-left). */
export function getFinderPatternRegions(size: number): MatrixRegion[] {
  const last = size - FINDER_PATTERN_SIZE;
  return [
    { name: 'top-left', row: 0, col: 0, size: FINDER_PATTERN_SIZE },
    { name: 'top-right', row: 0, col: last, size: FINDER_PATTERN_SIZE },
    { name: 'bottom-left', row: last, col: 0, size: FINDER_PATTERN_SIZE },
  ];
}

/** Whether (row, col) falls inside any finder pattern. */
export function isInFinderPattern(row: number, col: number, size: number): boolean {
  return getFinderPatternRegions(size).some(
    (r) => row >= r.row && row < r.row + r.size && col >= r.col && col < r.col + r.size,
  );
}

/** Count dark modules — these become the buildings in the 3D scene. */
export function countDarkModules(modules: boolean[][]): number {
  let count = 0;
  for (const row of modules) {
    for (const cell of row) {
      if (cell) count += 1;
    }
  }
  return count;
}

export interface ReliabilityInput {
  matrixSize: number;
  inputLength: number;
  darkModuleCount: number;
}

/**
 * Score how reliably this QR is likely to scan. Matrix size dominates (a too-large
 * symbol is the main failure mode); long input is a softer warning.
 */
export function assessScanReliability({
  matrixSize,
  inputLength,
  darkModuleCount,
}: ReliabilityInput): ScanReliability {
  const reasons: string[] = [];
  let level: ScanReliability['level'] = 'good';

  if (matrixSize > MAX_SCANNABLE_MATRIX_SIZE) {
    level = 'bad';
    reasons.push('QR 구조가 너무 복잡합니다. 짧은 URL로 바꾸면 안정적으로 스캔됩니다.');
  } else if (inputLength >= 120) {
    level = 'warning';
    reasons.push('입력이 길어 일부 카메라에서 인식이 느릴 수 있습니다. 스캔용 보기나 짧은 링크를 권장합니다.');
  } else if (inputLength > 80) {
    level = 'warning';
    reasons.push('입력이 다소 깁니다. 짧은 URL일수록 스캔이 안정적입니다.');
  }

  if (level === 'good') {
    reasons.push('스캔용 보기에서 안정적으로 인식될 가능성이 높습니다.');
  }

  const estimatedBlockCount =
    matrixSize * matrixSize + darkModuleCount * (AVG_BUILDING_LAYERS - 1);

  return { level, reasons, matrixSize, darkModuleCount, estimatedBlockCount };
}
