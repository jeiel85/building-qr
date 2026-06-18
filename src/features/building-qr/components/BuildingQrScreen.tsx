import { useMemo, useRef, useState } from 'react';
import { useBuildingQrStore } from '../store/buildingQrStore';
import { useQrMatrix } from '../hooks/useQrMatrix';
import { RenderViewport, type RenderViewportHandle } from './RenderViewport';
import { ViewSwitch } from './ViewSwitch';
import { ScanReliabilityPanel } from './ScanReliabilityPanel';
import { ExportPanel } from './ExportPanel';
import { generateBlocks } from '../art';
import { isWebGLAvailable } from '@/platform';
import { INPUT_RECOMMENDED_MAX } from '@/shared/constants/app';

export function BuildingQrScreen() {
  const input = useBuildingQrStore((s) => s.input);
  const setInput = useBuildingQrStore((s) => s.setInput);
  const applySample = useBuildingQrStore((s) => s.applySample);
  const clear = useBuildingQrStore((s) => s.clear);
  const viewMode = useBuildingQrStore((s) => s.viewMode);
  const toggleViewMode = useBuildingQrStore((s) => s.toggleViewMode);

  const { matrix, reliability, validation, error } = useQrMatrix(input);
  const blockScene = useMemo(() => (matrix ? generateBlocks(matrix) : null), [matrix]);

  const isEmpty = validation.length === 0;
  const hintLevel = isEmpty ? 'muted' : validation.level;

  const viewportRef = useRef<RenderViewportHandle>(null);
  const [canCaptureArt] = useState(() => isWebGLAvailable());
  const captureArt = (pixels: number): Promise<Blob> =>
    viewportRef.current
      ? viewportRef.current.captureArt(pixels)
      : Promise.reject(new Error('3D 미리보기를 사용할 수 없습니다.'));

  return (
    <section className="bqr" aria-labelledby="bqr-title">
      <div className="panel">
        <h1 id="bqr-title">링크를 빌딩숲으로</h1>
        <p className="sub">URL이나 짧은 텍스트를 넣으면 스캔 가능한 도시 스카이라인 QR이 됩니다.</p>

        <div className="field">
          <label htmlFor="bqr-input">링크 또는 텍스트</label>
          <input
            id="bqr-input"
            type="text"
            inputMode="url"
            autoComplete="off"
            placeholder="https://example.com"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-describedby="bqr-input-hint"
          />
          <span id="bqr-input-hint" className={`hint hint-${hintLevel}`}>
            {isEmpty
              ? `권장 ${INPUT_RECOMMENDED_MAX}자 이하 · 짧은 URL일수록 스캔이 안정적입니다.`
              : `${validation.length}자 · ${validation.reasons[0]}`}
          </span>
        </div>

        <div className="btn-row">
          <button type="button" className="btn" onClick={applySample}>
            샘플 링크
          </button>
          <button type="button" className="btn" onClick={clear} disabled={input.length === 0}>
            지우기
          </button>
        </div>

        {matrix && (
          <ExportPanel
            matrix={matrix}
            blockScene={blockScene}
            captureArt={captureArt}
            canCaptureArt={canCaptureArt}
          />
        )}

        {reliability && <ScanReliabilityPanel reliability={reliability} version={matrix?.version} />}
      </div>

      <div className="viewport">
        {matrix && blockScene ? (
          <div className="city-stage">
            <ViewSwitch mode={viewMode} onToggle={toggleViewMode} />
            <RenderViewport
              ref={viewportRef}
              blockScene={blockScene}
              matrix={matrix}
              viewMode={viewMode}
            />
            <p className="qr-caption">
              {viewMode === 'art3d'
                ? '3D 빌딩숲 — 천천히 회전합니다'
                : '2D 평면 — 위에서 본 도시. 공유는 “PNG 저장 / 공유”'}
            </p>
          </div>
        ) : (
          <div className="placeholder">
            <span className="badge">미리보기</span>
            <p>{error ?? '링크를 입력하면 빌딩숲 QR이 여기에 세워집니다.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
