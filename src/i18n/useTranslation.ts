import { useI18nStore } from './store';
import { MESSAGES, type Locale, type MessageKey } from './messages';

export type TParams = Record<string, string | number>;

function format(template: string, params?: TParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`,
  );
}

export interface Translator {
  t: (key: MessageKey, params?: TParams) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export function useTranslation(): Translator {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  const t = (key: MessageKey, params?: TParams): string =>
    format(MESSAGES[locale][key] ?? MESSAGES.ko[key] ?? key, params);
  return { t, locale, setLocale };
}
