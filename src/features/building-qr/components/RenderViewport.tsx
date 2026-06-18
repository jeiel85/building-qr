import { useEffect, useRef, useState } from 'react';
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

/**
 * 3D city viewport that morphs toward a top-down scan. The scannable 2D QR
 * (a crisp canvas, verified to decode) is layered on top and fades in for
 * scan mode, guaranteeing scannability regardless of the WebGL state. Falls
 * back to the 2D QR entirely when WebGL is unavailable.
 */
export function RenderViewport({ blockScene, matrix, viewMode }: RenderViewportProps) {
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

  if (!webgl) {
    return (
      <div className="qr-stage">
        <QrCanvas matrix={matrix} moduleSize={8} />
        <p className="qr-caption">WebGL을 사용할 수 없어 스캔용 2D 보기로 표시합니다.</p>
      </div>
    );
  }

  return (
    <div className="city-frame">
      <div ref={hostRef} className="city-host" role="img" aria-label="3D 빌딩숲 미리보기" />
      <div
        className={`scan-overlay${viewMode === 'scan2d' ? ' is-active' : ''}`}
        aria-hidden={viewMode !== 'scan2d'}
      >
        <QrCanvas matrix={matrix} moduleSize={8} />
      </div>
    </div>
  );
}
