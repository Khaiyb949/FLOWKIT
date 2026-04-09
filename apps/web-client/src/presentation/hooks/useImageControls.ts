import { useState, useCallback } from 'react';
import type { ImageFormat, ImageSizeMode } from '@filekit/shared';
import { SIZE_PRESETS } from '@filekit/shared';

interface UseImageControlsOptions {
  defaultFormat?: ImageFormat;
  defaultQuality?: number;
}

export function useImageControls(options: UseImageControlsOptions = {}) {
  const { defaultFormat = 'webp', defaultQuality = 82 } = options;

  const [format, setFormat] = useState<ImageFormat>(defaultFormat);
  const [quality, setQuality] = useState(defaultQuality);
  const [sizeMode, setSizeMode] = useState<ImageSizeMode>('original');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);

  const syncSizeMode = useCallback((nextMode: ImageSizeMode) => {
    setSizeMode(nextMode);

    if (nextMode === 'original') {
      setCustomWidth('');
      setCustomHeight('');
      return;
    }

    if (nextMode === 'custom') {
      return;
    }

    const preset = SIZE_PRESETS[nextMode];
    setCustomWidth(String(preset.width));
    setCustomHeight(String(preset.height));
  }, []);

  const getTargetPreview = useCallback(
    (originalLabel: string, customLabel: string): string => {
      if (sizeMode === 'original') {
        return originalLabel;
      }

      if (sizeMode === 'custom') {
        return `${customWidth || 'auto'} x ${customHeight || 'auto'}`;
      }

      const preset = SIZE_PRESETS[sizeMode];
      return `${preset.width} x ${preset.height}`;
    },
    [sizeMode, customWidth, customHeight],
  );

  const getConversionSettings = useCallback(() => {
    return {
      format,
      quality,
      sizeMode,
      width: customWidth ? Number(customWidth) : undefined,
      height: customHeight ? Number(customHeight) : undefined,
      keepAspectRatio,
    };
  }, [format, quality, sizeMode, customWidth, customHeight, keepAspectRatio]);

  const reset = useCallback(() => {
    setFormat(defaultFormat);
    setQuality(defaultQuality);
    setSizeMode('original');
    setCustomWidth('');
    setCustomHeight('');
    setKeepAspectRatio(true);
  }, [defaultFormat, defaultQuality]);

  return {
    // State
    format,
    quality,
    sizeMode,
    customWidth,
    customHeight,
    keepAspectRatio,

    // Setters
    setFormat,
    setQuality,
    setCustomWidth,
    setCustomHeight,
    setKeepAspectRatio,

    // Methods
    syncSizeMode,
    getTargetPreview,
    getConversionSettings,
    reset,
  };
}
