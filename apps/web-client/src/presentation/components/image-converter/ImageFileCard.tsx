'use client';

import { Button } from '@/components/ui/button';
import type { UploadItem, ImageFormat } from '@filekit/shared';
import { formatBytes, formatDimensions, buildTargetName, calculateSavings } from '@filekit/shared';
import { Download, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

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
  const { savedPercent } = calculateSavings(item.resultSize, item.file.size);

  return (
    <article className="grid grid-cols-[160px_1fr] gap-5 p-5 bg-card/60 backdrop-blur-md border border-border rounded-[28px] transition-all hover:translate-y-[-4px] hover:shadow-xl hover:bg-card/80 group">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-inner">
        {item.previewUrl ? (
          <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <ImageIcon size={48} />
          </div>
        )}
        <span className={`absolute left-2.5 bottom-2.5 px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md text-white shadow-sm
          ${item.status === 'idle' ? 'bg-primary/80' : ''}
          ${item.status === 'converting' ? 'bg-yellow-500/80' : ''}
          ${item.status === 'done' ? 'bg-green-500/80' : ''}
          ${item.status === 'error' ? 'bg-red-500/80' : ''}
        `}>
          {item.status === 'idle' && statusLabels.idle}
          {item.status === 'converting' && statusLabels.converting}
          {item.status === 'done' && statusLabels.done}
          {item.status === 'error' && statusLabels.error}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate m-0 group-hover:text-primary transition-colors">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground m-0 font-medium">
              {formatDimensions(item.width, item.height, labels.reading)} • {formatBytes(item.file.size)}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 size={18} />
          </Button>
        </div>

        {item.error ? (
          <p className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive m-0 font-medium">
            {item.error}
          </p>
        ) : null}

        {item.status === 'done' && item.resultUrl ? (
          <div className="bg-muted/50 p-3 rounded-2xl flex flex-col gap-3 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">{labels.outputSize}</span>
                <span className="text-lg font-extrabold text-foreground">{formatBytes(item.resultSize)}</span>
              </div>
              {savedPercent && savedPercent > 0 ? (
                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg border border-green-500/20">
                  -{savedPercent}% {labels.saved}
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-[1fr_40px] gap-2">
              <Button 
                type="button" 
                className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95" 
                size="sm" 
                onClick={() => onDownload(item)}
              >
                <Download size={16} />
                {labels.download}
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-10 w-10 bg-muted hover:bg-muted/80 text-muted-foreground rounded-xl flex items-center justify-center transition-all border border-border">
                <a 
                  href={item.resultUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download={item.resultName ?? buildTargetName(item.name, format)}
                >
                  <ExternalLink size={18} />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-2 flex items-center justify-between text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest">
            <span>{item.status === 'error' ? labels.fixFile : labels.readyToConvert}</span>
          </div>
        )}
      </div>
    </article>
  );
}
