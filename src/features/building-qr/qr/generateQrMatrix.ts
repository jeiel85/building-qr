import * as QRCode from 'qrcode';
import type { ErrorCorrectionLevel, QrMatrix } from './qrTypes';
import { DEFAULT_QUIET_ZONE } from './qrScanHeuristics';

export const DEFAULT_ERROR_CORRECTION_LEVEL: ErrorCorrectionLevel = 'M';

export type QrErrorCode = 'empty' | 'failed';

/** Thrown when a QR symbol can't be produced; `code` is localized in the UI. */
export class QrGenerationError extends Error {
  readonly code: QrErrorCode;
  constructor(code: QrErrorCode, options?: ErrorOptions) {
    super(`QR generation failed: ${code}`, options);
    this.name = 'QrGenerationError';
    this.code = code;
  }
}

export interface GenerateQrMatrixOptions {
  errorCorrectionLevel?: ErrorCorrectionLevel;
  quietZone?: number;
}

/**
 * Pure: turn a string into a QR module grid. Deterministic for a given
 * (input, errorCorrectionLevel). Throws {@link QrGenerationError} with a
 * user-facing message on empty/oversized/invalid input.
 */
export function generateQrMatrix(input: string, options: GenerateQrMatrixOptions = {}): QrMatrix {
  const errorCorrectionLevel = options.errorCorrectionLevel ?? DEFAULT_ERROR_CORRECTION_LEVEL;
  const quietZone = options.quietZone ?? DEFAULT_QUIET_ZONE;

  if (input.trim().length === 0) {
    throw new QrGenerationError('empty');
  }

  let qr: QRCode.QRCode;
  try {
    qr = QRCode.create(input, { errorCorrectionLevel });
  } catch (cause) {
    throw new QrGenerationError('failed', { cause });
  }

  const size = qr.modules.size;
  const modules: boolean[][] = [];
  for (let row = 0; row < size; row += 1) {
    const cells: boolean[] = [];
    for (let col = 0; col < size; col += 1) {
      cells.push(qr.modules.get(row, col) === 1);
    }
    modules.push(cells);
  }

  return { modules, size, version: qr.version, errorCorrectionLevel, input, quietZone };
}
