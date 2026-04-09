'use client';

import styles from '../../../app/page.module.css';
import { Button } from '@/components/ui/button';

interface ImageDropzoneProps {
  dragging: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  hint: string;
  footnote: string;
}

export function ImageDropzone({
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  disabled,
  inputRef,
  onFileChange,
  label,
  hint,
  footnote,
}: ImageDropzoneProps) {
  return (
    <div
      className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="file"
        multiple
        accept="image/*,.heic,.heif"
        onChange={onFileChange}
        disabled={disabled}
      />

      <div className={styles.dropzoneInner}>
        <p className={styles.dropzoneLabel}>{label}</p>
        <p className={styles.dropzoneHint}>{hint}</p>
        <p className={styles.dropzoneFootnote}>{footnote}</p>
      </div>

      <Button
        type="button"
        className={`${styles.dropzoneButton} absolute bottom-2 right-2`}
        onClick={onClick}
        disabled={disabled}
      >
        Browse files
      </Button>
    </div>
  );
}
