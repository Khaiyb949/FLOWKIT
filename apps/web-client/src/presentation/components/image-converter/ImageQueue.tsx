'use client';

import { Button } from '@/components/ui/button';
import type { UploadItem, ImageFormat } from '@filekit/shared';
import { ImageFileCard } from './ImageFileCard';
import { Image as ImageIcon, Download, Trash2 } from 'lucide-react';

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
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ImageIcon size={28} className="text-primary" />
          {labels.title}
        </h2>

        <div className="flex gap-3">
          <Button 
            type="button" 
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all disabled:opacity-50"
            onClick={onDownloadAll} 
            disabled={!doneCount}
          >
            <Download size={18} />
            {labels.downloadAll}
          </Button>
          <Button 
            type="button" 
            variant="ghost"
            className="flex items-center gap-2 px-5 py-2 bg-muted/30 hover:bg-muted text-foreground border border-border rounded-xl font-bold transition-all disabled:opacity-50"
            onClick={onClearAll} 
            disabled={!items.length || isConverting}
          >
            <Trash2 size={18} />
            {labels.clearQueue}
          </Button>
        </div>
      </div>

      <div className="bg-card/60 border border-border backdrop-blur-xl p-5 rounded-3xl" aria-live="polite">
        <div className="flex justify-between gap-3 mb-3 text-sm text-muted-foreground">
          <span>{statusMessage}</span>
          <span className="font-bold">
            {isConverting ? `${conversionProgress}%` : `${doneCount} ${labels.progressReady} • ${errorCount} ${labels.progressFailed}`}
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${conversionProgress}%` }} 
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-card/40 border border-dashed border-border p-16 rounded-[40px] text-center flex flex-col items-center gap-5">
          <div className="text-muted-foreground/40">
            <ImageIcon size={64} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold m-0">{labels.emptyTitle}</h3>
          <p className="text-muted-foreground max-w-[45ch] m-0 leading-relaxed font-medium">{labels.emptyText}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
