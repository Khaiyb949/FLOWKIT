'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { ImageFormat, ImageSizeMode } from '@filekit/shared';
import { POPULAR_FORMATS, ALL_FORMATS } from '@filekit/shared';
import { Settings2, Maximize, Sliders, Info } from 'lucide-react';

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
    searchPlaceholder: string;
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
    <div className="flex flex-col gap-8 w-full">
      {/* Format Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-foreground">
          <Settings2 size={18} />
          <Label className="text-xs font-bold uppercase tracking-wider">
            {labels.outputFormat}
          </Label>
        </div>
        <Select value={format} onValueChange={(v) => onFormatChange(v as ImageFormat)} disabled={disabled}>
          <SelectTrigger className="h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary shadow-sm">
            <SelectValue placeholder={labels.formatPlaceholder} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-foreground shadow-2xl z-[100]">
            <div 
              className="p-2 mb-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 sticky top-0 z-10"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Input
                placeholder={labels.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 text-sm rounded-lg bg-white dark:bg-zinc-950 text-foreground border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-primary"
              />
            </div>
            {!hasSearchResults ? (
              <div className="py-6 text-center text-sm text-muted-foreground italic">
                {searchTerm ? 'Không tìm thấy định dạng nào' : 'Danh sách trống'}
              </div>
            ) : (
              <>
                {filteredPopularFormats.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-muted-foreground px-2 py-1.5 uppercase">
                      {labels.formatPopular}
                    </SelectLabel>
                    {filteredPopularFormats.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="rounded-lg cursor-pointer">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {filteredPopularFormats.length > 0 && filteredAllFormats.length > 0 && <SelectSeparator />}
                {filteredAllFormats.length > 0 && (
                  <SelectGroup>
                    {filteredPopularFormats.length === 0 && (
                      <SelectLabel className="text-[10px] font-bold text-muted-foreground px-2 py-1.5 uppercase">
                        {labels.formatAll}
                      </SelectLabel>
                    )}
                    {filteredAllFormats.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="rounded-lg cursor-pointer">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Resize Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-foreground">
          <Maximize size={18} />
          <Label className="text-xs font-bold uppercase tracking-wider">
            {labels.sizePreset}
          </Label>
        </div>
        <Select value={sizeMode} onValueChange={(v) => onSizeModeChange(v as ImageSizeMode)} disabled={disabled}>
          <SelectTrigger className="h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary shadow-sm">
            <SelectValue placeholder={labels.sizePlaceholder} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-foreground shadow-2xl z-[100]">
            <SelectItem value="original" className="rounded-lg">Original Size</SelectItem>
            <SelectItem value="square" className="rounded-lg">Square (1:1)</SelectItem>
            <SelectItem value="portrait" className="rounded-lg">Portrait (4:5)</SelectItem>
            <SelectItem value="story" className="rounded-lg">Story (9:16)</SelectItem>
            <SelectItem value="web" className="rounded-lg">Web (16:9)</SelectItem>
            <SelectItem value="custom" className="rounded-lg font-bold">Custom Dimensions</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">{labels.width}</Label>
            <Input
              inputMode="numeric"
              type="number"
              min="1"
              placeholder="Auto"
              value={customWidth}
              onChange={(e) => onCustomWidthChange(e.target.value)}
              disabled={disabled || sizeMode === 'original'}
              readOnly={sizeMode !== 'custom' && sizeMode !== 'original'}
              className="h-11 bg-background border-border rounded-xl text-center font-bold text-foreground focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">{labels.height}</Label>
            <Input
              inputMode="numeric"
              type="number"
              min="1"
              placeholder="Auto"
              value={customHeight}
              onChange={(e) => onCustomHeightChange(e.target.value)}
              disabled={disabled || sizeMode === 'original'}
              readOnly={sizeMode !== 'custom' && sizeMode !== 'original'}
              className="h-11 bg-background border-border rounded-xl text-center font-bold text-foreground focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <Checkbox 
            id="aspect-ratio" 
            checked={keepAspectRatio}
            onCheckedChange={(checked) => onKeepAspectRatioChange(!!checked)}
            disabled={disabled}
            className="rounded-md border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="aspect-ratio" className="text-xs font-medium cursor-pointer leading-none">
            {labels.preserveAspectRatio}
          </Label>
        </div>
      </div>

      {/* Quality Control */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Sliders size={18} />
            <Label className="text-xs font-bold uppercase tracking-wider">
              {labels.quality}
            </Label>
          </div>
          <span className="text-sm font-black bg-foreground text-background px-3 py-1 rounded-lg min-w-[50px] text-center shadow-lg">
            {quality}%
          </span>
        </div>
        <div className="px-1 py-1">
          <Slider
            min={30}
            max={100}
            step={1}
            value={[quality]}
            onValueChange={(val) => onQualityChange(val[0])}
            disabled={disabled || format === 'png'}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-2 p-4 bg-muted/30 rounded-2xl border border-border flex flex-col gap-2">
        <div className="flex items-center gap-2 text-foreground">
          <Info size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{labels.currentTarget}</span>
        </div>
        <div className="text-sm font-bold text-foreground leading-snug">
          {targetPreview}
        </div>
        <div className="text-[10px] font-medium text-muted-foreground italic border-t border-border pt-2 mt-1">
          {labels.metadataNote}
        </div>
      </div>
    </div>
  );
}
