import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { BlockScene } from '../art';
import type { QrMatrix } from '../qr';
import type { ViewMode } from '../store/buildingQrStore';
import { CityRenderer } from '../render/CityRenderer';
import { isWebGLAvailable } from '@/platform';
import { QrCanvas } from './QrCanvas';

interface RenderViewportProps {
  blockScene: BlockScene;
  matrix: QrMatrix;
  viewMode: ViewMode;
}

export interface RenderViewportHandle {
  /** Capture the current 3D city to a PNG blob at `pixels` square. */
  captureArt(pixels: number): Promise<Blob>;
  /** Whether a live WebGL renderer is available to capture from. */
  canCaptureArt(): boolean;
}

/**
 * 3D city viewport that morphs to a flat top-down view (colors preserved).
 * Falls back to the scannable 2D QR when WebGL is unavailable. Exposes an
 * imperative handle so the export panel can snapshot the 3D art.
 */
export const RenderViewport = forwardRef<RenderViewportHandle, RenderViewportProps>(
  function RenderViewport({ blockScene, matrix, viewMode }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<CityRenderer | null>(null);
    const [webgl] = useState(() => isWebGLAvailable());

    useEffect(() => {
      if (!webgl || !hostRef.current) return;
      const renderer = new CityRenderer(hostRef.current, blockScene);
      rendererRef.current = renderer;
      return () => {
        renderer.dispose();
        rendererRef.current = null;
      };
      // Renderer is created once; scene/view updates handled in the effects below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webgl]);

    useEffect(() => {
      rendererRef.current?.setScene(blockScene);
    }, [blockScene]);

    useEffect(() => {
      rendererRef.current?.setViewMode(viewMode);
    }, [viewMode]);

    useImperativeHandle(
      ref,
      () => ({
        captureArt: (pixels: number) =>
          rendererRef.current
            ? rendererRef.current.capture(pixels)
            : Promise.reject(new Error('3D 미리보기를 사용할 수 없습니다.')),
        canCaptureArt: () => rendererRef.current !== null,
      }),
      [],
    );

    if (!webgl) {
      return (
        <div className="qr-stage">
          <QrCanvas matrix={matrix} moduleSize={8} />
          <p className="qr-caption">WebGL을 사용할 수 없어 스캔용 2D 보기로 표시합니다.</p>
        </div>
      );
    }

    return <div ref={hostRef} className="city-host" role="img" aria-label="빌딩숲 미리보기" />;
  },
);
