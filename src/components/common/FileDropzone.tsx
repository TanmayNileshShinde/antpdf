'use client';

import React, { useRef, useState } from 'react';
import { FileText, X, Plus, AlertCircle, FileUp, ShieldCheck } from 'lucide-react';
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
  title = 'Drop PDF document to begin',
  description = 'or browse files from your computer',
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
        // Fallback for encrypted documents
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
      {/* Studio Workbench Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative studio-surface studio-grid rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10 scale-[1.005]'
            : 'hover:border-slate-400 dark:hover:border-slate-600'
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
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-surface-border text-slate-800 dark:text-slate-200 flex items-center justify-center shadow-xs">
            <FileUp className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </p>
            <p className="text-xs text-muted">
              {description}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-muted">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero Server Transfer
            </span>
            <span>•</span>
            <span>Local RAM Sandbox</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected Document Workbench Cards */}
      {files.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-muted px-1 font-semibold">
            <span>
              {files.length} {files.length === 1 ? 'document loaded in memory' : 'documents loaded in memory'}
            </span>
            {multiple && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-indigo-500 hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Append file
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {files.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between p-3.5 rounded-xl studio-surface"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20 font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted">
                      <span className="font-tabular">{formatBytes(item.size)}</span>
                      {item.pageCount !== undefined && (
                        <>
                          <span>•</span>
                          <span className="font-tabular">
                            {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-emerald-500 font-sans font-medium">Ready</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  aria-label="Remove document"
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
