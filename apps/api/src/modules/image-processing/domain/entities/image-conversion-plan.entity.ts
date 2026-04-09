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

const SIZE_PRESETS: Record<Exclude<ImageSizeMode, 'original' | 'custom'>, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
  web: { width: 1600, height: 900 },
};

function clampQuality(quality: number | undefined) {
  if (typeof quality !== 'number' || !Number.isFinite(quality)) {
    return 82;
  }

  return Math.max(30, Math.min(100, Math.round(quality)));
}

function normalizeFormat(format: string | undefined): ImageFormat {
  const validFormats: ImageFormat[] = [
    'jpeg', 'jpg', 'png', 'webp', 'gif', 'avif', 'tiff', 'heif', 'jp2', 'jxl',
    'bmp', 'dib', 'ico', 'pdf', 'svg', 'eps', 'psd', 'docx', 'emf', 'wbmp',
    'pbm', 'pcx', 'pgm', 'pnm', 'ppm', 'ras', 'tga', 'wmf', 'iff', 'jxr'
  ];

  if (format && validFormats.includes(format as ImageFormat)) {
    return format as ImageFormat;
  }

  return 'webp';
}

function normalizeSizeMode(sizeMode: string | undefined): ImageSizeMode {
  if (
    sizeMode === 'original' ||
    sizeMode === 'square' ||
    sizeMode === 'portrait' ||
    sizeMode === 'story' ||
    sizeMode === 'web' ||
    sizeMode === 'custom'
  ) {
    return sizeMode;
  }

  return 'original';
}

function buildMimeType(format: ImageFormat) {
  switch (format) {
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'avif':
      return 'image/avif';
    case 'tiff':
      return 'image/tiff';
    case 'heif':
      return 'image/heif';
    case 'jp2':
      return 'image/jp2';
    case 'jxl':
      return 'image/jxl';
    case 'bmp':
    case 'dib':
      return 'image/bmp';
    case 'ico':
      return 'image/x-icon';
    case 'pdf':
      return 'application/pdf';
    case 'svg':
      return 'image/svg+xml';
    case 'eps':
      return 'application/postscript';
    case 'psd':
      return 'image/vnd.adobe.photoshop';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'emf':
      return 'image/x-emf';
    case 'wbmp':
      return 'image/vnd.wap.wbmp';
    case 'pbm':
      return 'image/x-portable-bitmap';
    case 'pcx':
      return 'image/x-pcx';
    case 'pgm':
      return 'image/x-portable-graymap';
    case 'pnm':
      return 'image/x-portable-anymap';
    case 'ppm':
      return 'image/x-portable-pixmap';
    case 'ras':
      return 'image/x-cmu-raster';
    case 'tga':
      return 'image/x-tga';
    case 'wmf':
      return 'image/x-wmf';
    case 'iff':
      return 'image/x-iff';
    case 'jxr':
      return 'image/jxr';
    default:
      return 'image/webp';
  }
}

function buildExtension(format: ImageFormat) {
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

function stripExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '');
}

function resolveTargetSize(
  sizeMode: ImageSizeMode,
  originalWidth: number,
  originalHeight: number,
  width: number | undefined,
  height: number | undefined,
  keepAspectRatio: boolean,
) {
  if (sizeMode === 'original') {
    return {
      width: originalWidth,
      height: originalHeight,
      shouldResize: false,
      fit: 'inside' as const,
    };
  }

  if (sizeMode === 'custom') {
    const requestedWidth = Number.isFinite(width) && width && width > 0 ? width : originalWidth;
    const requestedHeight = Number.isFinite(height) && height && height > 0 ? height : originalHeight;

    if (!keepAspectRatio) {
      return {
        width: requestedWidth,
        height: requestedHeight,
        shouldResize: true,
        fit: 'fill' as const,
      };
    }

    const scale = Math.min(requestedWidth / originalWidth, requestedHeight / originalHeight, 1);

    return {
      width: Math.max(1, Math.round(originalWidth * scale)),
      height: Math.max(1, Math.round(originalHeight * scale)),
      shouldResize: true,
      fit: 'inside' as const,
    };
  }

  const preset = SIZE_PRESETS[sizeMode];

  if (!keepAspectRatio) {
    return {
      width: preset.width,
      height: preset.height,
      shouldResize: true,
      fit: 'fill' as const,
    };
  }

  const scale = Math.min(preset.width / originalWidth, preset.height / originalHeight, 1);

  return {
    width: Math.max(1, Math.round(originalWidth * scale)),
    height: Math.max(1, Math.round(originalHeight * scale)),
    shouldResize: true,
    fit: 'inside' as const,
  };
}

export type ImageConversionPlanProps = {
  originalName: string;
  originalWidth: number;
  originalHeight: number;
  format?: string;
  quality?: number;
  sizeMode?: string;
  width?: number;
  height?: number;
  keepAspectRatio?: boolean;
};

export class ImageConversionPlanEntity {
  originalName!: string;
  originalWidth!: number;
  originalHeight!: number;
  format!: ImageFormat;
  quality!: number;
  sizeMode!: ImageSizeMode;
  width!: number;
  height!: number;
  shouldResize!: boolean;
  fit!: 'inside' | 'fill';
  keepAspectRatio!: boolean;

  constructor(data: Partial<ImageConversionPlanEntity>) {
    Object.assign(this, data);
  }

  static create(props: ImageConversionPlanProps) {
    const format = normalizeFormat(props.format);
    const sizeMode = normalizeSizeMode(props.sizeMode);
    const quality = clampQuality(props.quality);
    const keepAspectRatio = props.keepAspectRatio ?? true;
    const target = resolveTargetSize(
      sizeMode,
      props.originalWidth,
      props.originalHeight,
      props.width,
      props.height,
      keepAspectRatio,
    );

    return new ImageConversionPlanEntity({
      originalName: props.originalName,
      originalWidth: props.originalWidth,
      originalHeight: props.originalHeight,
      format,
      quality,
      sizeMode,
      width: target.width,
      height: target.height,
      shouldResize: target.shouldResize,
      fit: target.fit,
      keepAspectRatio,
    });
  }

  get mimeType(): string {
    return buildMimeType(this.format);
  }

  get outputFileName(): string {
    return `${stripExtension(this.originalName)}.${buildExtension(this.format)}`;
  }

  get backgroundColor(): string {
    return '#ffffff';
  }
}