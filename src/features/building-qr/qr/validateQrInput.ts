import type { InputValidation, ScanReliabilityLevel, ValidationCode } from './qrTypes';
import { INPUT_RECOMMENDED_MAX, INPUT_WARN_AT } from '@/shared/constants/app';

/** Hard upper bound — beyond this we refuse to generate (pathological matrices). */
export const MAX_INPUT_LENGTH = 1000;

/**
 * Assess raw input before generating a matrix. Length-based only — the final
 * matrix-size verdict is computed post-generation by assessScanReliability.
 * Returns a language-neutral `code`; the UI localizes it.
 */
export function validateQrInput(input: string): InputValidation {
  const length = input.trim().length;

  if (length === 0) {
    return { ok: false, level: 'bad', code: 'empty', length: 0, isTooLong: false };
  }

  if (length > MAX_INPUT_LENGTH) {
    return { ok: false, level: 'bad', code: 'tooLong', length, isTooLong: true };
  }

  let level: ScanReliabilityLevel = 'good';
  let code: ValidationCode = 'ok';

  if (length >= INPUT_WARN_AT) {
    level = 'warning';
    code = 'longWarn';
  } else if (length > INPUT_RECOMMENDED_MAX) {
    level = 'warning';
    code = 'overRecommended';
  }

  return { ok: true, level, code, length, isTooLong: length >= INPUT_WARN_AT };
}
