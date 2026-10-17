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
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-3">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
                Select Compression Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'high' as const,
                    title: 'High Compression',
                    desc: 'Aggressive object stream compaction.',
                  },
                  {
                    id: 'medium' as const,
                    title: 'Standard (Balanced)',
                    desc: 'Sharp vector fidelity, compact footprint.',
                  },
                  {
                    id: 'low' as const,
                    title: 'Light Compression',
                    desc: 'Preserves complete structural tags.',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQuality(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      quality === item.id
                        ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className={`text-[11px] mt-1 ${quality === item.id ? 'opacity-80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
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
              onClick={handleCompress}
              disabled={!activeFile || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Compacting Streams In Browser...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Compress PDF Now</span>
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
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Client Optimization Complete
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              0 bytes cloud transfer
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-base sm:text-lg font-bold tracking-tight text-white">
              {resultName}
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              In Browser WASM Object Compaction
            </div>
          </div>

          {activeFile && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  Original Size
                </span>
                <p className="text-xs sm:text-sm font-bold text-neutral-300 mt-0.5">
                  {formatBytes(activeFile.size)}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  Optimized <Sparkles className="w-3 h-3" />
                </span>
                <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">
                  {formatBytes(resultBlob.size)}
                </p>
              </div>
              {savings && savings.diff > 0 && (
                <div className="col-span-2 pt-2 border-t border-neutral-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                  <span>Reduced by {savings.percent}%</span>
                  <span className="text-neutral-500">&bull;</span>
                  <span>{formatBytes(savings.diff)} saved</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Compressed PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Compress Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
