import { useState } from 'react';
import { useBuildingQrStore } from '../store/buildingQrStore';
import { useQrMatrix } from '../hooks/useQrMatrix';
import { QrCanvas } from './QrCanvas';
import { ScanReliabilityPanel } from './ScanReliabilityPanel';
import { qrToPngBlob } from '../render2d/renderQrToCanvas';
import { downloadBlob } from '@/platform';
import { INPUT_RECOMMENDED_MAX } from '@/shared/constants/app';

export function BuildingQrScreen() {
  const input = useBuildingQrStore((s) => s.input);
  const setInput = useBuildingQrStore((s) => s.setInput);
  const applySample = useBuildingQrStore((s) => s.applySample);
  const clear = useBuildingQrStore((s) => s.clear);

  const { matrix, reliability, validation, error } = useQrMatrix(input);
  const isEmpty = validation.length === 0;
  const hintLevel = isEmpty ? 'muted' : validation.level;

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function handleExport() {
    if (!matrix) return;
    setExporting(true);
    setExportError(null);
    try {
      const blob = await qrToPngBlob(matrix, { moduleSize: 16 });
      downloadBlob(blob, 'building-qr.png');
    } catch {
      setExportError('이미지 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setExporting(false);
    }
  }

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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
            disabled={!matrix || exporting}
          >
            {exporting ? '저장 중…' : 'PNG 저장'}
          </button>
          <button type="button" className="btn" onClick={applySample}>
            샘플 링크
          </button>
          <button type="button" className="btn" onClick={clear} disabled={input.length === 0}>
            지우기
          </button>
        </div>
        {exportError && (
          <p className="error-text" role="alert">
            {exportError}
          </p>
        )}

        {reliability && <ScanReliabilityPanel reliability={reliability} version={matrix?.version} />}
      </div>

      <div className="viewport">
        {matrix ? (
          <div className="qr-stage">
            <QrCanvas matrix={matrix} moduleSize={8} />
            <p className="qr-caption">스캔용 2D 보기 · 3D 빌딩숲은 Phase 5에서 연결됩니다</p>
          </div>
        ) : (
          <div className="placeholder">
            <span className="badge">미리보기</span>
            <p>{error ?? '링크를 입력하면 스캔 가능한 QR이 여기에 나타납니다.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
