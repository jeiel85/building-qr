import { describe, expect, it } from 'vitest';
import { LOCALES, MESSAGES } from '@/i18n';

describe('i18n', () => {
  it('every locale defines the same keys', () => {
    const koKeys = Object.keys(MESSAGES.ko).sort();
    for (const locale of LOCALES) {
      expect(Object.keys(MESSAGES[locale]).sort(), locale).toEqual(koKeys);
    }
  });

  it('has no empty translations', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(MESSAGES[locale])) {
        expect(value.length, `${locale}.${key}`).toBeGreaterThan(0);
      }
    }
  });
});
