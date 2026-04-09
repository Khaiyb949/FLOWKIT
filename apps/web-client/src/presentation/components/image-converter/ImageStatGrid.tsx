'use client';

import styles from '../../../app/page.module.css';

interface ImageStatGridProps {
  itemCount: number;
  totalBytes: number;
  doneCount: number;
  queuedLabel: string;
  inputSizeLabel: string;
  readyExportsLabel: string;
}

export function ImageStatGrid({
  itemCount,
  totalBytes,
  doneCount,
  queuedLabel,
  inputSizeLabel,
  readyExportsLabel,
}: ImageStatGridProps) {
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <div className={styles.statGrid} aria-label="Feature highlights">
      <article className={styles.statCard}>
        <strong>{itemCount}</strong>
        <span>{queuedLabel}</span>
      </article>
      <article className={styles.statCard}>
        <strong>{formatBytes(totalBytes)}</strong>
        <span>{inputSizeLabel}</span>
      </article>
      <article className={styles.statCard}>
        <strong>{doneCount}</strong>
        <span>{readyExportsLabel}</span>
      </article>
    </div>
  );
}
