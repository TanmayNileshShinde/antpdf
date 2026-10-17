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
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Select Rotation Angle
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDegrees(90)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      degrees === 90
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <RotateCw className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold">90° Right</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDegrees(180)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      degrees === 180
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <RefreshCw className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold">180° Upside</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDegrees(270)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      degrees === 270
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold">90° Left</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Apply Rotation To
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="applyTo"
                      checked={applyTo === 'all'}
                      onChange={() => setApplyTo('all')}
                      className="text-indigo-600"
                    />
                    <span>All Pages ({activeFile.pageCount ?? ''})</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="applyTo"
                      checked={applyTo === 'custom'}
                      onChange={() => setApplyTo('custom')}
                      className="text-indigo-600"
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
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
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
              onClick={handleRotate}
              disabled={!activeFile || isProcessing}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Rotating Pages...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-5 h-5" />
                  <span>Rotate PDF Permanently</span>
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

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Orientation Permanently Fixed!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Rotated by {degrees}° ({formatBytes(resultBlob.size)}).
              The updated orientation will open correctly in all PDF viewers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" /> Download Rotated PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Rotate Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
