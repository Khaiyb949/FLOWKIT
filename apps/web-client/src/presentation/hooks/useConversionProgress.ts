import { useState, useCallback } from 'react';
import type { ConversionProgress } from '@filekit/shared';

interface UseConversionProgressOptions {
  onStatusMessage?: (message: string) => void;
}

export function useConversionProgress(options: UseConversionProgressOptions = {}) {
  const { onStatusMessage } = options;
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress>({ done: 0, total: 0 });

  const startConversion = useCallback((total: number) => {
    setIsConverting(true);
    setProgress({ done: 0, total });
  }, []);

  const updateProgress = useCallback((done: number, total: number) => {
    setProgress({ done, total });
  }, []);

  const finishConversion = useCallback((message?: string) => {
    setIsConverting(false);
    message && onStatusMessage?.(message);
  }, [onStatusMessage]);

  const getProgressPercent = useCallback(() => {
    if (!isConverting || progress.total === 0) {
      return 0;
    }
    return Math.round((progress.done / progress.total) * 100);
  }, [isConverting, progress]);

  return {
    isConverting,
    progress,
    startConversion,
    updateProgress,
    finishConversion,
    getProgressPercent,
  };
}
