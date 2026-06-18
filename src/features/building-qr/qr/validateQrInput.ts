import type { InputValidation, ScanReliabilityLevel } from './qrTypes';
import { INPUT_RECOMMENDED_MAX, INPUT_WARN_AT } from '@/shared/constants/app';

/** Hard upper bound — beyond this we refuse to generate (pathological matrices). */
export const MAX_INPUT_LENGTH = 1000;

/**
 * Assess raw input before generating a matrix. Length-based only — the final
 * matrix-size verdict is computed post-generation by assessScanReliability.
 */
export function validateQrInput(input: string): InputValidation {
  const length = input.trim().length;

  if (length === 0) {
    return {
      ok: false,
      level: 'bad',
      reasons: ['링크 또는 텍스트를 입력해 주세요.'],
      length: 0,
      isTooLong: false,
    };
  }

  if (length > MAX_INPUT_LENGTH) {
    return {
      ok: false,
      level: 'bad',
      reasons: [`입력이 너무 깁니다(${length}자). 짧은 URL을 사용해 주세요.`],
      length,
      isTooLong: true,
    };
  }

  const reasons: string[] = [];
  let level: ScanReliabilityLevel = 'good';

  if (length >= INPUT_WARN_AT) {
    level = 'warning';
    reasons.push('입력이 길어 일부 카메라에서 인식이 느릴 수 있습니다. 짧은 링크를 권장합니다.');
  } else if (length > INPUT_RECOMMENDED_MAX) {
    level = 'warning';
    reasons.push(`권장 길이(${INPUT_RECOMMENDED_MAX}자)를 넘었습니다. 짧은 URL일수록 스캔이 안정적입니다.`);
  } else {
    reasons.push('적절한 길이입니다.');
  }

  return { ok: true, level, reasons, length, isTooLong: length >= INPUT_WARN_AT };
}
