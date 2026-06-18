import { useEffect, useRef } from 'react';
import type { QrMatrix } from '../qr';
import { drawQrToCanvas } from '../render2d/renderQrToCanvas';

interface QrCanvasProps {
  matrix: QrMatrix;
  moduleSize?: number;
}

/** Scan-safe 2D QR preview. Redraws whenever the matrix changes. */
export function QrCanvas({ matrix, moduleSize = 8 }: QrCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) drawQrToCanvas(canvas, matrix, { moduleSize });
  }, [matrix, moduleSize]);

  return (
    <canvas
      ref={ref}
      className="qr-canvas"
      role="img"
      aria-label="스캔 가능한 QR 코드 미리보기"
    />
  );
}
