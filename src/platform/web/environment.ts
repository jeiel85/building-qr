/** Lightweight environment checks used for fallbacks and motion preferences. */

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function prefersReducedMotion(): boolean {
  return isBrowser() && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Whether a WebGL context can be created. Drives the 2D fallback in later phases
 * (see docs/design/03_rendering_design.md).
 */
export function isWebGLAvailable(): boolean {
  if (!isBrowser()) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}
