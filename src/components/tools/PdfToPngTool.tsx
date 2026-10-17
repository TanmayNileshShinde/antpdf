'use client';

import React, { useState } from 'react';
import { FileImage, Download, Loader2, RefreshCw, Archive, Sparkles } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { convertPdfToImages, downloadBlob, formatBytes, RenderedPageImage } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function PdfToPngTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [dpi, setDpi] = useState<150 | 300>(150);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pages, setPages] = useState<RenderedPageImage[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleConvert = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const res = await convertPdfToImages(activeFile.file, {
        format: 'png',
        dpi,
      });
      setPages(res.pages);
      setZipBlob(res.zipBlob);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to convert PDF pages to PNG images.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = () => {
    if (zipBlob && activeFile) {
      const zipName = activeFile.name.replace(/\.pdf$/i, '') + '_png_images.zip';
      downloadBlob(zipBlob, zipName);
    }
  };

  const handleDownloadSingle = (page: RenderedPageImage) => {
    if (activeFile) {
      const baseName = activeFile.name.replace(/\.pdf$/i, '');
      const fileName = `${baseName}_page_${String(page.pageNumber).padStart(3, '0')}.png`;
      downloadBlob(page.blob, fileName);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setZipBlob(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-6">
      {pages.length === 0 ? (
        <>
          <FileDropzone
            multiple={false}
            accept=".pdf,application/pdf"
            files={files}
            onFilesChange={setFiles}
            title="Drop PDF to convert pages to lossless PNG"
            description="Extract transparent, pixel-perfect PNG graphics from PDF pages in browser"
          />

          {activeFile && (
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
                  Rendering Resolution DPI
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: 150 as const,
                      label: '150 DPI (Balanced)',
                      desc: 'Crisp vector clarity, compact PNG file size',
                    },
                    {
                      id: 300 as const,
                      label: '300 DPI (Ultra Sharp)',
                      desc: 'Maximum pixel density for graphic design and print',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDpi(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        dpi === item.id
                          ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          dpi === item.id
                            ? 'opacity-80'
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleConvert}
              disabled={!activeFile || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Rendering Lossless PNGs In Browser...</span>
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4" />
                  <span>Convert PDF to PNG Now</span>
                  <span className="ml-1 text-[10px] font-mono opacity-60 bg-neutral-800 dark:bg-neutral-200 px-1.5 py-0.5 rounded">
                    ⌘↵
                  </span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Action Bar */}
          <div className="p-6 sm:p-7 rounded-2xl border border-emerald-500/30 bg-neutral-950 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  Extracted {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} to Lossless PNG <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                0 bytes cloud transfer &bull; 100% Client Side Canvas
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handleDownloadZip}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                <Archive className="w-4 h-4" /> Download All PNGs as ZIP {zipBlob ? `(${formatBytes(zipBlob.size)})` : ''}
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Convert Another PDF
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pages.map((p) => (
              <div
                key={p.pageNumber}
                className="group relative p-3 rounded-2xl studio-surface border border-surface-border flex flex-col justify-between overflow-hidden shadow-xs hover:border-indigo-500/40 transition-all"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-surface-border flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.dataUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="object-contain w-full h-full"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-semibold">
                    Page {p.pageNumber}
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-neutral-300 text-[10px] font-mono">
                    {p.width} x {p.height}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-muted">
                    {formatBytes(p.blob.size)}
                  </span>
                  <button
                    onClick={() => handleDownloadSingle(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3" /> Save PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
