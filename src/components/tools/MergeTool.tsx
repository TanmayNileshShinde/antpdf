'use client';

import React, { useState } from 'react';
import { Layers, Download, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { mergePdfs, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function MergeTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState<string>('antpdf-merged.pdf');
  const [error, setError] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length === 0) return;
    setError(null);
    setIsProcessing(true);

    try {
      const merged = await mergePdfs(files.map((f) => f.file));
      setResultBlob(merged);
      const generatedName = `antpdf-merged-${Date.now().toString().slice(-4)}.pdf`;
      setResultName(generatedName);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to merge PDF files. Please ensure files are valid.'
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
            files={files}
            onFilesChange={setFiles}
            title="Drop multiple PDF files to combine"
            description="Drag files here or click to browse. You can add as many PDFs as you need."
          />

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={handleMerge}
              disabled={files.length === 0 || isProcessing}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Merging PDFs in Browser...</span>
                </>
              ) : (
                <>
                  <Layers className="w-5 h-5" />
                  <span>
                    Merge {files.length > 0 ? `${files.length} Files` : 'PDFs Now'}
                  </span>
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
              PDFs Merged Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Your combined document is ready ({formatBytes(resultBlob.size)}).
              Processed 100% on your device.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" /> Download Combined PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Merge More Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
