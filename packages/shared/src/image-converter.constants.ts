import type { FormatOption, ImageSizeMode, SizePreset } from './image-converter.types';

// Formats are now fetched from API (/api/image-processing/formats)
// These are kept as fallback for SSR or when API is unavailable

export const POPULAR_FORMATS: FormatOption[] = [
  { value: 'jpeg', label: 'JPEG - JPG/JPEG Format' },
  { value: 'png', label: 'PNG - Portable Network Graphics' },
  { value: 'webp', label: 'WEBP - WebP Image File Format' },
  { value: 'gif', label: 'GIF - CompuServe GIF' },
];

export const ALL_FORMATS: FormatOption[] = [
  { value: 'jpeg', label: 'JPEG - JPG/JPEG Format' },
  { value: 'jpg', label: 'JPG - JPG/JPEG Format' },
  { value: 'png', label: 'PNG - Portable Network Graphics' },
  { value: 'webp', label: 'WEBP - WebP Image File Format' },
  { value: 'gif', label: 'GIF - CompuServe GIF' },
  { value: 'avif', label: 'AVIF - AV1 Image File Format' },
  { value: 'tiff', label: 'TIFF - Tagged Image File Format' },
  { value: 'heif', label: 'HEIF - High Efficiency Image File' },
  { value: 'jp2', label: 'JPEG 2000 - JPEG 2000 Format' },
  { value: 'jxl', label: 'JXL - JPEG XL Format' },
  { value: 'bmp', label: 'BMP - Windows Bitmap' },
  { value: 'dib', label: 'DIB - Microsoft Bitmap' },
  { value: 'ico', label: 'ICO - Windows Icon' },
  { value: 'pdf', label: 'PDF - Portable Document Format' },
  { value: 'svg', label: 'SVG - Scalable Vector Graphics' },
  { value: 'eps', label: 'EPS - Encapsulated PostScript' },
  { value: 'psd', label: 'PSD - Adobe Photoshop' },
  { value: 'docx', label: 'DOCX - Word Document' },
  { value: 'emf', label: 'EMF - Enhanced Windows Metafile' },
  { value: 'wbmp', label: 'WBMP - Wireless Bitmap' },
  { value: 'pbm', label: 'PBM - Portable Bitmap' },
  { value: 'pcx', label: 'PCX - Personal Computer Exchange' },
  { value: 'pgm', label: 'PGM - Portable GrayMap' },
  { value: 'pnm', label: 'PNM - Portable Image' },
  { value: 'ppm', label: 'PPM - Portable PixelMap' },
  { value: 'ras', label: 'RAS - Sun Raster' },
  { value: 'tga', label: 'TGA - Truevision Targa' },
  { value: 'wmf', label: 'WMF - Windows Metafile' },
  { value: 'iff', label: 'IFF - Maya Image Format' },
  { value: 'jxr', label: 'JXR - JPEG XR' },
];

export const SIZE_PRESETS: Record<Exclude<ImageSizeMode, 'original' | 'custom'>, SizePreset> = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
  web: { width: 1600, height: 900 },
};

export const MAX_FILES = 24;
