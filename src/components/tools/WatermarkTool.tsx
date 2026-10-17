'use client';

import React, { useState } from 'react';
import { Stamp, Download, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { watermarkPdf, downloadBlob, formatBytes } from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

export function WatermarkTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [text, setText] = useState<string>('CONFIDENTIAL');
  const [opacity, setOpacity] = useState<number>(0.25);
  const [rotationDegrees, setRotationDegrees] = useState<number>(45);
  const fontSize = 48;
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('watermarked.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];

  const handleWatermark = async () => {
    if (!activeFile) return;
    if (!text.trim()) {
      setError('Please provide watermark text.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const watermarked = await watermarkPdf(activeFile.file, text, {
        opacity,
        rotationDegrees,
        fontSize,
      });
      setResultBlob(watermarked);
      setResultName(`watermarked-${activeFile.name}`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to apply watermark to PDF.'
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
            title="Drop PDF to add diagonal text watermark"
            description="Protect copyright and mark documents DRAFT or CONFIDENTIAL in-memory"
          />

          {activeFile && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, PROPRIETARY"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[11px] text-slate-400 font-medium">Quick presets:</span>
                  {['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY', 'SAMPLE'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setText(preset)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Opacity & Angle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Transparency / Opacity</span>
                    <span className="text-indigo-600 font-bold">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Angle</span>
                    <span className="text-indigo-600 font-bold">{rotationDegrees}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { deg: 45, label: '45° Diagonal' },
                      { deg: 0, label: '0° Horizontal' },
                      { deg: 90, label: '90° Vertical' },
                    ].map((item) => (
                      <button
                        key={item.deg}
                        type="button"
                        onClick={() => setRotationDegrees(item.deg)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          rotationDegrees === item.deg
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
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
              onClick={handleWatermark}
              disabled={!activeFile || isProcessing || !text.trim()}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Stamping Watermark in Browser...</span>
                </>
              ) : (
                <>
                  <Stamp className="w-5 h-5" />
                  <span>Apply Watermark to All Pages</span>
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
              Watermark Applied Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Stamped &quot;{text}&quot; at {rotationDegrees}° with {Math.round(opacity * 100)}% opacity ({formatBytes(resultBlob.size)}).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" /> Download Watermarked PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Watermark Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
