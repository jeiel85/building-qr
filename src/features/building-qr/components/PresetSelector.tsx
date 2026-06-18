import { getPalette, PRESET_LIST } from '../art';
import { useTranslation, type MessageKey } from '@/i18n';

interface PresetSelectorProps {
  presetId: string;
  onSelect: (id: string) => void;
}

/** Pick an art preset (palette + skyline style). Same input + preset = same city. */
export function PresetSelector({ presetId, onSelect }: PresetSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="preset-selector">
      <span className="export-opt-label">{t('preset.label')}</span>
      <div className="preset-list" role="radiogroup" aria-label={t('preset.aria')}>
        {PRESET_LIST.map((preset) => {
          const palette = getPalette(preset.paletteId);
          const swatches = [palette.building[0], palette.tower[0], palette.finder];
          const active = preset.id === presetId;
          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`preset-chip${active ? ' on' : ''}`}
              onClick={() => onSelect(preset.id)}
              title={t(`preset.${preset.id}.desc` as MessageKey)}
            >
              <span className="preset-swatches" aria-hidden="true">
                {swatches.map((c, i) => (
                  <span key={i} style={{ background: c }} />
                ))}
              </span>
              {t(`preset.${preset.id}` as MessageKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
