import type { ImageFormat, UploadItem } from './image-converter.types.js';

/**
 * Generate a unique ID using crypto.randomUUID() or fallback to timestamp-based ID
 */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Format bytes to human-readable format (B, KB, MB, GB)
 */
export function formatBytes(bytes: number | null): string {
  if (bytes === null) {
    return '--';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format image dimensions or return a reading label
 */
export function formatDimensions(width: number | null, height: number | null, readingLabel: string): string {
  if (!width || !height) {
    return readingLabel;
  }

  return `${width} x ${height}`;
}

/**
 * Remove file extension from filename
 */
export function stripExtension(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}

/**
 * Get proper extension for image format (handles jpeg → jpg)
 */
export function getExtension(format: ImageFormat): string {
  switch (format) {
    case 'jpeg':
    case 'jpg':
      return 'jpg';
    case 'svg':
      return 'svg';
    case 'pdf':
      return 'pdf';
    case 'eps':
      return 'eps';
    case 'psd':
      return 'psd';
    case 'ico':
      return 'ico';
    case 'dib':
      return 'dib';
    case 'docx':
      return 'docx';
    case 'emf':
      return 'emf';
    case 'wbmp':
      return 'wbmp';
    case 'pbm':
      return 'pbm';
    case 'pcx':
      return 'pcx';
    case 'pgm':
      return 'pgm';
    case 'pnm':
      return 'pnm';
    case 'ppm':
      return 'ppm';
    case 'ras':
      return 'ras';
    case 'tga':
      return 'tga';
    case 'wmf':
      return 'wmf';
    case 'iff':
      return 'iff';
    case 'jxr':
      return 'jxr';
    default:
      return format;
  }
}

/**
 * Build target filename with new format extension
 */
export function buildTargetName(sourceName: string, format: ImageFormat): string {
  return `${stripExtension(sourceName)}.${getExtension(format)}`;
}

/**
 * Read image dimensions from blob URL
 */
export async function readImageDimensions(
  sourceUrl: string,
  decodeErrorMessage: string,
): Promise<{ width: number; height: number }> {
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error(decodeErrorMessage));
    image.src = sourceUrl;
  });
}

/**
 * Create initial upload item from File
 */
export function createUploadItem(file: File): UploadItem {
  return {
    id: createId(),
    file,
    name: file.name,
    previewUrl: URL.createObjectURL(file),
    width: null,
    height: null,
    status: 'idle',
    resultUrl: null,
    resultSize: null,
    resultName: null,
    error: null,
  };
}

/**
 * Revoke all blob URLs from an upload item
 */
export function revokeItemUrls(item: UploadItem): void {
  URL.revokeObjectURL(item.previewUrl);

  if (item.resultUrl && item.resultUrl.startsWith('blob:')) {
    URL.revokeObjectURL(item.resultUrl);
  }
}

/**
 * Calculate saved bytes and percentage
 */
export function calculateSavings(
  resultSize: number | null,
  originalSize: number,
): { savedBytes: number | null; savedPercent: number | null } {
  if (!resultSize) {
    return { savedBytes: null, savedPercent: null };
  }

  const savedBytes = originalSize - resultSize;
  const savedPercent = originalSize > 0 ? Math.max(0, Math.round((savedBytes / originalSize) * 100)) : null;

  return { savedBytes, savedPercent };
}

/**
 * Check if file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  return file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name);
}

/**
 * Generate duplicate key for file deduplication
 */
export function generateFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
