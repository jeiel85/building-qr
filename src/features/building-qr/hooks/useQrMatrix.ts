import { useMemo } from 'react';
import {
  assessScanReliability,
  countDarkModules,
  generateQrMatrix,
  QrGenerationError,
  validateQrInput,
  type InputValidation,
  type QrMatrix,
  type ScanReliability,
} from '../qr';
import type { MessageKey } from '@/i18n';

export interface UseQrMatrixResult {
  matrix: QrMatrix | null;
  reliability: ScanReliability | null;
  validation: InputValidation;
  /** i18n key for an error to show in the preview, or null. */
  errorKey: MessageKey | null;
}

/** Generate a QR matrix + reliability assessment from raw input (memoized). */
export function useQrMatrix(input: string): UseQrMatrixResult {
  return useMemo(() => {
    const validation = validateQrInput(input);
    if (!validation.ok) {
      const errorKey: MessageKey | null =
        validation.code === 'tooLong' ? 'validation.tooLong' : null;
      return { matrix: null, reliability: null, validation, errorKey };
    }
    try {
      const matrix = generateQrMatrix(input);
      const darkModuleCount = countDarkModules(matrix.modules);
      const reliability = assessScanReliability({
        matrixSize: matrix.size,
        inputLength: validation.length,
        darkModuleCount,
      });
      return { matrix, reliability, validation, errorKey: null };
    } catch (cause) {
      const errorKey: MessageKey =
        cause instanceof QrGenerationError && cause.code === 'failed'
          ? 'error.qrFailed'
          : 'error.generic';
      return { matrix: null, reliability: null, validation, errorKey };
    }
  }, [input]);
}
