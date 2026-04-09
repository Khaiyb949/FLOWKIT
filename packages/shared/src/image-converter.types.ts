// Shared types for image conversion across all apps
// Supports comprehensive format coverage via Sharp (raster) + ImageMagick (vector/document)
export type ImageFormat =
  | 'jpeg'
  | 'jpg'
  | 'png'
  | 'webp'
  | 'gif'
  | 'avif'
  | 'tiff'
  | 'heif'
  | 'jp2'
  | 'jxl'
  | 'bmp'
  | 'dib'
  | 'ico'
  | 'pdf'
  | 'svg'
  | 'eps'
  | 'psd'
  | 'docx'
  | 'emf'
  | 'wbmp'
  | 'pbm'
  | 'pcx'
  | 'pgm'
  | 'pnm'
  | 'ppm'
  | 'ras'
  | 'tga'
  | 'wmf'
  | 'iff'
  | 'jxr';

export type ImageSizeMode = 'original' | 'square' | 'portrait' | 'story' | 'web' | 'custom';

export type UploadItemStatus = 'idle' | 'converting' | 'done' | 'error';

export interface UploadItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  width: number | null;
  height: number | null;
  status: UploadItemStatus;
  resultUrl: string | null;
  resultSize: number | null;
  resultName: string | null;
  error: string | null;
}

export interface SizePreset {
  width: number;
  height: number;
}

export interface FormatOption {
  value: ImageFormat;
  label: string;
}

export interface ConversionProgress {
  done: number;
  total: number;
}
