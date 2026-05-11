'use client';

import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

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
      className={`relative w-full min-h-[480px] rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out
        ${dragging 
          ? 'border-primary bg-primary/10 scale-[1.01]' 
          : 'border-border bg-card/40 hover:border-primary hover:bg-primary/5 hover:shadow-[inset_0_0_60px_rgba(59,130,246,0.05)]'
        }`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      <input
        ref={inputRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        type="file"
        multiple
        accept="image/*,.heic,.heif"
        onChange={onFileChange}
        disabled={disabled}
      />

      <div className="relative z-10 flex flex-col items-center p-10 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-sm">
          <UploadCloud size={40} />
        </div>
        <p className="text-3xl font-bold m-0">{label}</p>
        <p className="mt-3 text-lg text-muted-foreground m-0">{hint}</p>
        <p className="mt-8 text-sm text-muted-foreground/60 bg-muted px-5 py-2 rounded-xl m-0 border border-border/50">{footnote}</p>
      </div>
    </div>
  );
}
