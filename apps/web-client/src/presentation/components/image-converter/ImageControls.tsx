'use client';

import { useState } from 'react';
import styles from '../../../app/page.module.css';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { ImageFormat, ImageSizeMode } from '@filekit/shared';
import { POPULAR_FORMATS, ALL_FORMATS } from '@filekit/shared';

interface ImageControlsProps {
  format: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
  sizeMode: ImageSizeMode;
  onSizeModeChange: (mode: ImageSizeMode) => void;
  customWidth: string;
  onCustomWidthChange: (width: string) => void;
  customHeight: string;
  onCustomHeightChange: (height: string) => void;
  keepAspectRatio: boolean;
  onKeepAspectRatioChange: (keep: boolean) => void;
  targetPreview: string;
  disabled?: boolean;
  labels: {
    outputFormat: string;
    formatPlaceholder: string;
    formatPopular: string;
    formatAll: string;
    sizePreset: string;
    sizePlaceholder: string;
    width: string;
    height: string;
    preserveAspectRatio: string;
    quality: string;
    currentTarget: string;
    metadataNote: string;
  };
}

export function ImageControls({
  format,
  onFormatChange,
  quality,
  onQualityChange,
  sizeMode,
  onSizeModeChange,
  customWidth,
  onCustomWidthChange,
  customHeight,
  onCustomHeightChange,
  keepAspectRatio,
  onKeepAspectRatioChange,
  targetPreview,
  disabled,
  labels,
}: ImageControlsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter formats based on search term (case-insensitive, searches label and value)
  const filteredPopularFormats = POPULAR_FORMATS.filter(
    (f) =>
      f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAllFormats = ALL_FORMATS.filter(
    (f) =>
      f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSearchResults = filteredPopularFormats.length > 0 || filteredAllFormats.length > 0;
  return (
    <div className={styles.controls}>
      <label className={styles.controlGroup}>
        <span className={styles.controlLabel}>{labels.outputFormat}</span>
        <Select value={format} onValueChange={(v) => onFormatChange(v as ImageFormat)} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={labels.formatPlaceholder} />
          </SelectTrigger>
          <SelectContent className="p-2">
            {/* Search input for formats */}
            <div className="mb-2 pb-2 border-b">
              <Input
                placeholder="Search formats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
                autoFocus
              />
            </div>

            {!hasSearchResults ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No formats found</div>
            ) : (
              <>
                {filteredPopularFormats.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>{labels.formatPopular}</SelectLabel>
                    {filteredPopularFormats.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}

                {filteredPopularFormats.length > 0 && filteredAllFormats.length > 0 && <SelectSeparator />}

                {filteredAllFormats.length > 0 && (
                  <SelectGroup>
                    {filteredPopularFormats.length === 0 && <SelectLabel>{labels.formatAll}</SelectLabel>}
                    {filteredAllFormats.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </>
            )}
          </SelectContent>
        </Select>
      </label>

      <label className={styles.controlGroup}>
        <span className={styles.controlLabel}>{labels.sizePreset}</span>
        <Select value={sizeMode} onValueChange={(v) => onSizeModeChange(v as ImageSizeMode)} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={labels.sizePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original">Original</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <div className={styles.inputRow}>
        <label className={styles.controlGroup}>
          <span className={styles.controlLabel}>{labels.width}</span>
          <Input
            inputMode="numeric"
            type="number"
            min="1"
            placeholder="Auto"
            value={customWidth}
            onChange={(e) => onCustomWidthChange(e.target.value)}
            disabled={disabled || sizeMode === 'original'}
            readOnly={sizeMode !== 'custom' && sizeMode !== 'original'}
          />
        </label>

        <label className={styles.controlGroup}>
          <span className={styles.controlLabel}>{labels.height}</span>
          <Input
            inputMode="numeric"
            type="number"
            min="1"
            placeholder="Auto"
            value={customHeight}
            onChange={(e) => onCustomHeightChange(e.target.value)}
            disabled={disabled || sizeMode === 'original'}
            readOnly={sizeMode !== 'custom' && sizeMode !== 'original'}
          />
        </label>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={keepAspectRatio}
          onChange={(e) => onKeepAspectRatioChange(e.target.checked)}
          disabled={disabled}
        />
        <span>{labels.preserveAspectRatio}</span>
      </label>

      <label className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          {labels.quality} {quality}%
        </span>
        <input
          className={styles.range}
          type="range"
          min="30"
          max="100"
          step="1"
          value={quality}
          onChange={(e) => onQualityChange(Number(e.target.value))}
          disabled={disabled || format === 'png'}
        />
      </label>

      <div className={styles.helperNote}>
        <strong>{labels.currentTarget}</strong>
        <span>{targetPreview}</span>
        <span>{labels.metadataNote}</span>
      </div>
    </div>
  );
}
