/**
 * Compose a branded share card: the QR (or 3D art) on a dusk-gradient
 * background with the Building QR wordmark + caption — so a shared image looks
 * intentional, not like a bare QR. The QR sits on a white card (quiet zone +
 * high contrast preserved) so scannability is unaffected.
 */

export interface ShareCardOptions {
  kind: 'qr' | 'art';
  size?: number;
  caption?: string;
  footer?: string;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG 생성에 실패했습니다.'));
    }, 'image/png');
  });
}

export function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 불러오지 못했습니다.'));
    };
    img.src = url;
  });
}

const FONT_STACK = 'system-ui, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';

function drawMark(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  const u = s / 46;
  const rr = (gx: number, gy: number, w: number, h: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + gx * u, y + gy * u, w * u, h * u, r * u);
    ctx.fill();
  };
  const finder = (gx: number, gy: number) => {
    rr(gx, gy, 18, 18, 4, '#f59f00');
    rr(gx + 4, gy + 4, 10, 10, 2.5, '#1d1450');
    rr(gx + 6.5, gy + 6.5, 5, 5, 1.5, '#f59f00');
  };
  finder(0, 0);
  finder(28, 0);
  finder(0, 28);
  rr(30, 30, 14, 14, 3, '#6be4d8');
}

export function drawShareCard(
  canvas: HTMLCanvasElement,
  content: CanvasImageSource,
  options: ShareCardOptions,
): void {
  const size = options.size ?? 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // background
  const g = ctx.createLinearGradient(0, 0, 0, size);
  g.addColorStop(0, '#120b30');
  g.addColorStop(0.55, '#1d1450');
  g.addColorStop(1, '#321a6e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const glow = ctx.createRadialGradient(size / 2, size * 0.18, 0, size / 2, size * 0.18, size * 0.6);
  glow.addColorStop(0, 'rgba(255,143,199,0.22)');
  glow.addColorStop(1, 'rgba(255,143,199,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // header: mark + wordmark
  const headerY = size * 0.1;
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.round(size * 0.046)}px ${FONT_STACK}`;
  const word = 'Building QR';
  const wordW = ctx.measureText(word).width;
  const markS = size * 0.052;
  const gap = size * 0.02;
  const startX = (size - (markS + gap + wordW)) / 2;
  drawMark(ctx, startX, headerY - markS / 2, markS);
  ctx.fillStyle = '#efeafc';
  ctx.textAlign = 'left';
  ctx.fillText(word, startX + markS + gap, headerY);

  // stage
  const stageSize = size * 0.62;
  const stageX = (size - stageSize) / 2;
  const stageY = size * 0.2;
  ctx.beginPath();
  ctx.roundRect(stageX, stageY, stageSize, stageSize, size * 0.045);
  if (options.kind === 'qr') {
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    const pad = stageSize * 0.08;
    ctx.drawImage(content, stageX + pad, stageY + pad, stageSize - 2 * pad, stageSize - 2 * pad);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
    ctx.drawImage(content, stageX, stageY, stageSize, stageSize);
  }

  // caption + footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#efeafc';
  ctx.font = `600 ${Math.round(size * 0.033)}px ${FONT_STACK}`;
  const caption = options.caption ?? (options.kind === 'qr' ? '스캔해서 열어보세요' : '내가 만든 빌딩숲');
  ctx.fillText(caption, size / 2, stageY + stageSize + size * 0.06);

  ctx.fillStyle = '#b3a9dd';
  ctx.font = `500 ${Math.round(size * 0.024)}px ${FONT_STACK}`;
  ctx.fillText(options.footer ?? 'building-qr.vercel.app', size / 2, size * 0.95);
}
