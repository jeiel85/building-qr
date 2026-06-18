import { useState } from 'react';
import type { BlockScene } from '../art';
import type { QrMatrix } from '../qr';
import { drawQrToCanvas, moduleSizeForResolution } from '../render2d/renderQrToCanvas';
import { drawColoredQrToCanvas } from '../render2d/renderColoredQr';
import { blobToImage, canvasToPngBlob, drawShareCard } from '../render2d/shareCard';
import { saveImage, shareImageOrDownload } from '@/platform';
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
      drawShareCard(card, content, { kind: target, size: resolution });
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
      if (action === 'share') {
        const result = await shareImageOrDownload(blob, name, {
          title: APP_NAME,
          text: '내 빌딩숲 QR',
        });
        setNote(result === 'shared' ? '공유했습니다.' : '기기에 저장했습니다.');
      } else {
        const result = await saveImage(blob, name);
        setNote(result === 'saved' ? '문서함에 저장했습니다.' : '기기에 저장했습니다.');
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : '저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="export-panel">
      <div className="export-row">
        <span className="export-opt-label">디자인</span>
        <div className="seg" role="group" aria-label="디자인 선택">
          <button
            type="button"
            className={style === 'card' ? 'on' : ''}
            aria-pressed={style === 'card'}
            onClick={() => setStyle('card')}
          >
            공유 카드
          </button>
          <button
            type="button"
            className={style === 'plain' ? 'on' : ''}
            aria-pressed={style === 'plain'}
            onClick={() => setStyle('plain')}
          >
            심플
          </button>
        </div>
      </div>

      <div className="export-row">
        <span className="export-opt-label">내보내기</span>
        <div className="seg" role="group" aria-label="대상 선택">
          <button
            type="button"
            className={target === 'qr' ? 'on' : ''}
            aria-pressed={target === 'qr'}
            onClick={() => setTarget('qr')}
          >
            스캔용 QR
          </button>
          <button
            type="button"
            className={target === 'art' ? 'on' : ''}
            aria-pressed={target === 'art'}
            onClick={() => setTarget('art')}
            disabled={!canCaptureArt}
          >
            3D 아트
          </button>
        </div>
      </div>

      {target === 'qr' && (
        <div className="export-row">
          <span className="export-opt-label">색상</span>
          <div className="seg" role="group" aria-label="QR 색상">
            <button
              type="button"
              className={color === 'bw' ? 'on' : ''}
              aria-pressed={color === 'bw'}
              onClick={() => setColor('bw')}
            >
              흑백
            </button>
            <button
              type="button"
              className={color === 'color' ? 'on' : ''}
              aria-pressed={color === 'color'}
              onClick={() => setColor('color')}
            >
              컬러
            </button>
          </div>
        </div>
      )}

      <div className="export-row">
        <label className="export-opt-label" htmlFor="export-res">
          해상도
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
            투명 배경
          </label>
        )}
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={() => run('save')} disabled={busy}>
          {busy ? '처리 중…' : 'PNG 저장'}
        </button>
        <button type="button" className="btn" onClick={() => run('share')} disabled={busy}>
          공유
        </button>
      </div>

      {target === 'qr' && color === 'color' && (
        <p className="export-opt-note">
          컬러 QR은 감성적이지만 일부 스캐너에서 약할 수 있어요. 스캔이 중요하면 흑백을 권장합니다.
        </p>
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
