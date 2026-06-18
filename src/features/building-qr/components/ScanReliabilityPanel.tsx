import type { ScanReliability } from '../qr';

const LEVEL_LABEL: Record<ScanReliability['level'], string> = {
  good: '스캔 양호',
  warning: '주의',
  bad: '스캔 어려움',
};

interface ScanReliabilityPanelProps {
  reliability: ScanReliability;
  version?: number;
}

export function ScanReliabilityPanel({ reliability, version }: ScanReliabilityPanelProps) {
  return (
    <div
      className={`reliability reliability-${reliability.level}`}
      role="status"
      aria-live="polite"
    >
      <div className="reliability-head">
        <span className="reliability-badge">{LEVEL_LABEL[reliability.level]}</span>
        <span className="reliability-meta">
          {reliability.matrixSize}×{reliability.matrixSize} 모듈
          {version ? ` · v${version}` : ''} · 빌딩 {reliability.darkModuleCount}채
        </span>
      </div>
      <ul className="reliability-reasons">
        {reliability.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </div>
  );
}
