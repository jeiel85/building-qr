import type { QrMatrix } from '../qr';
import { DEFAULT_QUIET_ZONE } from '../qr';

/** High-contrast colors for scan-safe 2D mode (pure black on white scans best). */
export const SCAN_COLORS = { dark: '#000000', light: '#ffffff' } as const;

export interface Qr2dOptions {
  /** Pixel size of one module. */
  moduleSize?: number;
  /** Quiet-zone margin in modules (defaults to the matrix's own quietZone). */
  quietZone?: number;
  dark?: string;
  light?: string;
  /** Transparent background (light modules + quiet zone become transparent). */
  transparent?: boolean;
}

/** Largest module size that fits a target pixel resolution (>= 1). */
export function moduleSizeForResolution(
  size: number,
  quietZone: number,
  targetPixels: number,
): number {
  return Math.max(1, Math.floor(targetPixels / (size + quietZone * 2)));
}

export interface QrLayout {
  /** Module count per side including quiet zone. */
  modules: number;
  /** Canvas pixel size per side. */
  pixels: number;
  moduleSize: number;
  quietZone: number;
}

/** Pure geometry: total modules + pixel size for a render. */
export function qrLayout(size: number, quietZone: number, moduleSize: number): QrLayout {
  const modules = size + quietZone * 2;
  return { modules, pixels: modules * moduleSize, moduleSize, quietZone };
}

/**
 * Draw a QR matrix to a canvas in scan-safe mode: quiet zone preserved,
 * pure black/white contrast, finder patterns rendered crisply (no decoration).
 */
export function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  matrix: QrMatrix,
  options: Qr2dOptions = {},
): QrLayout {
  const moduleSize = options.moduleSize ?? 8;
  const quietZone = options.quietZone ?? matrix.quietZone ?? DEFAULT_QUIET_ZONE;
  const dark = options.dark ?? SCAN_COLORS.dark;
  const light = options.light ?? SCAN_COLORS.light;

  const layout = qrLayout(matrix.size, quietZone, moduleSize);
  canvas.width = layout.pixels;
  canvas.height = layout.pixels;

  const ctx = canvas.getContext('2d');
  if (!ctx) return layout;

  if (options.transparent) {
    ctx.clearRect(0, 0, layout.pixels, layout.pixels);
  } else {
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, layout.pixels, layout.pixels);
  }

  ctx.fillStyle = dark;
  for (let row = 0; row < matrix.size; row += 1) {
    for (let col = 0; col < matrix.size; col += 1) {
      if (matrix.modules[row][col]) {
        ctx.fillRect(
          (col + quietZone) * moduleSize,
          (row + quietZone) * moduleSize,
          moduleSize,
          moduleSize,
        );
      }
    }
  }
  return layout;
}

/** Render a matrix to a PNG Blob (high-res scan-safe export — Phase 7 expands this). */
export function qrToPngBlob(matrix: QrMatrix, options: Qr2dOptions = {}): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    drawQrToCanvas(canvas, matrix, options);
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG 생성에 실패했습니다.'));
    }, 'image/png');
  });
}
