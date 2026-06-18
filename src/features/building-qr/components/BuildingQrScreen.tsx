import { useBuildingQrStore } from '../store/buildingQrStore';
import { validateQrInput } from '../qr';
import { INPUT_RECOMMENDED_MAX } from '@/shared/constants/app';

export function BuildingQrScreen() {
  const input = useBuildingQrStore((s) => s.input);
  const setInput = useBuildingQrStore((s) => s.setInput);
  const applySample = useBuildingQrStore((s) => s.applySample);
  const clear = useBuildingQrStore((s) => s.clear);

  const validation = validateQrInput(input);
  const isEmpty = validation.length === 0;
  const hintLevel = isEmpty ? 'muted' : validation.level;

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
          <button type="button" className="btn btn-primary" disabled aria-disabled="true">
            도시 생성 (Phase 3~)
          </button>
          <button type="button" className="btn" onClick={applySample}>
            샘플 링크
          </button>
          <button type="button" className="btn" onClick={clear} disabled={input.length === 0}>
            지우기
          </button>
        </div>
      </div>

      <div className="viewport" role="img" aria-label="3D 미리보기 영역 — 곧 빌딩숲이 여기에 세워집니다">
        <div className="placeholder">
          <span className="badge">미리보기</span>
          <p>
            여기에 3D 빌딩숲과 스캔용 2D QR이 렌더링됩니다.
            <br />
            렌더러는 Phase 5에서 연결됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
