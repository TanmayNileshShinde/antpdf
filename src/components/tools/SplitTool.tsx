'use client';

import React, { useState } from 'react';
import { Scissors, Download, Loader2, RefreshCw } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { splitPdf, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function SplitTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState<string>('antpdf-split.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleSplit = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const split = await splitPdf(activeFile.file, rangeInput);
      setResultBlob(split);
      setResultName(`split-${activeFile.name}`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to split PDF. Please check the ranges.'
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
    setRangeInput('1');
  };

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          <FileDropzone
            multiple={false}
            files={files}
            onFilesChange={(newFiles) => {
              setFiles(newFiles);
              if (newFiles.length > 0 && newFiles[0].pageCount) {
                const count = newFiles[0].pageCount;
                setRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : '1');
              }
            }}
            title="Drop the PDF you want to split or extract"
            description="Extract specific pages or custom ranges without uploading to any server"
          />

          {activeFile && (
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1.5">
                  Specify Pages to Extract
                </label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-all"
                />
                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-1.5">
                  Document pages: <strong>{activeFile.pageCount ?? 'Scanning...'}</strong> &bull; Syntax: <code className="text-emerald-600 dark:text-emerald-400">1-3, 5</code>
                </p>
              </div>

              {/* Quick Range Presets */}
              {activeFile.pageCount && activeFile.pageCount > 1 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-neutral-400 font-medium">Quick presets:</span>
                  <button
                    type="button"
                    onClick={() => setRangeInput('1')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Page 1 only
                  </button>
                  <button
                    type="button"
                    onClick={() => setRangeInput(`1-${activeFile.pageCount}`)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    All (1 to {activeFile.pageCount})
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleSplit}
              disabled={!activeFile || isProcessing || !rangeInput.trim()}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Extracting Pages In Browser...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Extract Pages Now</span>
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
                Client Extraction Complete
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
              Extracted Size: {formatBytes(resultBlob.size)} &bull; 100% In Browser WASM
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Extracted PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Split Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
