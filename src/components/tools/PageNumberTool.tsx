'use client';

import React, { useState } from 'react';
import { Hash, Download, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { addPageNumbers, downloadBlob, formatBytes, PageNumberPosition, PageNumberFormat } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function PageNumberTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [position, setPosition] = useState<PageNumberPosition>('bottom-right');
  const [format, setFormat] = useState<PageNumberFormat>('page-x-of-y');
  const [startFrom, setStartFrom] = useState<number>(1);
  const fontSize = 10;
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('numbered.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleAddNumbers = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const numbered = await addPageNumbers(activeFile.file, {
        position,
        format,
        startFrom: Number(startFrom) || 1,
        fontSize: Number(fontSize) || 10,
      });
      setResultBlob(numbered);
      setResultName(`numbered-${activeFile.name}`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to add page numbers.'
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
    setPosition('bottom-right');
  };

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          <FileDropzone
            multiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Drop PDF to add page numbers"
            description="Stamp clean, customizable pagination numbers across your pages"
          />

          {activeFile && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5">
              {/* Position Matrix */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Number Placement Position
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top-left' as const, label: 'Top Left' },
                    { id: 'top-center' as const, label: 'Top Center' },
                    { id: 'top-right' as const, label: 'Top Right' },
                    { id: 'bottom-left' as const, label: 'Bottom Left' },
                    { id: 'bottom-center' as const, label: 'Bottom Center' },
                    { id: 'bottom-right' as const, label: 'Bottom Right' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setPosition(pos.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        position === pos.id
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Numbering Style
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as PageNumberFormat)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="page-x-of-y">Page X of Y (e.g. Page 1 of 10)</option>
                    <option value="page-x">Page X (e.g. Page 1)</option>
                    <option value="number-only">Number only (e.g. 1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Start Numbering From
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startFrom}
                    onChange={(e) => setStartFrom(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
              onClick={handleAddNumbers}
              disabled={!activeFile || isProcessing}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Stamping Page Numbers...</span>
                </>
              ) : (
                <>
                  <Hash className="w-5 h-5" />
                  <span>Stamp Page Numbers Now</span>
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
              Page Numbers Stamped Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Formatted with {format} at {position} ({formatBytes(resultBlob.size)}).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" /> Download Numbered PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Number Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
