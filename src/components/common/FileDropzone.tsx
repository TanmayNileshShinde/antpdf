'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, Plus, AlertCircle } from 'lucide-react';
import { formatBytes, getPdfPageCount } from '@/lib/pdf';

export interface UploadedPdfMeta {
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

interface FileDropzoneProps {
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  files: UploadedPdfMeta[];
  onFilesChange: (files: UploadedPdfMeta[]) => void;
  title?: string;
  description?: string;
}

export function FileDropzone({
  multiple = false,
  accept = '.pdf,application/pdf',
  maxFiles = 50,
  files,
  onFilesChange,
  title = 'Drag & drop your PDF here',
  description = 'or click to browse files from your computer',
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const newItems: UploadedPdfMeta[] = [];

    const incoming = Array.from(fileList);
    if (!multiple && incoming.length > 1) {
      setErrorMsg('This tool processes one PDF file at a time.');
      return;
    }

    for (const file of incoming) {
      if (
        accept.includes('.pdf') &&
        !file.name.toLowerCase().endsWith('.pdf') &&
        file.type !== 'application/pdf'
      ) {
        setErrorMsg(`"${file.name}" is not a valid PDF file.`);
        continue;
      }

      let pages: number | undefined = undefined;
      try {
        if (file.name.toLowerCase().endsWith('.pdf')) {
          pages = await getPdfPageCount(file);
        }
      } catch {
        // Fallback if encrypted or loading error
      }

      newItems.push({
        file,
        name: file.name,
        size: file.size,
        pageCount: pages,
      });
    }

    if (multiple) {
      const merged = [...files, ...newItems].slice(0, maxFiles);
      onFilesChange(merged);
    } else {
      if (newItems.length > 0) {
        onFilesChange([newItems[0]]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Box */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              processFiles(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <span>🔒 Files never leave your browser</span>
            <span>•</span>
            <span>Zero file size limits</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Files List Preview */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </span>
            {multiple && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add more files
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {files.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{formatBytes(item.size)}</span>
                      {item.pageCount !== undefined && (
                        <>
                          <span>•</span>
                          <span>
                            {item.pageCount}{' '}
                            {item.pageCount === 1 ? 'page' : 'pages'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
