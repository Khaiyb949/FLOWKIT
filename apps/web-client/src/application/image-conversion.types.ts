export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif' | 'heif' | 'jp2' | 'jxl' | 'pdf' | 'svg';
export type ImageSizeMode = 'original' | 'square' | 'portrait' | 'story' | 'web' | 'custom';

export type ImageConversionSettings = {
  format: ImageFormat;
  quality: number;
  sizeMode: ImageSizeMode;
  width?: number;
  height?: number;
  keepAspectRatio: boolean;
};

export type ConvertedImageItem = {
  sourceName: string;
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
  dataUrl: string;
};

export type BatchConversionResponse = {
  items: ConvertedImageItem[];
};