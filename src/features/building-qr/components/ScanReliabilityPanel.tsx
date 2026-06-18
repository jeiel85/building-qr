import type { ScanReliability } from '../qr';
import { useTranslation, type MessageKey } from '@/i18n';

const LEVEL_KEY: Record<ScanReliability['level'], MessageKey> = {
  good: 'reliability.levelGood',
  warning: 'reliability.levelWarning',
  bad: 'reliability.levelBad',
};

interface ScanReliabilityPanelProps {
  reliability: ScanReliability;
  version?: number;
}

export function ScanReliabilityPanel({ reliability, version }: ScanReliabilityPanelProps) {
  const { t } = useTranslation();
  return (
    <div className={`reliability reliability-${reliability.level}`} role="status" aria-live="polite">
      <div className="reliability-head">
        <span className="reliability-badge">{t(LEVEL_KEY[reliability.level])}</span>
        <span className="reliability-meta">
          {t('reliability.meta', {
            size: reliability.matrixSize,
            version: version ?? 1,
            buildings: reliability.darkModuleCount,
          })}
        </span>
      </div>
      <ul className="reliability-reasons">
        <li>{t(`reliability.${reliability.code}` as MessageKey)}</li>
      </ul>
    </div>
  );
}
