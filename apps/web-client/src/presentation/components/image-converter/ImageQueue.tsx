'use client';

import styles from '../../../app/page.module.css';
import { Button } from '@/components/ui/button';
import type { UploadItem, ImageFormat } from '@filekit/shared';
import { ImageFileCard } from './ImageFileCard';

interface ImageQueueProps {
  items: UploadItem[];
  format: ImageFormat;
  isConverting: boolean;
  progress: { done: number; total: number };
  doneCount: number;
  errorCount: number;
  statusMessage: string;
  onDownloadAll: () => void;
  onClearAll: () => void;
  onDownloadItem: (item: UploadItem) => void;
  onRemoveItem: (id: string) => void;
  disabled?: boolean;
  labels: {
    kicker: string;
    title: string;
    downloadAll: string;
    clearQueue: string;
    progressReady: string;
    progressFailed: string;
    emptyTitle: string;
    emptyText: string;
    reading: string;
    remove: string;
    outputSize: string;
    saved: string;
    download: string;
    openResult: string;
    fixFile: string;
    readyToConvert: string;
  };
  statusLabels: {
    idle: string;
    converting: string;
    done: string;
    error: string;
  };
}

export function ImageQueue({
  items,
  format,
  isConverting,
  progress,
  doneCount,
  errorCount,
  statusMessage,
  onDownloadAll,
  onClearAll,
  onDownloadItem,
  onRemoveItem,
  disabled,
  labels,
  statusLabels,
}: ImageQueueProps) {
  const conversionProgress = isConverting && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <section className={styles.fileSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionKicker}>{labels.kicker}</p>
          <h2 className={styles.sectionTitle}>{labels.title}</h2>
        </div>

        <div className={styles.sectionActions}>
          <Button type="button" variant="outline" onClick={onDownloadAll} disabled={!doneCount}>
            {labels.downloadAll}
          </Button>
          <Button type="button" variant="outline" onClick={onClearAll} disabled={!items.length || isConverting}>
            {labels.clearQueue}
          </Button>
        </div>
      </div>

      <div className={styles.progressCard} aria-live="polite">
        <div className={styles.progressTopRow}>
          <span>{statusMessage}</span>
          <span>
            {isConverting ? `${conversionProgress}%` : `${doneCount} ${labels.progressReady} • ${errorCount} ${labels.progressFailed}`}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${conversionProgress}%` }} />
        </div>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>{labels.emptyTitle}</h3>
          <p>{labels.emptyText}</p>
        </div>
      ) : (
        <div className={styles.fileGrid}>
          {items.map((item) => (
            <ImageFileCard
              key={item.id}
              item={item}
              format={format}
              onDownload={onDownloadItem}
              onRemove={onRemoveItem}
              disabled={disabled}
              labels={{
                reading: labels.reading,
                remove: labels.remove,
                outputSize: labels.outputSize,
                saved: labels.saved,
                download: labels.download,
                openResult: labels.openResult,
                fixFile: labels.fixFile,
                readyToConvert: labels.readyToConvert,
              }}
              statusLabels={statusLabels}
            />
          ))}
        </div>
      )}
    </section>
  );
}
