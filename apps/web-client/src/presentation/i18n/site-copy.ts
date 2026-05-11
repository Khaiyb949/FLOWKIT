export type Locale = 'en' | 'vi';

type ClientCopy = {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  languageLabel: string;
  switchTo: string;
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    badges: [string, string, string, string];
    primaryAction: string;
    secondaryAction: string;
    queuedFilesLabel: string;
    inputSizeLabel: string;
    readyExportsLabel: string;
  };
  dropzone: {
    label: string;
    hint: string;
    footnote: string;
  };
  controls: {
    outputFormat: string;
    formatPopular: string;
    formatAll: string;
    sizePreset: string;
    width: string;
    height: string;
    preserveAspectRatio: string;
    quality: string;
    currentTarget: string;
    metadataNote: string;
    formatPlaceholder: string;
    sizePlaceholder: string;
  };
  sizes: {
    original: string;
    square: string;
    portrait: string;
    story: string;
    web: string;
    custom: string;
  };
  status: {
    idle: string;
    converting: string;
    done: string;
    error: string;
    readyToConvert: string;
    fixFile: string;
  };
  queue: {
    kicker: string;
    title: string;
    downloadAll: string;
    clearQueue: string;
    emptyTitle: string;
    emptyText: string;
    progressReady: string;
    progressFailed: string;
  };
  fileCard: {
    reading: string;
    remove: string;
    download: string;
    openResult: string;
    outputSize: string;
    saved: string;
  };
  messages: {
    addFilesFirst: string;
    selectImages: string;
    duplicates: string;
    limitReached: (maxFiles: number) => string;
    addedFiles: (count: number) => string;
    queueCleared: string;
    conversionFinished: string;
    conversionFailed: string;
    downloadBeforeConvert: string;
    decodeFailed: string;
    previewUnsupported: string;
  };
};

