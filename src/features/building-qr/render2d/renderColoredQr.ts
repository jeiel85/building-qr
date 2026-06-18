import { colorsForType, getPalette, type BlockScene } from '../art';
import { DEFAULT_QUIET_ZONE } from '../qr';
import { qrLayout, type Qr2dOptions, type QrLayout } from './renderQrToCanvas';

/** Darken a #rrggbb color toward black by `amount` (0..1). */
function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `rgb(${r},${g},${b})`;
}

const SCAN_DARKEN = 0.55;

/**
 * Colored export: a white background with each dark QR module drawn in a
 * darkened version of its building/ground hue. Keeps the color identity while
 * giving standard dark-on-light contrast so it scans reliably.
 */
export function drawColoredQrToCanvas(
  canvas: HTMLCanvasElement,
  scene: BlockScene,
  options: Qr2dOptions = {},
): QrLayout {
  const moduleSize = options.moduleSize ?? 8;
  const quietZone = options.quietZone ?? DEFAULT_QUIET_ZONE;
  const palette = getPalette(scene.paletteId);

  const layout = qrLayout(scene.size, quietZone, moduleSize);
  canvas.width = layout.pixels;
  canvas.height = layout.pixels;

  const ctx = canvas.getContext('2d');
  if (!ctx) return layout;

  if (options.transparent) {
    ctx.clearRect(0, 0, layout.pixels, layout.pixels);
  } else {
    ctx.fillStyle = palette.scanLight; // white background = light modules + quiet zone
    ctx.fillRect(0, 0, layout.pixels, layout.pixels);
  }

  for (const block of scene.blocks) {
    // Light (street) modules stay as the white background.
    if (block.type === 'ground') continue;
    const variants = colorsForType(palette, block.type);
    const base = variants[block.colorVariant] ?? variants[0] ?? '#ffffff';
    ctx.fillStyle = darken(base, SCAN_DARKEN);
    ctx.fillRect(
      (block.x + quietZone) * moduleSize,
      (block.z + quietZone) * moduleSize,
      moduleSize,
      moduleSize,
    );
  }
  return layout;
}

export function coloredQrToPngBlob(scene: BlockScene, options: Qr2dOptions = {}): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    drawColoredQrToCanvas(canvas, scene, options);
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG 생성에 실패했습니다.'));
    }, 'image/png');
  });
}
