'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UploadItem, ImageFormat } from '@filekit/shared';
import { formatBytes, calculateSavings } from '@filekit/shared';
import { ImageFileCard } from './ImageFileCard';
import { Image as ImageIcon, Download, Trash2, CheckCircle2, AlertCircle, Zap, ArrowRight } from 'lucide-react';

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
  onConvertItem: (id: string) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDeleteSelected: () => void;
  onConvertSelected: () => void;
  onDownloadSelected: () => void;
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
  onConvertItem,
  selectedIds,
  onSelectionChange,
  onDeleteSelected,
  onConvertSelected,
  onDownloadSelected,
  disabled,
  labels,
  statusLabels,
}: ImageQueueProps) {
  const conversionProgress = isConverting && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(items.map(i => i.id));
    } else {
      onSelectionChange([]);
    }
  };

  const toggleItem = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(i => i !== id));
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-color text-3xl font-semibold leading-normal flex items-center gap-2">
            {labels.title}
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs px-2 py-0.5 rounded-full font-medium">
              {items.length}
            </span>
          </h2>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Selected {selectedIds.length}</span>
              <div className="flex gap-1 h-8 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={onConvertSelected}
                  className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                  title="Convert selected items"
                >
                  <Zap size={14} />
                </button>
                <button
                  onClick={onDownloadSelected}
                  className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-green-600 hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                  title="Download selected items"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={onDeleteSelected}
                  className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                  title="Remove selected items"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="h-9 px-4 rounded-lg font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
            onClick={() => {
              const input = document.querySelector('input[type="file"]') as HTMLInputElement;
              input?.click();
            }}
            disabled={isConverting}
          >
            <ImageIcon size={14} className="mr-1.5" />
            Add images
          </Button>
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="h-9 px-4 rounded-lg font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
            onClick={onDownloadAll} 
            disabled={!doneCount}
          >
            <Download size={14} className="mr-1.5" />
            Download all
          </Button>
          <Button 
            type="button" 
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
            onClick={onClearAll} 
            disabled={!items.length || isConverting}
            title="Clear list"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none" aria-live="polite">
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
              <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                <TableHead className="px-6 h-14 w-[60px] text-center">
                  <Checkbox 
                    checked={selectedIds.length === items.length && items.length > 0}
                    onCheckedChange={(checked) => toggleAll(!!checked)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="px-4 h-14 text-sm font-bold text-black dark:text-white">File Details</TableHead>
                <TableHead className="px-4 h-14 text-sm font-bold text-black dark:text-white">Conversion</TableHead>
                <TableHead className="px-4 h-14 text-sm font-bold text-black dark:text-white w-[160px]">File Size</TableHead>
                <TableHead className="px-4 h-14 text-sm font-bold text-black dark:text-white">Status</TableHead>
                <TableHead className="px-4 h-14 w-[110px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className={`group transition-all border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 ${
                      selectedIds.includes(item.id) 
                        ? 'bg-blue-50/30 dark:bg-blue-900/10' 
                        : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <TableCell className="px-6 py-4 text-center">
                      <Checkbox 
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => toggleItem(item.id, !!checked)}
                        aria-label={`Chọn ${item.name}`}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0 shadow-sm transition-transform">
                          {item.previewUrl ? (
                            <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate block w-full max-w-[200px]" title={item.name}>
                            {item.name}
                          </span>
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">
                            {item.file.name.split('.').pop()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-xs font-bold border border-zinc-200/50 dark:border-zinc-700/50">
                          {item.file.type.split('/')[1]?.toUpperCase() || 'IMG'}
                        </div>
                        {item.status === 'done' && (
                          <>
                            <ArrowRight size={14} className="text-zinc-400" />
                            <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md text-xs font-black border border-blue-200 dark:border-blue-800/50 shadow-sm">
                              {format.toUpperCase()}
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-xs font-bold ${item.status === 'done' ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-400'}`}>
                          {formatBytes(item.file.size)}
                        </span>
                        {item.status === 'done' && item.resultSize && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-black text-zinc-950 dark:text-white">
                              {formatBytes(item.resultSize)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          {item.status === 'done' && (
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                              <CheckCircle2 size={14} className="text-green-700 dark:text-green-400" />
                            </div>
                          )}
                          {item.status === 'error' && (
                            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                              <AlertCircle size={14} className="text-red-700 dark:text-red-400" />
                            </div>
                          )}
                          {item.status === 'converting' && (
                            <div className="relative w-6 h-6 flex items-center justify-center">
                              <div className="absolute inset-0 border-2 border-blue-100 dark:border-blue-900/30 rounded-full" />
                              <div className="absolute inset-0 border-2 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                            </div>
                          )}
                          <span className={`text-sm font-black tracking-tight ${
                            item.status === 'done' ? 'text-green-700 dark:text-green-400' : 
                            item.status === 'error' ? 'text-red-700 dark:text-red-400' : 
                            item.status === 'converting' ? 'text-blue-700 dark:text-blue-400' : 
                            'text-zinc-600 dark:text-zinc-300 font-bold'
                          }`}>
                            {item.status === 'idle' && (item.error ? labels.fixFile : labels.readyToConvert)}
                            {item.status === 'converting' && statusLabels.converting}
                            {item.status === 'done' && statusLabels.done}
                            {item.status === 'error' && statusLabels.error}
                          </span>
                        </div>
                        {item.status === 'done' && item.resultSize && (
                          <div className="inline-flex items-center px-2 py-0.5 rounded bg-green-600 text-white text-[10px] font-black uppercase tracking-tight w-fit">
                            Saved {calculateSavings(item.resultSize, item.file.size).savedPercent}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        {item.status === 'idle' && (
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => onConvertItem(item.id)}
                            disabled={isConverting}
                            className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Convert"
                          >
                            <Zap size={14} className="fill-current" />
                          </Button>
                        )}
                        {item.status === 'done' && (
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => onDownloadItem(item)}
                            className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Download"
                          >
                            <Download size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.id)}
                          disabled={isConverting}
                          className="h-8 w-8 rounded-lg text-zinc-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={6} className="px-5 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-200 dark:text-zinc-800 border-2 border-zinc-100 dark:border-zinc-800/50">
                        <ImageIcon size={32} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-zinc-900 dark:text-zinc-100 font-bold">No images in queue</p>
                        <p className="text-xs text-zinc-400 font-medium">Drag and drop images here to get started</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {isConverting && (
          <div className="h-1 bg-zinc-100 dark:bg-zinc-900 overflow-hidden lg:block">
            <div 
              className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300 ease-in-out" 
              style={{ width: `${conversionProgress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
