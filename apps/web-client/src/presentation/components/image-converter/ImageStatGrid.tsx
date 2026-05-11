'use client';

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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" aria-label="Feature highlights">
      <article className="bg-card/40 border border-border rounded-3xl p-6 text-center shadow-lg transition-transform hover:translate-y-[-2px]">
        <strong className="block text-3xl font-extrabold text-primary mb-1">{itemCount}</strong>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{queuedLabel}</span>
      </article>
      <article className="bg-card/40 border border-border rounded-3xl p-6 text-center shadow-lg transition-transform hover:translate-y-[-2px]">
        <strong className="block text-3xl font-extrabold text-primary mb-1">{formatBytes(totalBytes)}</strong>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{inputSizeLabel}</span>
      </article>
      <article className="bg-card/40 border border-border rounded-3xl p-6 text-center shadow-lg transition-transform hover:translate-y-[-2px]">
        <strong className="block text-3xl font-extrabold text-primary mb-1">{doneCount}</strong>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{readyExportsLabel}</span>
      </article>
    </div>
  );
}
