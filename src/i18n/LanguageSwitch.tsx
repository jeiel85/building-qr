import { useTranslation } from './useTranslation';
import { LOCALES } from './messages';

const SHORT_LABEL: Record<string, string> = { ko: '한', en: 'EN' };

/**
 * One pill-shaped switch, mirroring the 3D/2D ViewSwitch: the whole control is a
 * single button, so tapping anywhere (including the gap between labels) cycles to
 * the next locale. A thumb slides under the active option.
 */
export function LanguageSwitch() {
  const { locale, setLocale, t } = useTranslation();
  const index = LOCALES.indexOf(locale);
  const cycle = () => setLocale(LOCALES[(index + 1) % LOCALES.length]);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={index === LOCALES.length - 1}
      aria-label={t('lang.aria')}
      className="lang-toggle"
      onClick={cycle}
    >
      <span className="lt-track" data-pos={index}>
        <span className="lt-thumb" aria-hidden="true" />
        {LOCALES.map((l) => (
          <span key={l} className={`lt-opt${l === locale ? ' on' : ''}`} lang={l}>
            {SHORT_LABEL[l] ?? l.toUpperCase()}
          </span>
        ))}
      </span>
    </button>
  );
}
