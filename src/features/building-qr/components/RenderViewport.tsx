import { useEffect, useRef, useState } from 'react';
import type { BlockScene } from '../art';
import type { QrMatrix } from '../qr';
import { CityRenderer } from '../render/CityRenderer';
import { isWebGLAvailable } from '@/platform';
import { QrCanvas } from './QrCanvas';

interface RenderViewportProps {
  blockScene: BlockScene;
  /** Used for the 2D fallback when WebGL is unavailable. */
  matrix: QrMatrix;
}

/** 3D city viewport with an automatic fall back to the scannable 2D QR. */
export function RenderViewport({ blockScene, matrix }: RenderViewportProps) {
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
    // Renderer is created once; scene updates are handled in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webgl]);

  useEffect(() => {
    rendererRef.current?.setScene(blockScene);
  }, [blockScene]);

  if (!webgl) {
    return (
      <div className="qr-stage">
        <QrCanvas matrix={matrix} moduleSize={8} />
        <p className="qr-caption">WebGL을 사용할 수 없어 스캔용 2D 보기로 표시합니다.</p>
      </div>
    );
  }

  return <div ref={hostRef} className="city-host" role="img" aria-label="3D 빌딩숲 미리보기" />;
}
