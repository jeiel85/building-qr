import { useState } from 'react';
import type { BlockScene } from '../art';
import type { QrMatrix } from '../qr';
import { drawQrToCanvas, moduleSizeForResolution } from '../render2d/renderQrToCanvas';
import { drawColoredQrToCanvas } from '../render2d/renderColoredQr';
import { blobToImage, canvasToPngBlob, drawShareCard } from '../render2d/shareCard';
import { saveImage, shareImageOrDownload } from '@/platform';
import { useTranslation } from '@/i18n';
import { APP_NAME } from '@/shared/constants/app';

type Target = 'qr' | 'art';
type ExportColor = 'bw' | 'color';
type ExportStyle = 'card' | 'plain';
const RESOLUTIONS = [1024, 2048, 4096] as const;

interface ExportPanelProps {
  matrix: QrMatrix;
  blockScene: BlockScene | null;
  captureArt: (pixels: number) => Promise<Blob>;
  canCaptureArt: boolean;
}

export function ExportPanel({ matrix, blockScene, captureArt, canCaptureArt }: ExportPanelProps) {
  const { t } = useTranslation();
  const [style, setStyle] = useState<ExportStyle>('card');
  const [target, setTarget] = useState<Target>('qr');
  const [color, setColor] = useState<ExportColor>('bw');
  const [resolution, setResolution] = useState<number>(1024);
  const [transparent, setTransparent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function buildContent(): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    if (target === 'art') {
      const img = await blobToImage(await captureArt(resolution));
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      return canvas;
    }
    const moduleSize = moduleSizeForResolution(matrix.size, matrix.quietZone, resolution);
    const transp = transparent && style === 'plain';
    if (color === 'color' && blockScene) {
      drawColoredQrToCanvas(canvas, blockScene, { moduleSize, transparent: transp });
    } else {
      drawQrToCanvas(canvas, matrix, { moduleSize, transparent: transp });
    }
    return canvas;
  }

  async function build(): Promise<{ blob: Blob; name: string }> {
    const content = await buildContent();
    if (style === 'card') {
      const card = document.createElement('canvas');
      drawShareCard(card, content, {
        kind: target,
        size: resolution,
        caption: target === 'art' ? t('share.myCity') : t('share.scanToOpen'),
      });
      return { blob: await canvasToPngBlob(card), name: `building-qr-card-${target}.png` };
    }
    return {
      blob: await canvasToPngBlob(content),
      name: `building-qr-${target}-${color}-${resolution}.png`,
    };
  }

  async function run(action: 'save' | 'share') {
    setBusy(true);
    setErr(null);
    setNote(null);
    try {
      const { blob, name } = await build();
      const result =
        action === 'share'
          ? await shareImageOrDownload(blob, name, { title: APP_NAME, text: t('share.text') })
          : await saveImage(blob, name);
      setNote(
        result === 'shared'
          ? t('export.shared')
          : result === 'saved'
            ? t('export.saved')
            : t('export.downloaded'),
      );
    } catch {
      setErr(t('export.failed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="export-panel">
      <div className="export-row">
        <span className="export-opt-label">{t('export.design')}</span>
        <div className="seg" role="group" aria-label={t('export.designAria')}>
          <button
            type="button"
            className={style === 'card' ? 'on' : ''}
            aria-pressed={style === 'card'}
            onClick={() => setStyle('card')}
          >
            {t('export.card')}
          </button>
          <button
            type="button"
            className={style === 'plain' ? 'on' : ''}
            aria-pressed={style === 'plain'}
            onClick={() => setStyle('plain')}
          >
            {t('export.plain')}
          </button>
        </div>
      </div>

      <div className="export-row">
        <span className="export-opt-label">{t('export.target')}</span>
        <div className="seg" role="group" aria-label={t('export.targetAria')}>
          <button
            type="button"
            className={target === 'qr' ? 'on' : ''}
            aria-pressed={target === 'qr'}
            onClick={() => setTarget('qr')}
          >
            {t('export.qr')}
          </button>
          <button
            type="button"
            className={target === 'art' ? 'on' : ''}
            aria-pressed={target === 'art'}
            onClick={() => setTarget('art')}
            disabled={!canCaptureArt}
          >
            {t('export.art')}
          </button>
        </div>
      </div>

      {target === 'qr' && (
        <div className="export-row">
          <span className="export-opt-label">{t('export.color')}</span>
          <div className="seg" role="group" aria-label={t('export.colorAria')}>
            <button
              type="button"
              className={color === 'bw' ? 'on' : ''}
              aria-pressed={color === 'bw'}
              onClick={() => setColor('bw')}
            >
              {t('export.bw')}
            </button>
            <button
              type="button"
              className={color === 'color' ? 'on' : ''}
              aria-pressed={color === 'color'}
              onClick={() => setColor('color')}
            >
              {t('export.colorOn')}
            </button>
          </div>
        </div>
      )}

      <div className="export-row">
        <label className="export-opt-label" htmlFor="export-res">
          {t('export.resolution')}
        </label>
        <select
          id="export-res"
          className="export-select"
          value={resolution}
          onChange={(e) => setResolution(Number(e.target.value))}
        >
          {RESOLUTIONS.map((r) => (
            <option key={r} value={r}>
              {r}px
            </option>
          ))}
        </select>
        {style === 'plain' && (
          <label className="export-check">
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
            />
            {t('export.transparent')}
          </label>
        )}
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={() => run('save')} disabled={busy}>
          {busy ? t('export.processing') : t('export.save')}
        </button>
        <button type="button" className="btn" onClick={() => run('share')} disabled={busy}>
          {t('export.share')}
        </button>
      </div>

      {target === 'qr' && color === 'color' && (
        <p className="export-opt-note">{t('export.colorNote')}</p>
      )}
      {note && (
        <p className="export-note-ok" role="status">
          {note}
        </p>
      )}
      {err && (
        <p className="error-text" role="alert">
          {err}
        </p>
      )}
    </div>
  );
}
