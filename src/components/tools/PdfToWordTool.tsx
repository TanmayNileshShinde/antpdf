'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, RefreshCw, Sparkles, FileCode } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { convertPdfToWord, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function PdfToWordTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('converted.docx');
  const [pageCount, setPageCount] = useState<number>(1);
  const [snippet, setSnippet] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleConvert = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const res = await convertPdfToWord(activeFile.file);
      setResultBlob(res.blob);
      setPageCount(res.pageCount);
      setSnippet(res.extractedSnippet);
      const generatedName = activeFile.name.replace(/\.pdf$/i, '') + '.docx';
      setResultName(generatedName);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to convert PDF to Word. Please verify the document is not corrupted.'
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
    setSnippet('');
  };

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          <FileDropzone
            multiple={false}
            accept=".pdf,application/pdf"
            files={files}
            onFilesChange={setFiles}
            title="Drop PDF to convert into editable Word (.docx)"
            description="Extract text content and layout structures into standard Microsoft Word format in browser"
          />

          {activeFile && (
            <div className="p-4 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-600 dark:text-neutral-400 flex items-start gap-3">
              <FileCode className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Native OpenXML Synthesis:</strong> This tool extracts vector text items directly from the PDF stream and synthesizes a native Microsoft Word XML document (.docx) in your local device RAM.
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
              onClick={handleConvert}
              disabled={!activeFile || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Synthesizing Word Document In Browser...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Convert PDF to Word DOCX Now</span>
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
                Word Document Ready <Sparkles className="w-3.5 h-3.5" />
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
              Transcoded {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} &bull; Size: {formatBytes(resultBlob.size)} &bull; Compatible with Microsoft Word & Google Docs
            </div>
          </div>

          {snippet && (
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 space-y-1">
              <span className="text-[10px] uppercase text-neutral-500 tracking-wider font-semibold">Text Sample</span>
              <p className="line-clamp-2 text-neutral-300 italic">&ldquo;{snippet}&hellip;&rdquo;</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Word Document (.docx)
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Convert Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