const COPY: Record<Locale, ClientCopy> = {
  en: {
    metadata: {
      title: 'FrameShift | Browser Image Converter',
      description:
        'Convert, resize, and compress image batches locally in your browser without uploading files to a server. Supports JPG, PNG, WebP, AVIF, TIFF, GIF, HEIF, JP2, JXL, PDF, and SVG.',
      keywords: ['image converter', 'jpg to png', 'resize image', 'compress image', 'webp converter', 'avif converter', 'tiff converter', 'gif converter', 'heif converter', 'jp2 converter', 'jxl converter', 'pdf converter', 'svg converter'],
    },
    languageLabel: 'Language',
    switchTo: 'Tiếng Việt',
    hero: {
      kicker: 'Browser-first image converter with NestJS backend',
      title: 'FrameShift converts and compresses batches with ease.',
      subtitle:
        'Upload JPG, PNG, WebP, AVIF, TIFF, GIF, HEIF, JP2, JXL, PDF, or SVG files, resize them with presets, and download high-quality results instantly. Optimized for speed and quality.',
      badges: ['Bulk upload', 'Professional quality', 'Resize presets', 'Metadata removed'],
      primaryAction: 'Add images',
      secondaryAction: 'Convert all',
      queuedFilesLabel: 'Queued files',
      inputSizeLabel: 'Input size',
      readyExportsLabel: 'Ready exports',
    },
    dropzone: {
      label: 'Drop files here',
      hint: 'Or click to choose images from your device.',
      footnote: 'HEIC and HEIF work only when the browser can decode them.',
    },
    controls: {
      outputFormat: 'Output format',
      formatPopular: 'Popular',
      formatAll: 'All',
      sizePreset: 'Size preset',
      width: 'Width',
      height: 'Height',
      preserveAspectRatio: 'Preserve aspect ratio',
      quality: 'Quality',
      currentTarget: 'Current target',
      metadataNote: 'Metadata is removed during conversion.',
      formatPlaceholder: 'Choose a format',
      sizePlaceholder: 'Choose a size',
    },
    sizes: {
      original: 'Original size',
      square: 'Square 1080 x 1080',
      portrait: 'Portrait 1080 x 1350',
      story: 'Story 1080 x 1920',
      web: 'Web 1600 x 900',
      custom: 'Custom',
    },
    status: {
      idle: 'Ready',
      converting: 'Converting',
      done: 'Done',
      error: 'Error',
      readyToConvert: 'Ready to convert.',
      fixFile: 'Fix the file or remove it from the queue.',
    },
    queue: {
      kicker: 'Batch queue',
      title: 'Files ready for conversion',
      downloadAll: 'Download all converted',
      clearQueue: 'Clear queue',
      emptyTitle: 'No files yet',
      emptyText: 'Add a batch to start converting in seconds.',
      progressReady: 'ready',
      progressFailed: 'failed',
    },
    fileCard: {
      reading: 'Reading...',
      remove: 'Remove',
      download: 'Download',
      openResult: 'Open result',
      outputSize: 'Output size',
      saved: 'Saved',
    },
    messages: {
      addFilesFirst: 'Add at least one file first.',
      selectImages: 'Select image files, then convert them on the server.',
      duplicates: 'Those files are already in the queue.',
      limitReached: (maxFiles) => `Limit reached. You can queue up to ${maxFiles} files at once.`,
      addedFiles: (count) => `${count} file(s) added. Metadata is stripped by the server.`,
      queueCleared: 'Queue cleared. Add a fresh batch to convert.',
      conversionFinished: 'Conversion finished. Download the files you need below.',
      conversionFailed: 'Conversion failed.',
      downloadBeforeConvert: 'Convert at least one file before downloading.',
      decodeFailed: 'This file could not be decoded in the browser.',
      previewUnsupported: 'Preview is not available in this browser, but the file can still be converted on the server.',
    },
  },
  vi: {
    metadata: {
      title: 'FrameShift | Công cụ chuyển đổi ảnh trên trình duyệt',
      description:
        'Chuyển đổi, thay đổi kích thước và nén hàng loạt ảnh ngay trong trình duyệt mà không cần tải file lên máy chủ. Hỗ trợ JPG, PNG, WebP, AVIF, TIFF, GIF, HEIF, JP2, JXL, PDF và SVG.',
      keywords: ['chuyển đổi ảnh', 'đổi jpg sang png', 'resize ảnh', 'nén ảnh', 'webp converter', 'avif converter', 'tiff converter', 'gif converter', 'heif converter', 'jp2 converter', 'jxl converter', 'pdf converter', 'svg converter'],
    },
    languageLabel: 'Ngôn ngữ',
    switchTo: 'English',
    hero: {
      kicker: 'Công cụ chuyển ảnh ưu tiên trình duyệt, dùng NestJS ở backend',
      title: 'FrameShift. Chuyển đổi và nén hàng loạt ảnh chuyên nghiệp.',
      subtitle:
        'Tải lên file JPG, PNG, WebP, AVIF, TIFF, GIF, HEIF, JP2, JXL, PDF hoặc SVG, đổi kích thước nhanh chóng và tải kết quả chất lượng cao ngay lập tức.',
      badges: ['Tải lên hàng loạt', 'Chất lượng cao', 'Preset kích thước', 'Đã bỏ metadata'],
      primaryAction: 'Thêm ảnh',
      secondaryAction: 'Chuyển đổi tất cả',
      queuedFilesLabel: 'File đang chờ',
      inputSizeLabel: 'Dung lượng đầu vào',
      readyExportsLabel: 'File sẵn sàng tải',
    },
    dropzone: {
      label: 'Thả file vào đây',
      hint: 'Hoặc bấm để chọn ảnh từ thiết bị của bạn.',
      footnote: 'HEIC và HEIF chỉ hoạt động khi trình duyệt giải mã được.',
    },
    controls: {
      outputFormat: 'Định dạng đầu ra',
      formatPopular: 'Phổ biến',
      formatAll: 'Tất cả',
      sizePreset: 'Preset kích thước',
      width: 'Rộng',
      height: 'Cao',
      preserveAspectRatio: 'Giữ tỷ lệ khung hình',
      quality: 'Chất lượng',
      currentTarget: 'Mục tiêu hiện tại',
      metadataNote: 'Metadata sẽ bị loại bỏ trong lúc chuyển đổi.',
      formatPlaceholder: 'Chọn định dạng',
      sizePlaceholder: 'Chọn kích thước',
    },
    sizes: {
      original: 'Kích thước gốc',
      square: 'Vuông 1080 x 1080',
      portrait: 'Dọc 1080 x 1350',
      story: 'Story 1080 x 1920',
      web: 'Web 1600 x 900',
      custom: 'Tuỳ chỉnh',
    },
    status: {
      idle: 'Sẵn sàng',
      converting: 'Đang chuyển đổi',
      done: 'Xong',
      error: 'Lỗi',
      readyToConvert: 'Sẵn sàng chuyển đổi.',
      fixFile: 'Sửa file hoặc xoá file khỏi hàng chờ.',
    },
    queue: {
      kicker: 'Hàng chờ',
      title: 'File đã sẵn sàng để chuyển đổi',
      downloadAll: 'Tải tất cả file đã chuyển',
      clearQueue: 'Xoá hàng chờ',
      emptyTitle: 'Chưa có file nào',
      emptyText: 'Thêm một batch để bắt đầu chuyển đổi nhanh chóng.',
      progressReady: 'sẵn sàng',
      progressFailed: 'lỗi',
    },
    fileCard: {
      reading: 'Đang đọc...',
      remove: 'Xoá',
      download: 'Tải xuống',
      openResult: 'Mở kết quả',
      outputSize: 'Dung lượng đầu ra',
      saved: 'Tiết kiệm',
    },
    messages: {
      addFilesFirst: 'Hãy thêm ít nhất một file trước.',
      selectImages: 'Hãy chọn file ảnh, sau đó chuyển đổi trên server.',
      duplicates: 'Các file này đã có trong hàng chờ.',
      limitReached: (maxFiles) => `Đã chạm giới hạn. Bạn chỉ có thể xếp hàng tối đa ${maxFiles} file mỗi lượt.`,
      addedFiles: (count) => `Đã thêm ${count} file. Metadata sẽ bị loại bỏ bởi server.`,
      queueCleared: 'Đã xoá hàng chờ. Hãy thêm batch mới để chuyển đổi.',
      conversionFinished: 'Đã chuyển đổi xong. Tải các file bạn cần bên dưới.',
      conversionFailed: 'Chuyển đổi thất bại.',
      downloadBeforeConvert: 'Hãy chuyển đổi ít nhất một file trước khi tải về.',
      decodeFailed: 'Không thể giải mã file này trong trình duyệt.',
      previewUnsupported: 'Trình duyệt không xem trước được file này, nhưng server vẫn có thể chuyển đổi nó.',
    },
  },
};

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'vi';
}

export function getClientCopy(locale: Locale) {
  return COPY[locale];
}