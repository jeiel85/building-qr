/** QR data model — see docs/design/05_data_model.md and 04_qr_scan_reliability.md. */

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrMatrix {
  /** Row-major module grid. `true` = dark module. Does not include the quiet zone. */
  modules: boolean[][];
  /** Module count per side (e.g. 21 for version 1). */
  size: number;
  /** QR version 1..40. size === version * 4 + 17. */
  version: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  /** The exact string encoded into the symbol. */
  input: string;
  /** Quiet-zone margin in modules, applied per side when rendering. */
  quietZone: number;
}

export type ScanReliabilityLevel = 'good' | 'warning' | 'bad';

export interface ScanReliability {
  level: ScanReliabilityLevel;
  /** Human-readable, user-facing reasons (Korean). */
  reasons: string[];
  matrixSize: number;
  /** Dark modules — i.e. the buildings that will be raised in the 3D scene. */
  darkModuleCount: number;
  /** Rough upper-bound estimate of rendered blocks (ground + stacked buildings). */
  estimatedBlockCount: number;
}

/** Result of validating raw user input before generating a matrix. */
export interface InputValidation {
  /** Whether a matrix can be generated at all. */
  ok: boolean;
  level: ScanReliabilityLevel;
  reasons: string[];
  /** Trimmed length used for the assessment. */
  length: number;
  isTooLong: boolean;
}

/** A square region of the matrix (used for finder patterns). */
export interface MatrixRegion {
  name: string;
  row: number;
  col: number;
  size: number;
}
