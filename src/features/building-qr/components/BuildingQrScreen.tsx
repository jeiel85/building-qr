import { useMemo, useRef, useState } from 'react';
import { useBuildingQrStore } from '../store/buildingQrStore';
import { useQrMatrix } from '../hooks/useQrMatrix';
import { RenderViewport, type RenderViewportHandle } from './RenderViewport';
import { ViewSwitch } from './ViewSwitch';
import { ScanReliabilityPanel } from './ScanReliabilityPanel';
import { ExportPanel } from './ExportPanel';
import { PresetSelector } from './PresetSelector';
import { generateBlocks } from '../art';
import { isWebGLAvailable } from '@/platform';
import { useTranslation, type MessageKey } from '@/i18n';
import { INPUT_RECOMMENDED_MAX } from '@/shared/constants/app';

export function BuildingQrScreen() {
  const { t } = useTranslation();
  const input = useBuildingQrStore((s) => s.input);
  const setInput = useBuildingQrStore((s) => s.setInput);
  const applySample = useBuildingQrStore((s) => s.applySample);
  const clear = useBuildingQrStore((s) => s.clear);
  const viewMode = useBuildingQrStore((s) => s.viewMode);
  const toggleViewMode = useBuildingQrStore((s) => s.toggleViewMode);
  const presetId = useBuildingQrStore((s) => s.presetId);
  const setPresetId = useBuildingQrStore((s) => s.setPresetId);

  const { matrix, reliability, validation, errorKey } = useQrMatrix(input);
  const blockScene = useMemo(
    () => (matrix ? generateBlocks(matrix, { presetId }) : null),
    [matrix, presetId],
  );

  const isEmpty = validation.length === 0;
  const hintLevel = isEmpty ? 'muted' : validation.level;
  const hintText = isEmpty
    ? t('home.emptyHint', { max: INPUT_RECOMMENDED_MAX })
    : t('home.hint', {
        count: validation.length,
        reason: t(`validation.${validation.code}` as MessageKey, {
          max: INPUT_RECOMMENDED_MAX,
          count: validation.length,
        }),
      });

  const viewportRef = useRef<RenderViewportHandle>(null);
  const [canCaptureArt] = useState(() => isWebGLAvailable());
  const captureArt = (pixels: number): Promise<Blob> =>
    viewportRef.current
      ? viewportRef.current.captureArt(pixels)
      : Promise.reject(new Error('3D viewport unavailable'));

  return (
    <section className="bqr" aria-labelledby="bqr-title">
      <div className="panel">
        <h1 id="bqr-title">{t('home.title')}</h1>
        <p className="sub">{t('home.sub')}</p>

        <div className="field">
          <label htmlFor="bqr-input">{t('home.inputLabel')}</label>
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
            {hintText}
          </span>
        </div>

        <div className="btn-row">
          <button type="button" className="btn" onClick={applySample}>
            {t('home.sampleBtn')}
          </button>
          <button type="button" className="btn" onClick={clear} disabled={input.length === 0}>
            {t('home.clearBtn')}
          </button>
        </div>

        {matrix && <PresetSelector presetId={presetId} onSelect={setPresetId} />}

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
              {viewMode === 'art3d' ? t('home.captionArt') : t('home.captionScan')}
            </p>
          </div>
        ) : (
          <div className="placeholder">
            <span className="badge">{t('home.previewBadge')}</span>
            <p>
              {errorKey
                ? t(errorKey, { count: validation.length, max: INPUT_RECOMMENDED_MAX })
                : t('home.placeholderPreview')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
