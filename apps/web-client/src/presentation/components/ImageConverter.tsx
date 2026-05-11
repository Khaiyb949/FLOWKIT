"use client";

import { Zap, Shield, HelpCircle } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { ImageConversionSettings } from '../../application/image-conversion.types';
import { convertImage } from '../../infrastructure/image-processing-api';
import { Button } from '@/components/ui/button';
import { getClientCopy, type Locale } from '@/presentation/i18n/site-copy';
import { ImageDropzone, ImageControls, ImageStatGrid, ImageQueue } from './image-converter';
import { useImageUpload, useImageControls, useConversionProgress } from '@/presentation/hooks';
import type { UploadItem } from '@filekit/shared';
import { readImageDimensions, buildTargetName } from '@filekit/shared';

type ImageConverterProps = {
  locale: Locale;
};

export default function ImageConverter({ locale }: ImageConverterProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const copy = useMemo(() => getClientCopy(locale), [locale]);

  // Initialize state first
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [statusMessage, setStatusMessage] = useState(copy.dropzone.hint);

  // Then use custom hooks with callbacks
  const { items, itemsRef, addFiles, removeItem, updateItem, clearAll, cleanupUrls } = useImageUpload();

  const {
    format,
    quality,
    sizeMode,
    customWidth,
    customHeight,
    keepAspectRatio,
    setFormat,
    setQuality,
    setCustomWidth,
    setCustomHeight,
    setKeepAspectRatio,
    syncSizeMode,
    getTargetPreview,
    getConversionSettings,
  } = useImageControls();

  const { isConverting, progress, startConversion, updateProgress, finishConversion } = useConversionProgress();

  // Setup effects
  useEffect(() => {
    setMounted(true);
    return cleanupUrls;
  }, [cleanupUrls]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Computed values
  const doneCount = useMemo(() => items.filter((item) => item.status === 'done').length, [items]);
  const errorCount = useMemo(() => items.filter((item) => item.status === 'error').length, [items]);
  const totalBytes = useMemo(() => items.reduce((sum: number, item: UploadItem) => sum + item.file.size, 0), [items]);
  const targetPreview = getTargetPreview(copy.sizes.original, copy.sizes.custom);

  // File operations
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const fileList = event.target.files;
    const validFiles = Array.from(fileList);

    // Add files to upload queue and read dimensions
    const newItems = addFiles(validFiles);
    
    // Find the newly added items and read their dimensions
    void (async () => {
      for (const newItem of newItems) {
        try {
          const { width, height } = await readImageDimensions(newItem.previewUrl, copy.messages.previewUnsupported);
          updateItem(newItem.id, { width, height });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'This file could not be decoded.';
          updateItem(newItem.id, { status: 'idle', error: message });
        }
      }
    })();

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) {
      addFiles(Array.from(event.dataTransfer.files));
    }
  };

  const convertAll = async () => {
    if (!itemsRef.current.length) {
      setStatusMessage(copy.messages.addFilesFirst);
      return;
    }

    startConversion(itemsRef.current.length);
    const settings: ImageConversionSettings = getConversionSettings();

    for (let index = 0; index < itemsRef.current.length; index += 1) {
      const item = itemsRef.current[index];

      if (item.status === 'error') {
        updateProgress(index + 1, itemsRef.current.length);
        continue;
      }

      updateItem(item.id, { status: 'converting', error: null });

      try {
        const converted = await convertImage(item.file, settings);
        const resultUrl = converted.url;
        const resultName = buildTargetName(item.name, format);

        updateItem(item.id, {
          status: 'done',
          resultUrl,
          resultSize: converted.size,
          resultName,
          error: null,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : copy.messages.conversionFailed;
        updateItem(item.id, { status: 'error', error: message });
      }

      updateProgress(index + 1, itemsRef.current.length);
    }

    finishConversion();
    setStatusMessage(copy.messages.conversionFinished);
  };

  const downloadItem = (item: UploadItem) => {
    if (!item.resultUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = item.resultUrl;
    link.download = item.resultName ?? buildTargetName(item.name, format);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAll = () => {
    const convertedItems = itemsRef.current.filter((item: UploadItem) => item.resultUrl);

    if (!convertedItems.length) {
      setStatusMessage(copy.messages.downloadBeforeConvert);
      return;
    }

    convertedItems.forEach((item, index) => {
      window.setTimeout(() => {
        if (item.resultUrl) {
          downloadItem(item);
        }
      }, index * 120);
    });
  };

  if (!mounted) {
    return (
      <main className="relative min-h-screen bg-transparent text-foreground px-5 py-20 overflow-hidden font-sans antialiased tracking-tight">
        <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col gap-16">
          <section className="flex flex-col items-center gap-12 pt-6">
            <div className="flex flex-col items-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-center leading-tight tracking-tight mb-4">
                {copy.hero.title}
              </h1>
              <p className="text-center mt-0 mb-8 text-muted-foreground font-medium text-xl leading-relaxed max-w-[800px]">
                {copy.hero.subtitle}
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-transparent text-foreground px-5 py-20 overflow-hidden font-sans antialiased tracking-tight">
      <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col gap-16">
        {/* Prime-inspired Modern Hero */}
        <section className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-5xl font-bold text-center xl:text-left leading-tight">
              {copy.hero.title}
            </h1>
            <p className="text-center mt-0 mb-8 text-surface-500 dark:text-surface-400 font-medium text-xl leading-relaxed lg:px-56">
              {copy.hero.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 w-full items-start">
            {/* Left: Dropzone - The Main Focus */}
            <ImageDropzone
              dragging={dragging}
              onDragOver={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              disabled={isConverting}
              inputRef={inputRef}
              onFileChange={handleFileChange}
              label={copy.dropzone.label}
              hint={copy.dropzone.hint}
              footnote={copy.dropzone.footnote}
            />

            {/* Right: Controls & Main Action */}
            <div className="flex flex-col gap-6 bg-card/60 backdrop-blur-xl p-6 rounded-[32px] border border-border shadow-2xl">
              <ImageControls
                format={format}
                onFormatChange={setFormat}
                quality={quality}
                onQualityChange={setQuality}
                sizeMode={sizeMode}
                onSizeModeChange={syncSizeMode}
                customWidth={customWidth}
                onCustomWidthChange={setCustomWidth}
                customHeight={customHeight}
                onCustomHeightChange={setCustomHeight}
                keepAspectRatio={keepAspectRatio}
                onKeepAspectRatioChange={setKeepAspectRatio}
                targetPreview={targetPreview}
                disabled={isConverting}
                labels={{
                  outputFormat: copy.controls.outputFormat,
                  formatPlaceholder: copy.controls.formatPlaceholder,
                  formatPopular: copy.controls.formatPopular,
                  formatAll: copy.controls.formatAll,
                  sizePreset: copy.controls.sizePreset,
                  sizePlaceholder: copy.controls.sizePlaceholder,
                  width: copy.controls.width,
                  height: copy.controls.height,
                  preserveAspectRatio: copy.controls.preserveAspectRatio,
                  quality: copy.controls.quality,
                  currentTarget: copy.controls.currentTarget,
                  metadataNote: copy.controls.metadataNote,
                  searchPlaceholder: copy.controls.searchPlaceholder || 'Tìm kiếm định dạng...',
                }}
              />
              
              <div className="mt-2">
                <Button
                  className="w-full h-16 rounded-[20px] text-lg font-extrabold bg-[#4F8CFF] hover:bg-[#3B7EF8] text-white shadow-[0_10px_25px_-5px_rgba(79,140,255,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                  onClick={convertAll}
                  disabled={isConverting || !items.length}
                >
                  {isConverting ? (
                    <span className="flex items-center gap-2">
                       <Zap className="animate-pulse" size={20} />
                       {copy.status.converting}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                       <Zap size={20} />
                       {copy.hero.secondaryAction}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {items.length > 0 && (
          <div className="flex flex-col gap-10">
            <ImageStatGrid
              itemCount={items.length}
              totalBytes={totalBytes}
              doneCount={doneCount}
              queuedLabel={copy.hero.queuedFilesLabel}
              inputSizeLabel={copy.hero.inputSizeLabel}
              readyExportsLabel={copy.hero.readyExportsLabel}
            />

            <ImageQueue
              items={items}
              format={format}
              isConverting={isConverting}
              progress={progress}
              doneCount={doneCount}
              errorCount={errorCount}
              statusMessage={statusMessage}
              onDownloadAll={downloadAll}
              onClearAll={() => {
                clearAll();
                setStatusMessage(copy.messages.queueCleared);
              }}
              onDownloadItem={downloadItem}
              onRemoveItem={removeItem}
              disabled={isConverting}
              labels={{
                kicker: copy.queue.kicker,
                title: copy.queue.title,
                downloadAll: copy.queue.downloadAll,
                clearQueue: copy.queue.clearQueue,
                progressReady: copy.queue.progressReady,
                progressFailed: copy.queue.progressFailed,
                emptyTitle: copy.queue.emptyTitle,
                emptyText: copy.queue.emptyText,
                reading: copy.fileCard.reading,
                remove: copy.fileCard.remove,
                outputSize: copy.fileCard.outputSize,
                saved: copy.fileCard.saved,
                download: copy.fileCard.download,
                openResult: copy.fileCard.openResult,
                fixFile: copy.status.fixFile,
                readyToConvert: copy.status.readyToConvert,
              }}
              statusLabels={{
                idle: copy.status.idle,
                converting: copy.status.converting,
                done: copy.status.done,
                error: copy.status.error,
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
