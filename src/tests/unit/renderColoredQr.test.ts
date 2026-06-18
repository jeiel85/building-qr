import { describe, expect, it } from 'vitest';
import { drawColoredQrToCanvas, generateBlocks, generateQrMatrix } from '@/features/building-qr';

describe('drawColoredQrToCanvas', () => {
  it('sizes the canvas to the quiet-zone grid', () => {
    const matrix = generateQrMatrix('https://building-qr.vercel.app');
    const scene = generateBlocks(matrix);
    const canvas = document.createElement('canvas');
    const layout = drawColoredQrToCanvas(canvas, scene, { moduleSize: 8 });
    expect(layout.modules).toBe(scene.size + 8); // quiet zone 4 each side
    expect(layout.pixels).toBe(layout.modules * 8);
    expect(canvas.width).toBe(layout.pixels);
  });
});
