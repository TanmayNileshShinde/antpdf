'use client';

import React, { useState } from 'react';
import { Hash, Download, Loader2, RefreshCw } from 'lucide-react';
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
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-5">
              {/* Position Matrix */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
                  Number Placement Matrix
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
                      className={`p-2.5 rounded-xl border text-xs font-mono transition-all ${
                        position === pos.id
                          ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm font-semibold'
                          : 'border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
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
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1.5">
                    Numbering Style
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as PageNumberFormat)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-all"
                  >
                    <option value="page-x-of-y">Page X of Y (e.g. Page 1 of 10)</option>
                    <option value="page-x">Page X (e.g. Page 1)</option>
                    <option value="number-only">Number only (e.g. 1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1.5">
                    Start Counter From
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startFrom}
                    onChange={(e) => setStartFrom(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-all"
                  />
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
              onClick={handleAddNumbers}
              disabled={!activeFile || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Stamping Numbers In Browser...</span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4" />
                  <span>Stamp Page Numbers Now</span>
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
                Pagination Complete
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
              Positioned at {position} &bull; Size: {formatBytes(resultBlob.size)} &bull; 100% In Browser WASM
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Numbered PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Number Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
