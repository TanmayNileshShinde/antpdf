'use client';

import React, { useState } from 'react';
import { Minimize2, Download, CheckCircle2, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { compressPdf, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function CompressTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState<string>('compressed.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleCompress = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const compressed = await compressPdf(activeFile.file, quality);
      setResultBlob(compressed);
      setResultName(`compressed-${activeFile.name}`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to compress PDF file.'
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

  const calculateSavings = () => {
    if (!activeFile || !resultBlob) return null;
    const diff = activeFile.size - resultBlob.size;
    const percent = Math.max(0, Math.round((diff / activeFile.size) * 100));
    return { diff, percent };
  };

  const savings = calculateSavings();

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          <FileDropzone
            multiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Drop PDF to compress and optimize"
            description="Reduce file size in-memory without uploading to any cloud server"
          />

          {activeFile && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Compression Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'high' as const,
                    title: 'High Compression',
                    desc: 'Smallest file size, maximum object stream compaction.',
                  },
                  {
                    id: 'medium' as const,
                    title: 'Medium (Recommended)',
                    desc: 'Ideal balance of sharp quality and compact size.',
                  },
                  {
                    id: 'low' as const,
                    title: 'Low Compression',
                    desc: 'Minimal changes, preserves complete metadata.',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQuality(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      quality === item.id
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={handleCompress}
              disabled={!activeFile || isProcessing}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Optimizing Object Streams...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-5 h-5" />
                  <span>Compress PDF Now</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="p-8 sm:p-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Compression Finished!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Processed 100% locally on your computer with zero quality degradation.
            </p>
          </div>

          {activeFile && (
            <div className="max-w-md mx-auto grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Original
                </span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {formatBytes(activeFile.size)}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  Optimized <Sparkles className="w-3 h-3" />
                </span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatBytes(resultBlob.size)}
                </p>
              </div>
              {savings && savings.diff > 0 && (
                <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Reduced file size by {savings.percent}% ({formatBytes(savings.diff)} saved)!
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" /> Download Compressed PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Compress Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
