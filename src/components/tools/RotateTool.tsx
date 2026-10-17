'use client';

import React, { useState } from 'react';
import { RotateCw, RotateCcw, Download, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { rotatePdf, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function RotateTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [degrees, setDegrees] = useState<number>(90);
  const [applyTo, setApplyTo] = useState<'all' | 'custom'>('all');
  const [pageInput, setPageInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('rotated.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleRotate = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      let pages: number[] | undefined = undefined;
      if (applyTo === 'custom') {
        const parts = pageInput.split(/[,;\s]+/).filter(Boolean);
        pages = parts.map((p) => parseInt(p, 10)).filter((p) => !isNaN(p) && p > 0);
        if (pages.length === 0) {
          throw new Error('Please specify at least one valid page number to rotate.');
        }
      }

      const rotated = await rotatePdf(activeFile.file, degrees, pages);
      setResultBlob(rotated);
      setResultName(`rotated-${activeFile.name}`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to rotate PDF document.'
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
    setDegrees(90);
    setApplyTo('all');
  };

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          <FileDropzone
            multiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Drop PDF to rotate pages permanently"
            description="Fix upside-down or sideways pages directly in your browser"
          />

          {activeFile && (
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
                  Select Rotation Degree
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { deg: 90, label: '90° Clockwise', icon: RotateCw },
                    { deg: 180, label: '180° Inversion', icon: RefreshCw },
                    { deg: 270, label: '90° Counter', icon: RotateCcw },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.deg}
                        type="button"
                        onClick={() => setDegrees(item.deg)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          degrees === item.deg
                            ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                            : 'border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${degrees === item.deg ? 'text-emerald-400' : 'text-neutral-500'}`} />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
                  Apply Rotation Scope
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-mono text-neutral-800 dark:text-neutral-200 cursor-pointer">
                    <input
                      type="radio"
                      name="applyTo"
                      checked={applyTo === 'all'}
                      onChange={() => setApplyTo('all')}
                      className="accent-neutral-900 dark:accent-neutral-100"
                    />
                    <span>All Pages ({activeFile.pageCount ?? ''})</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-mono text-neutral-800 dark:text-neutral-200 cursor-pointer">
                    <input
                      type="radio"
                      name="applyTo"
                      checked={applyTo === 'custom'}
                      onChange={() => setApplyTo('custom')}
                      className="accent-neutral-900 dark:accent-neutral-100"
                    />
                    <span>Specific Pages</span>
                  </label>
                </div>

                {applyTo === 'custom' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      placeholder="e.g. 1, 3, 5"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-all"
                    />
                  </div>
                )}
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
              onClick={handleRotate}
              disabled={!activeFile || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Rotating In Browser...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  <span>Rotate PDF Permanently</span>
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
                Orientation Updated
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
              Rotated by {degrees}° &bull; Size: {formatBytes(resultBlob.size)} &bull; 100% In Browser WASM
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Rotated PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Rotate Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
