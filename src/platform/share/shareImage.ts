import { Capacitor } from '@capacitor/core';

/**
 * Share/download adapter. On the web it uses the Web Share API (level 2, files)
 * with a download fallback. On Capacitor (Android) it writes the image to the
 * filesystem and uses the native share sheet / Documents.
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

export type SaveResult = 'saved' | 'downloaded';
export type ShareResult = 'shared' | 'downloaded' | 'saved';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.readAsDataURL(blob);
  });
}

/** Save the image — native: Documents folder; web: browser download. */
export async function saveImage(blob: Blob, filename: string): Promise<SaveResult> {
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    await Filesystem.writeFile({
      path: filename,
      data: await blobToBase64(blob),
      directory: Directory.Documents,
      recursive: true,
    });
    return 'saved';
  }
  downloadBlob(blob, filename);
  return 'downloaded';
}

/** Share the image — native: share sheet; web: Web Share API, else download. */
export async function shareImageOrDownload(
  blob: Blob,
  filename: string,
  meta?: { title?: string; text?: string },
): Promise<ShareResult> {
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const written = await Filesystem.writeFile({
      path: filename,
      data: await blobToBase64(blob),
      directory: Directory.Cache,
      recursive: true,
    });
    try {
      await Share.share({ title: meta?.title, text: meta?.text, files: [written.uri] });
      return 'shared';
    } catch {
      return 'saved'; // user cancelled; the file is in cache
    }
  }

  const file = new File([blob], filename, { type: blob.type || 'image/png' });
  if (canShareFiles([file]) && typeof navigator.share === 'function') {
    try {
      await navigator.share({ files: [file], title: meta?.title, text: meta?.text });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'shared';
    }
  }
  downloadBlob(blob, filename);
  return 'downloaded';
}
