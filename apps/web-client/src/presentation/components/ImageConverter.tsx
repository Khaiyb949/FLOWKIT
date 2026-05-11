"use client";

import { type ChangeEvent, type DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../app/page.module.css';
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
  const router = useRouter();
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
      <main className={styles.page}>
        <div className={styles.backdrop} />
        <div className={styles.shell}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>{copy.hero.kicker}</p>
              <h1 className={styles.title}>{copy.hero.title}</h1>
              <p className={styles.subtitle}>{copy.hero.subtitle}</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} />

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{copy.hero.kicker}</p>
            <h1 className={styles.title}>{copy.hero.title}</h1>
            <p className={styles.subtitle}>{copy.hero.subtitle}</p>

            <div className={styles.badges} aria-label="Feature highlights">
              {copy.hero.badges.map((badge) => (
                <span key={badge} className={styles.badge}>
                  {badge}
                </span>
              ))}
            </div>

            <div className={styles.buttonRow}>
              <Button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isConverting}
              >
                {copy.hero.primaryAction}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={convertAll}
                disabled={isConverting || !items.length}
              >
                {isConverting ? copy.status.converting : copy.hero.secondaryAction}
              </Button>
            </div>

            <ImageStatGrid
              itemCount={items.length}
              totalBytes={totalBytes}
              doneCount={doneCount}
              queuedLabel={copy.hero.queuedFilesLabel}
              inputSizeLabel={copy.hero.inputSizeLabel}
              readyExportsLabel={copy.hero.readyExportsLabel}
            />
          </div>

          <aside className={styles.panel}>
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
              }}
            />
          </aside>
        </section>

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
    </main>
  );
}
