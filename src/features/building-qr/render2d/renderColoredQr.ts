import { colorsForType, getPalette, type BlockScene } from '../art';
import { DEFAULT_QUIET_ZONE } from '../qr';
import { qrLayout, type Qr2dOptions, type QrLayout } from './renderQrToCanvas';

/**
 * Colored export: each QR module is drawn in its building/ground color (the
 * same palette as the 3D city), with the quiet zone in the background color.
 * Prettier but lower-contrast than the black/white scan-safe export.
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

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, layout.pixels, layout.pixels);

  for (const block of scene.blocks) {
    const variants = colorsForType(palette, block.type);
    ctx.fillStyle = variants[block.colorVariant] ?? variants[0] ?? '#ffffff';
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
