import type { ViewMode } from '../store/buildingQrStore';
import { useTranslation } from '@/i18n';

interface ViewSwitchProps {
  mode: ViewMode;
  onToggle: () => void;
}

/**
 * One pill-shaped switch: the whole control is a single button, so clicking
 * anywhere (including the gap between labels) flips 3D <-> 2D. A thumb slides
 * under the active option.
 */
export function ViewSwitch({ mode, onToggle }: ViewSwitchProps) {
  const { t } = useTranslation();
  const scan = mode === 'scan2d';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={scan}
      aria-label={t('view.aria')}
      className="view-switch"
      onClick={onToggle}
    >
      <span className="vs-track" data-mode={mode}>
        <span className="vs-thumb" aria-hidden="true" />
        <span className={`vs-opt${scan ? '' : ' on'}`}>{t('view.art')}</span>
        <span className={`vs-opt${scan ? ' on' : ''}`}>{t('view.scan')}</span>
      </span>
    </button>
  );
}
