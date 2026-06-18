import type { ReactNode } from 'react';

/**
 * App-wide providers (theme, future context, error boundaries).
 * Kept intentionally thin for Phase 1 — composed here as the app grows.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
