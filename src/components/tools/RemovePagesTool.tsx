'use client';

import React, { useState } from 'react';
import {
  Trash2,
  CheckCircle2,
  Download,
  Loader2,
  RefreshCw,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import {
  renderPdfThumbnails,
  removePdfPages,
  downloadBlob,
  formatBytes,
  parsePageRanges,
  PdfThumbnail,
} from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function RemovePagesTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [pages, setPages] = useState<PdfThumbnail[]>([]);
  const [markedPages, setMarkedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState('');
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('sanitized_document.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleFilesChange = async (newFiles: UploadedPdfMeta[]) => {
    setFiles(newFiles);
    setResultBlob(null);
    setError(null);
    setMarkedPages(new Set());
    setRangeInput('');

    if (newFiles.length === 0) {
      setPages([]);
      return;
    }

    const file = newFiles[0].file;
    setIsLoadingPages(true);

    try {
      const thumbs = await renderPdfThumbnails(file, { scale: 0.45 });
      setPages(thumbs);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to render PDF page thumbnails for visual removal.'
      );
    } finally {
      setIsLoadingPages(false);
    }
  };

  const togglePageMark = (pageNum: number) => {
    setMarkedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        next.delete(pageNum);
      } else {
        next.add(pageNum);
      }
      return next;
    });
    setError(null);
  };

  const handleSelectOdd = () => {
    const odds = new Set<number>();
    pages.forEach((p) => {
      if (p.pageNumber % 2 !== 0) odds.add(p.pageNumber);
    });
    setMarkedPages(odds);
    setError(null);
  };

  const handleSelectEven = () => {
    const evens = new Set<number>();
    pages.forEach((p) => {
      if (p.pageNumber % 2 === 0) evens.add(p.pageNumber);
    });
    setMarkedPages(evens);
    setError(null);
  };

  const handleClearSelection = () => {
    setMarkedPages(new Set());
    setError(null);
  };

  const handleApplyRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rangeInput.trim()) return;

    try {
      const selected = parsePageRanges(rangeInput, pages.length);
      setMarkedPages(new Set(selected));
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid page range specification.');
    }
  };

  const handleRemovePages = async () => {
    if (!activeFile) return;
    if (markedPages.size === 0) {
      setError('Please select at least one page to remove.');
      return;
    }

    if (markedPages.size >= pages.length) {
      setError('Cannot remove all pages from PDF. At least one page must remain.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const pagesToRemove = Array.from(markedPages);
      const blob = await removePdfPages(activeFile.file, pagesToRemove);
      setResultBlob(blob);
      const baseName = activeFile.name.replace(/\.pdf$/i, '');
      setResultName(`${baseName}_removed_${pagesToRemove.length}_pages.pdf`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to remove pages from PDF.'
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
    setMarkedPages(new Set());
    setResultBlob(null);
    setError(null);
    setRangeInput('');
  };

  const keepingCount = pages.length - markedPages.size;

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
              title="Drop PDF to remove specific pages visually"
              description="Click individual pages to delete, or select ranges with 100% in-browser privacy"
            />
          )}

          {isLoadingPages && (
            <div className="p-12 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Rendering Visual Page Cards...
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Extracting page previews directly in browser memory
              </p>
            </div>
          )}

          {pages.length > 0 && !isLoadingPages && (
            <div className="space-y-6">
              {/* Removal Studio Control Toolbar */}
              <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                        Click Pages to Mark for Deletion
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                        Removing{' '}
                        <span className="font-bold text-red-500 dark:text-red-400">
                          {markedPages.size}
                        </span>{' '}
                        {markedPages.size === 1 ? 'page' : 'pages'} &bull; Keeping{' '}
                        <span className="font-bold text-emerald-500 dark:text-emerald-400">
                          {keepingCount}
                        </span>{' '}
                        of {pages.length} pages
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectOdd}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium transition-all"
                    >
                      Delete Odd Pages
                    </button>

                    <button
                      type="button"
                      onClick={handleSelectEven}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium transition-all"
                    >
                      Delete Even Pages
                    </button>

                    <button
                      type="button"
                      onClick={handleClearSelection}
                      disabled={markedPages.size === 0}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium transition-all disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Deselect All</span>
                    </button>
                  </div>
                </div>

                {/* Range Input Shortcut */}
                <form
                  onSubmit={handleApplyRange}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <label className="text-xs font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    Mark by Range:
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none focus:border-red-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-mono font-semibold transition-all"
                  >
                    Apply Range
                  </button>
                </form>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Page Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((p) => {
                  const isMarked = markedPages.has(p.pageNumber);
                  return (
                    <div
                      key={p.pageNumber}
                      onClick={() => togglePageMark(p.pageNumber)}
                      className={`group relative p-3 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between overflow-hidden shadow-xs ${
                        isMarked
                          ? 'border-red-500 bg-red-500/5 dark:bg-red-950/20 shadow-red-500/10'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      {/* Header Badge */}
                      <div className="flex items-center justify-between gap-1 pb-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all ${
                            isMarked
                              ? 'bg-red-500 text-white line-through'
                              : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950'
                          }`}
                        >
                          Page {p.pageNumber}
                        </span>

                        <span
                          className={`p-1 rounded-full transition-all ${
                            isMarked
                              ? 'bg-red-500 text-white'
                              : 'text-neutral-400 group-hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Thumbnail Preview with Removal Tint */}
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.dataUrl}
                          alt={`Page ${p.pageNumber}`}
                          className={`object-contain w-full h-full pointer-events-none transition-all ${
                            isMarked ? 'opacity-30 grayscale' : 'opacity-100'
                          }`}
                        />

                        {isMarked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/30 backdrop-blur-[1px] text-white">
                            <span className="p-2 rounded-full bg-red-600 text-white shadow-lg mb-1">
                              <Trash2 className="w-5 h-5" />
                            </span>
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-red-200">
                              Will Be Deleted
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer Info */}
                      <div className="pt-2 text-center">
                        <span
                          className={`text-[10px] font-mono ${
                            isMarked
                              ? 'text-red-500 dark:text-red-400 font-semibold'
                              : 'text-neutral-400 dark:text-neutral-500'
                          }`}
                        >
                          {isMarked ? 'Click to restore' : 'Click to delete'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center pt-4">
                <button
                  type="button"
                  onClick={handleRemovePages}
                  disabled={markedPages.size === 0 || isProcessing || keepingCount <= 0}
                  className="relative group px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm tracking-tight border border-red-500 shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span className="font-mono">Removing Pages In Browser...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>
                        {markedPages.size > 0
                          ? `Remove ${markedPages.size} ${
                              markedPages.size === 1 ? 'Page' : 'Pages'
                            } & Download PDF`
                          : 'Select Pages to Remove'}
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
                Pages Removed Successfully <CheckCircle2 className="w-3.5 h-3.5" />
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
              Sanitized Document: Kept {keepingCount} pages &bull; Deleted {markedPages.size} pages &bull; Size: {formatBytes(resultBlob.size)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Clean PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Remove Pages from Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
