import { useTranslation } from './useTranslation';
import { LOCALES } from './messages';

const SHORT_LABEL: Record<string, string> = { ko: '한', en: 'EN' };

export function LanguageSwitch() {
  const { locale, setLocale, t } = useTranslation();
  return (
    <div className="lang-switch" role="group" aria-label={t('lang.aria')}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={l === locale ? 'on' : ''}
          aria-pressed={l === locale}
          lang={l}
          onClick={() => setLocale(l)}
        >
          {SHORT_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
