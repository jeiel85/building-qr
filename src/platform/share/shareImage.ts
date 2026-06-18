/**
 * Share/download adapter. Uses the Web Share API (level 2, files) when
 * available, otherwise falls back to a normal download. The Capacitor native
 * path is layered in at Goal 9 without changing callers.
 */

export function canShareFiles(files: File[]): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files })
  );
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export type ShareResult = 'shared' | 'downloaded';

/**
 * Try to share the image; on unsupported platforms (or user cancel) fall back
 * to a download. Returns which path was taken.
 */
export async function shareImageOrDownload(
  blob: Blob,
  filename: string,
  meta?: { title?: string; text?: string },
): Promise<ShareResult> {
  const file = new File([blob], filename, { type: blob.type || 'image/png' });
  if (canShareFiles([file]) && typeof navigator.share === 'function') {
    try {
      await navigator.share({ files: [file], title: meta?.title, text: meta?.text });
      return 'shared';
    } catch (err) {
      // AbortError = user cancelled the share sheet; don't fall back to a download.
      if (err instanceof DOMException && err.name === 'AbortError') return 'shared';
      // otherwise fall through to download
    }
  }
  downloadBlob(blob, filename);
  return 'downloaded';
}
