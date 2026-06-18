import type { ViewMode } from '../store/buildingQrStore';

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
  const scan = mode === 'scan2d';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={scan}
      aria-label="3D 빌딩숲과 2D 평면 보기 전환"
      className="view-switch"
      onClick={onToggle}
    >
      <span className="vs-track" data-mode={mode}>
        <span className="vs-thumb" aria-hidden="true" />
        <span className={`vs-opt${scan ? '' : ' on'}`}>3D 빌딩숲</span>
        <span className={`vs-opt${scan ? ' on' : ''}`}>2D 평면</span>
      </span>
    </button>
  );
}
