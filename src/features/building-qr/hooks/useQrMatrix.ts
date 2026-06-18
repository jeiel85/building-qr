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

export interface UseQrMatrixResult {
  matrix: QrMatrix | null;
  reliability: ScanReliability | null;
  validation: InputValidation;
  error: string | null;
}

/** Generate a QR matrix + reliability assessment from raw input (memoized). */
export function useQrMatrix(input: string): UseQrMatrixResult {
  return useMemo(() => {
    const validation = validateQrInput(input);
    if (!validation.ok) {
      return { matrix: null, reliability: null, validation, error: validation.reasons[0] ?? null };
    }
    try {
      const matrix = generateQrMatrix(input);
      const darkModuleCount = countDarkModules(matrix.modules);
      const reliability = assessScanReliability({
        matrixSize: matrix.size,
        inputLength: validation.length,
        darkModuleCount,
      });
      return { matrix, reliability, validation, error: null };
    } catch (cause) {
      const error =
        cause instanceof QrGenerationError ? cause.userMessage : 'QR 생성 중 오류가 발생했습니다.';
      return { matrix: null, reliability: null, validation, error };
    }
  }, [input]);
}
