'use client';

import React, { useState } from 'react';
import { Images, Download, Loader2, RefreshCw, Sparkles, Sliders } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { convertImagesToPdf, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function JpgToPdfTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [margin, setMargin] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('images_combined.pdf');
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setError(null);
    setIsProcessing(true);

    try {
      const blob = await convertImagesToPdf(files.map((f) => f.file), {
        pageSize,
        orientation,
        margin,
      });
      setResultBlob(blob);
      const generatedName = `antpdf_images_${files.length}_pages.pdf`;
      setResultName(generatedName);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to compile images into PDF.'
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
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          <FileDropzone
            multiple={true}
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            files={files}
            onFilesChange={setFiles}
            title="Drop images (JPG, PNG, WebP) to combine into PDF"
            description="Convert photos, document scans, and receipts into a paginated PDF document"
          />

          {files.length > 0 && (
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-surface-border text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span>PDF Document Formatting</span>
              </div>

              {/* Page Standard */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
                  Page Dimensions
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'A4' as const, label: 'ISO A4', desc: 'Standard sheet' },
                    { id: 'Letter' as const, label: 'US Letter', desc: 'North America' },
                    { id: 'Fit' as const, label: 'Fit to Image', desc: 'Custom aspect' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPageSize(item.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        pageSize === item.id
                          ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className={`text-[10px] mt-0.5 ${pageSize === item.id ? 'opacity-80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation & Margins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1.5">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape' | 'auto')}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-all"
                  >
                    <option value="auto">Auto (Match image aspect)</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1.5">
                    Page Margin
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-all"
                  >
                    <option value={0}>Borderless (0 pt)</option>
                    <option value={20}>Standard (20 pt)</option>
                    <option value={40}>Wide (40 pt)</option>
                  </select>
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
              disabled={files.length === 0 || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Compiling PDF In Browser...</span>
                </>
              ) : (
                <>
                  <Images className="w-4 h-4" />
                  <span>
                    Convert {files.length > 0 ? `${files.length} Images to PDF` : 'Images to PDF'}
                  </span>
                  <span className="ml-1 text-[10px] font-mono opacity-60 bg-neutral-800 dark:bg-neutral-200 px-1.5 py-0.5 rounded">
                    ⌘↵
                  </span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="p-6 sm:p-7 rounded-2xl border border-emerald-500/30 bg-neutral-950 text-white relative overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                PDF Compilation Complete <Sparkles className="w-3.5 h-3.5" />
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
              Compiled Document: {files.length} {files.length === 1 ? 'Page' : 'Pages'} &bull; Size: {formatBytes(resultBlob.size)} &bull; 100% Client Side
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Compiled PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Convert More Images
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
