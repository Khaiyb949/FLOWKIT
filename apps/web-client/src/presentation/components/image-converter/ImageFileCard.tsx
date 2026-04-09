'use client';

import styles from '../../../app/page.module.css';
import { Button } from '@/components/ui/button';
import type { UploadItem, ImageFormat } from '@filekit/shared';
import { formatBytes, formatDimensions, buildTargetName, calculateSavings } from '@filekit/shared';

interface ImageFileCardProps {
  item: UploadItem;
  format: ImageFormat;
  onDownload: (item: UploadItem) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
  labels: {
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

export function ImageFileCard({
  item,
  format,
  onDownload,
  onRemove,
  disabled,
  labels,
  statusLabels,
}: ImageFileCardProps) {
  const { savedBytes, savedPercent } = calculateSavings(item.resultSize, item.file.size);

  return (
    <article className={styles.fileCard}>
      <div className={styles.thumb}>
        <img src={item.previewUrl} alt={item.name} className={styles.thumbImage} />
        <span className={`${styles.statusPill} ${styles[`status${item.status}`]}`}>
          {item.status === 'idle' && statusLabels.idle}
          {item.status === 'converting' && statusLabels.converting}
          {item.status === 'done' && statusLabels.done}
          {item.status === 'error' && statusLabels.error}
        </span>
      </div>

      <div className={styles.fileBody}>
        <div className={styles.fileMetaRow}>
          <div>
            <h3 className={styles.fileName}>{item.name}</h3>
            <p className={styles.fileInfo}>
              {formatDimensions(item.width, item.height, labels.reading)} • {formatBytes(item.file.size)}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="px-3 text-slate-300 hover:text-white"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            aria-label={`Remove ${item.name}`}
          >
            {labels.remove}
          </Button>
        </div>

        {item.error ? <p className={styles.errorText}>{item.error}</p> : null}

        {item.status === 'done' && item.resultUrl ? (
          <div className={styles.resultBlock}>
            <p>
              {labels.outputSize}: {formatBytes(item.resultSize)}
              {savedBytes !== null ? ` • ${labels.saved} ${formatBytes(savedBytes)} (${savedPercent}%)` : ''}
            </p>
            <div className={styles.fileActions}>
              <Button type="button" variant="secondary" size="sm" onClick={() => onDownload(item)}>
                {labels.download}
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={item.resultUrl} download={item.resultName ?? buildTargetName(item.name, format)}>
                  {labels.openResult}
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.resultBlock}>
            <p>{item.status === 'error' ? labels.fixFile : labels.readyToConvert}</p>
          </div>
        )}
      </div>
    </article>
  );
}
