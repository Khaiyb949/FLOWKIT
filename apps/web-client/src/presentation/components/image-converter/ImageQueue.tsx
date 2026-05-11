'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { UploadItem, ImageFormat } from '@filekit/shared';
import { formatBytes, calculateSavings } from '@filekit/shared';
import { ImageFileCard } from './ImageFileCard';
import { Image as ImageIcon, Download, Trash2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

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
          <h2 className="text-xl font-bold flex items-center gap-2">
            {labels.title}
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs px-2 py-0.5 rounded-full font-medium">
              {items.length}
            </span>
          </h2>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Đã chọn {selectedIds.length}</span>
              <div className="flex gap-1 h-8 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={onConvertSelected}
                  className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                  title="Chuyển đổi các mục đã chọn"
                >
                  <Zap size={14} />
                </button>
                <button
                  onClick={onDownloadSelected}
                  className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-green-600 hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                  title="Tải về các mục đã chọn"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={onDeleteSelected}
                  className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                  title="Xóa các mục đã chọn"
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
            Thêm ảnh
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
            Tải về tất cả
          </Button>
          <Button 
            type="button" 
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
            onClick={onClearAll} 
            disabled={!items.length || isConverting}
            title="Làm sạch danh sách"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none" aria-live="polite">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3 w-[40px]">
                  <Checkbox 
                    checked={selectedIds.length === items.length && items.length > 0}
                    onCheckedChange={(checked) => toggleAll(!!checked)}
                    aria-label="Chọn tất cả"
                  />
                </th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Hình ảnh</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Định dạng</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 w-[120px]">Kích thước</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Trạng thái</th>
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className={`group hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors ${selectedIds.includes(item.id) ? 'bg-zinc-50/50 dark:bg-zinc-900/50' : ''}`}>
                    <td className="px-5 py-3">
                      <Checkbox 
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => toggleItem(item.id, !!checked)}
                        aria-label={`Chọn ${item.name}`}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                          {item.previewUrl ? (
                            <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-400">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold truncate max-w-[150px] text-zinc-700 dark:text-zinc-300" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded uppercase">
                        {item.file.type.split('/')[1]?.toUpperCase() || 'IMG'}
                      </code>
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium font-mono">
                      {formatBytes(item.file.size)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {item.status === 'done' && <CheckCircle2 size={14} className="text-green-500" />}
                        {item.status === 'error' && <AlertCircle size={14} className="text-red-500" />}
                        {item.status === 'converting' && <div className="w-3 h-3 border-2 border-zinc-200 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />}
                        
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${
                            item.status === 'done' ? 'text-zinc-900 dark:text-zinc-100' : 
                            item.status === 'error' ? 'text-red-600' : 
                            item.status === 'converting' ? 'text-blue-600' : 
                            'text-zinc-400'
                          }`}>
                            {item.status === 'idle' && (item.error ? labels.fixFile : labels.readyToConvert)}
                            {item.status === 'converting' && statusLabels.converting}
                            {item.status === 'done' && statusLabels.done}
                            {item.status === 'error' && statusLabels.error}
                          </span>
                          {item.status === 'done' && item.resultSize && (
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight">
                              Tiết kiệm {calculateSavings(item.resultSize, item.file.size).savedPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.status === 'idle' && (
                          <button
                            onClick={() => onConvertItem(item.id)}
                            disabled={isConverting}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            title="Chuyển đổi"
                          >
                            <Zap size={14} />
                          </button>
                        )}
                        {item.status === 'done' && (
                          <button
                            onClick={() => onDownloadItem(item)}
                            className="p-1.5 text-zinc-400 hover:text-green-600 transition-colors"
                            title="Tải về"
                          >
                            <Download size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          disabled={isConverting}
                          className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-200 dark:text-zinc-800">
                        <ImageIcon size={24} />
                      </div>
                      <p className="text-sm text-zinc-400 font-medium italic">Tiếp tục kéo thả ảnh vào đây để bắt đầu</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
