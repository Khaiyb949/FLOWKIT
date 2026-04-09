import { Injectable } from '@nestjs/common';

export interface FormatInfo {
  value: string;
  label: string;
  mimeType: string;
  extension: string;
  category: 'popular' | 'all';
}

@Injectable()
export class ImageFormatsDomainService {
  private readonly formatsList: FormatInfo[] = [
    // Popular formats
    { value: 'jpeg', label: 'JPEG - JPG/JPEG Format', mimeType: 'image/jpeg', extension: 'jpg', category: 'popular' },
    { value: 'png', label: 'PNG - Portable Network Graphics', mimeType: 'image/png', extension: 'png', category: 'popular' },
    { value: 'webp', label: 'WEBP - WebP Image File Format', mimeType: 'image/webp', extension: 'webp', category: 'popular' },
    { value: 'gif', label: 'GIF - CompuServe GIF', mimeType: 'image/gif', extension: 'gif', category: 'popular' },
    { value: 'tiff', label: 'TIFF - Tagged Image File Format', mimeType: 'image/tiff', extension: 'tiff', category: 'popular' },
    { value: 'pdf', label: 'PDF - Portable Document Format', mimeType: 'application/pdf', extension: 'pdf', category: 'popular' },
    { value: 'bmp', label: 'BMP - Windows Bitmap', mimeType: 'image/bmp', extension: 'bmp', category: 'popular' },
    { value: 'ico', label: 'ICO - Windows Icon', mimeType: 'image/x-icon', extension: 'ico', category: 'popular' },
    { value: 'heif', label: 'HEIF - High Efficiency Image File', mimeType: 'image/heif', extension: 'heif', category: 'popular' },
    { value: 'svg', label: 'SVG - Scalable Vector Graphics', mimeType: 'image/svg+xml', extension: 'svg', category: 'popular' },
    { value: 'jp2', label: 'JPEG 2000 - JPEG 2000 Format', mimeType: 'image/jp2', extension: 'jp2', category: 'popular' },
    { value: 'avif', label: 'AVIF - AV1 Image File Format', mimeType: 'image/avif', extension: 'avif', category: 'popular' },
    
    // All formats (including aliases and additional formats)
    { value: 'jpg', label: 'JPG - JPG/JPEG Format', mimeType: 'image/jpeg', extension: 'jpg', category: 'all' },
    { value: 'dib', label: 'DIB - Microsoft Bitmap', mimeType: 'image/bmp', extension: 'dib', category: 'all' },
    { value: 'docx', label: 'DOCX - Word Document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: 'docx', category: 'all' },
    { value: 'emf', label: 'EMF - Enhanced Windows Metafile', mimeType: 'image/x-emf', extension: 'emf', category: 'all' },
    { value: 'eps', label: 'EPS - Encapsulated PostScript', mimeType: 'application/postscript', extension: 'eps', category: 'all' },
    { value: 'iff', label: 'IFF - Maya Image Format', mimeType: 'image/x-iff', extension: 'iff', category: 'all' },
    { value: 'jxl', label: 'JXL - JPEG XL Format', mimeType: 'image/jxl', extension: 'jxl', category: 'all' },
    { value: 'jxr', label: 'JXR - JPEG XR', mimeType: 'image/jxr', extension: 'jxr', category: 'all' },
    { value: 'pbm', label: 'PBM - Portable Bitmap', mimeType: 'image/x-portable-bitmap', extension: 'pbm', category: 'all' },
    { value: 'pcx', label: 'PCX - Personal Computer Exchange', mimeType: 'image/x-pcx', extension: 'pcx', category: 'all' },
    { value: 'pgm', label: 'PGM - Portable GrayMap', mimeType: 'image/x-portable-graymap', extension: 'pgm', category: 'all' },
    { value: 'pnm', label: 'PNM - Portable Image', mimeType: 'image/x-portable-anymap', extension: 'pnm', category: 'all' },
    { value: 'ppm', label: 'PPM - Portable PixelMap', mimeType: 'image/x-portable-pixmap', extension: 'ppm', category: 'all' },
    { value: 'psd', label: 'PSD - Adobe Photoshop', mimeType: 'image/vnd.adobe.photoshop', extension: 'psd', category: 'all' },
    { value: 'ras', label: 'RAS - Sun Raster', mimeType: 'image/x-cmu-raster', extension: 'ras', category: 'all' },
    { value: 'tga', label: 'TGA - Truevision Targa', mimeType: 'image/x-tga', extension: 'tga', category: 'all' },
    { value: 'wbmp', label: 'WBMP - Wireless Bitmap', mimeType: 'image/vnd.wap.wbmp', extension: 'wbmp', category: 'all' },
    { value: 'wmf', label: 'WMF - Windows Metafile', mimeType: 'image/x-wmf', extension: 'wmf', category: 'all' },
  ];

  getPopularFormats(): FormatInfo[] {
    return this.formatsList.filter(f => f.category === 'popular');
  }

  getAllFormats(): FormatInfo[] {
    return this.formatsList;
  }

  getFormatInfo(format: string): FormatInfo | undefined {
    return this.formatsList.find(f => f.value === format);
  }
}
