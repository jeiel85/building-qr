import { create } from 'zustand';
import { LOCALES, type Locale } from './messages';

const STORAGE_KEY = 'building-qr.locale';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'ko';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LOCALES as readonly string[]).includes(stored)) return stored as Locale;
  } catch {
    /* ignore storage errors */
  }
  const nav = navigator.language?.toLowerCase() ?? '';
  return nav.startsWith('ko') ? 'ko' : 'en';
}

function applyDocumentLang(locale: Locale): void {
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
}

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const initialLocale = detectLocale();
applyDocumentLang(initialLocale);

export const useI18nStore = create<I18nState>((set) => ({
  locale: initialLocale,
  setLocale: (locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore storage errors */
    }
    applyDocumentLang(locale);
    set({ locale });
  },
}));
