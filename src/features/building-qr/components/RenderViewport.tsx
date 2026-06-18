import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { BlockScene } from '../art';
import type { QrMatrix } from '../qr';
import type { ViewMode } from '../store/buildingQrStore';
import type { CityRenderer } from '../render/CityRenderer';
import { isWebGLAvailable } from '@/platform';
import { useTranslation } from '@/i18n';
import { QrCanvas } from './QrCanvas';

interface RenderViewportProps {
  blockScene: BlockScene;
  matrix: QrMatrix;
  viewMode: ViewMode;
}

export interface RenderViewportHandle {
  captureArt(pixels: number): Promise<Blob>;
  canCaptureArt(): boolean;
}

/**
 * 3D city viewport. Three.js (the renderer) is loaded on demand via a dynamic
 * import so it stays out of the initial bundle. Falls back to the scannable 2D
 * QR when WebGL is unavailable. Exposes an imperative handle for art capture.
 */
export const RenderViewport = forwardRef<RenderViewportHandle, RenderViewportProps>(
  function RenderViewport({ blockScene, matrix, viewMode }, ref) {
    const { t } = useTranslation();
    const hostRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<CityRenderer | null>(null);
    const [webgl] = useState(() => isWebGLAvailable());
    const [loading, setLoading] = useState(webgl);

    // Refs so the async-loaded renderer starts from the latest state.
    const blockSceneRef = useRef(blockScene);
    blockSceneRef.current = blockScene;
    const viewModeRef = useRef(viewMode);
    viewModeRef.current = viewMode;

    useEffect(() => {
      if (!webgl || !hostRef.current) return;
      let cancelled = false;
      const host = hostRef.current;
      void import('../render/CityRenderer').then(({ CityRenderer }) => {
        if (cancelled) return;
        const renderer = new CityRenderer(host, blockSceneRef.current);
        renderer.setViewMode(viewModeRef.current);
        rendererRef.current = renderer;
        setLoading(false);
      });
      return () => {
        cancelled = true;
        rendererRef.current?.dispose();
        rendererRef.current = null;
      };
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
          <p className="qr-caption">{t('render.fallback')}</p>
        </div>
      );
    }

    return (
      <div className="city-host" role="img" aria-label={t('render.aria')} aria-busy={loading}>
        <div ref={hostRef} className="city-host-gl" />
        {loading && (
          <div className="city-loading">
            <span className="spinner" aria-hidden="true" />
            {t('render.loading')}
          </div>
        )}
      </div>
    );
  },
);
