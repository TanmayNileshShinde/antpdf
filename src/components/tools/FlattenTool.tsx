'use client';

import React, { useState } from 'react';
import { FileCheck, Download, Loader2, RefreshCw, ShieldAlert } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { flattenPdf, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function FlattenTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('flattened.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleFlatten = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const flattened = await flattenPdf(activeFile.file);
      setResultBlob(flattened);
      setResultName(`flattened-${activeFile.name}`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to flatten PDF form fields.'
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
            multiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Drop PDF form or annotated document to flatten"
            description="Permanently lock form values, checkboxes, and annotations into static pages"
          />

          {activeFile && (
            <div className="p-4 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Irreversible Graphic Fusion:</strong> Flattening converts interactive form fields and digital annotation widgets into static raster/vector graphics. Entered values cannot be tampered with or modified.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleFlatten}
              disabled={!activeFile || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Fusing Form Fields In Browser...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Flatten PDF Form Fields Now</span>
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
                Form Fields Permanently Fused
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
              Flattened Size: {formatBytes(resultBlob.size)} &bull; Form Fields Converted to Static Graphics &bull; 100% In Browser WASM
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Flattened PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Flatten Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
