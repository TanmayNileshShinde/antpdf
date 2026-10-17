'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { convertWordToPdf, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function WordToPdfTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('converted.pdf');
  const [pageCount, setPageCount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleConvert = async () => {
    if (!activeFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const res = await convertWordToPdf(activeFile.file, { pageSize });
      setResultBlob(res.blob);
      setPageCount(res.pageCount);
      const generatedName = activeFile.name.replace(/\.docx?$/i, '') + '.pdf';
      setResultName(generatedName);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to convert Word file. Please verify it is a valid .docx document.'
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
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            files={files}
            onFilesChange={setFiles}
            title="Drop Microsoft Word (.docx) file to convert"
            description="Transcode OpenXML documents into clean vector PDF 100% locally in device RAM"
          />

          {activeFile && (
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
                  Target Page Standard
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'A4' as const, label: 'ISO A4 (210 x 297 mm)', desc: 'Global international standard' },
                    { id: 'Letter' as const, label: 'US Letter (8.5 x 11 in)', desc: 'North American standard' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPageSize(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        pageSize === item.id
                          ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className={`text-[11px] mt-0.5 ${pageSize === item.id ? 'opacity-80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
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
              onClick={handleConvert}
              disabled={!activeFile || isProcessing}
              className="relative group px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="font-mono">Transcoding Word to PDF In Browser...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Convert Word to PDF Now</span>
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
                Word Transcoding Complete <Sparkles className="w-3.5 h-3.5" />
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
              Generated PDF: {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} &bull; Size: {formatBytes(resultBlob.size)} &bull; 100% In Browser
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Converted PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Convert Another Word File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
