'use client';

import React, { useState } from 'react';
import {
  Grid,
  RotateCw,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Copy,
  Trash2,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import {
  renderPdfThumbnails,
  organizePdf,
  downloadBlob,
  formatBytes,
  PdfThumbnail,
} from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

interface PageCardItem {
  id: string;
  originalIndex: number;
  rotation: number;
  thumbnail: string;
}

export function OrganizeTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [pages, setPages] = useState<PageCardItem[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('organized_document.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleFilesChange = async (newFiles: UploadedPdfMeta[]) => {
    setFiles(newFiles);
    setResultBlob(null);
    setError(null);

    if (newFiles.length === 0) {
      setPages([]);
      return;
    }

    const file = newFiles[0].file;
    setIsLoadingPages(true);

    try {
      const thumbs = await renderPdfThumbnails(file, { scale: 0.45 });
      const initialPages: PageCardItem[] = thumbs.map((thumb: PdfThumbnail, idx: number) => ({
        id: `page-${idx}-${Date.now()}-${Math.random()}`,
        originalIndex: idx,
        rotation: 0,
        thumbnail: thumb.dataUrl,
      }));
      setPages(initialPages);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to render PDF page thumbnails for visual organization.'
      );
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const updated = [...pages];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);
    setPages(updated);
    setDraggedIndex(null);
  };

  // Card Action handlers
  const handleRotatePage = (index: number, deg: number) => {
    setPages((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newRot = ((item.rotation + deg) % 360 + 360) % 360;
        return { ...item, rotation: newRot };
      })
    );
  };

  const handleMovePage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const updated = [...pages];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);
    setPages(updated);
  };

  const handleDuplicatePage = (index: number) => {
    const item = pages[index];
    const duplicate: PageCardItem = {
      ...item,
      id: `copy-${Date.now()}-${Math.random()}`,
    };
    const updated = [...pages];
    updated.splice(index + 1, 0, duplicate);
    setPages(updated);
  };

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) {
      setError('A PDF document must retain at least one page.');
      return;
    }
    setPages((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  // Bulk Actions
  const handleRotateAll = (deg: number) => {
    setPages((prev) =>
      prev.map((item) => ({
        ...item,
        rotation: ((item.rotation + deg) % 360 + 360) % 360,
      }))
    );
  };

  const handleReverseOrder = () => {
    setPages((prev) => [...prev].reverse());
  };

  const handleResetOrder = async () => {
    if (activeFile) {
      await handleFilesChange([activeFile]);
    }
  };

  // Export
  const handleExport = async () => {
    if (!activeFile || pages.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pageSpecs = pages.map((p) => ({
        originalIndex: p.originalIndex,
        rotation: p.rotation,
      }));
      const blob = await organizePdf(activeFile.file, pageSpecs);
      setResultBlob(blob);
      const baseName = activeFile.name.replace(/\.pdf$/i, '');
      setResultName(`${baseName}_reorganized.pdf`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to export organized PDF.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      downloadBlob(resultBlob, resultName);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          {pages.length === 0 && !isLoadingPages && (
            <FileDropzone
              multiple={false}
              accept=".pdf,application/pdf"
              files={files}
              onFilesChange={handleFilesChange}
              title="Drop PDF to reorganize &amp; sort pages visually"
              description="Drag and drop page thumbnails to reorder, rotate, duplicate, or delete pages in browser"
            />
          )}

          {isLoadingPages && (
            <div className="p-12 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Rendering Visual Page Canvas...
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Generating client-side thumbnails with zero cloud uploads
              </p>
            </div>
          )}

          {pages.length > 0 && !isLoadingPages && (
            <div className="space-y-6">
              {/* Studio Control Toolbar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950">
                    <Grid className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Visual Page Organizer Studio
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} &bull; Drag cards or use arrow buttons to reorder
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRotateAll(90)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium transition-all flex items-center gap-1.5"
                    title="Rotate all pages 90° clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Rotate All 90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReverseOrder}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium transition-all flex items-center gap-1.5"
                    title="Reverse current page sequence"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Reverse Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetOrder}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium transition-all flex items-center gap-1.5"
                    title="Reset to original sequence"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Interactive Page Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    className={`group relative p-3 rounded-2xl bg-white dark:bg-neutral-900 border transition-all select-none shadow-xs flex flex-col justify-between cursor-grab active:cursor-grabbing ${
                      draggedIndex === index
                        ? 'opacity-40 border-dashed border-emerald-500 scale-95'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-md'
                    }`}
                  >
                    {/* Page Badges Header */}
                    <div className="flex items-center justify-between gap-1 pb-2">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[11px] font-mono font-bold">
                        #{index + 1}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                        Orig #{item.originalIndex + 1}
                      </span>
                    </div>

                    {/* Preview Thumbnail with dynamic rotation */}
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnail}
                        alt={`Page ${index + 1}`}
                        style={{
                          transform: `rotate(${item.rotation}deg)`,
                          transition: 'transform 0.2s ease-in-out',
                        }}
                        className="object-contain w-full h-full pointer-events-none drop-shadow-xs"
                      />

                      {item.rotation !== 0 && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-neutral-900/80 backdrop-blur-xs text-emerald-400 text-[9px] font-mono font-bold">
                          {item.rotation}°
                        </span>
                      )}
                    </div>

                    {/* Actions Toolbar on Card */}
                    <div className="pt-2.5 grid grid-cols-4 gap-1 border-t border-neutral-100 dark:border-neutral-800/80 mt-2">
                      <button
                        type="button"
                        onClick={() => handleRotatePage(index, -90)}
                        title="Rotate 90° Left"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRotatePage(index, 90)}
                        title="Rotate 90° Right"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicatePage(index)}
                        title="Duplicate Page"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePage(index)}
                        title="Delete Page"
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Micro Navigation Arrows */}
                    <div className="pt-1 flex items-center justify-between text-neutral-400">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMovePage(index, 'left')}
                        title="Move Page Earlier"
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {index + 1} / {pages.length}
                      </span>
                      <button
                        type="button"
                        disabled={index === pages.length - 1}
                        onClick={() => handleMovePage(index, 'right')}
                        title="Move Page Later"
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Primary Action Button */}
              <div className="flex items-center justify-center pt-4">
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="relative group px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      <span className="font-mono">Compiling Reorganized PDF...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                      <span>Export Reorganized PDF ({pages.length} Pages)</span>
                      <span className="ml-1 text-[10px] font-mono opacity-60 bg-neutral-800 dark:bg-neutral-200 px-1.5 py-0.5 rounded">
                        ⌘↵
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Result Success Card */
        <div className="p-6 sm:p-7 rounded-2xl border border-emerald-500/30 bg-neutral-950 text-white relative overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                Reorganization Complete <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              0 bytes cloud transfer &bull; 100% In Browser
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-base sm:text-lg font-bold tracking-tight text-white">
              {resultName}
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Reorganized Sequence: {pages.length} Pages &bull; Size: {formatBytes(resultBlob.size)} &bull; Ready to download
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Reorganized PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Organize Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
