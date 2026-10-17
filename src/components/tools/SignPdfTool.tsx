'use client';

import React, { useState, useRef } from 'react';
import {
  PenTool,
  Type,
  Upload,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Move,
  Trash2,
} from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import {
  renderPdfThumbnails,
  signPdf,
  downloadBlob,
  formatBytes,
  PdfThumbnail,
  SignaturePlacement,
} from '@/lib/pdf';
import { triggerConfetti } from '@/lib/confetti';

type SignatureMode = 'draw' | 'type' | 'upload';

interface PlacedSignature {
  id: string;
  pageNumber: number;
  // Normalized 0..1 coordinates relative to preview container
  normX: number;
  normY: number;
  normWidth: number;
  normHeight: number;
  dataUrl: string;
}

export function SignPdfTool() {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);
  const [pages, setPages] = useState<PdfThumbnail[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Signature creation state
  const [mode, setMode] = useState<SignatureMode>('draw');
  const [penColor, setPenColor] = useState('#111827');
  const [penWidth, setPenWidth] = useState(3);
  const [typedName, setTypedName] = useState('');
  const [selectedFontStyle, setSelectedFontStyle] = useState(0);
  const [activeSignatureUrl, setActiveSignatureUrl] = useState<string | null>(null);

  // Placed signatures on the document
  const [placements, setPlacements] = useState<PlacedSignature[]>([]);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);

  // Dragging placement state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas drawing refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('signed_document.pdf');
  const [error, setError] = useState<string | null>(null);

  const activeFile = files[0];
  const currentPage = pages[currentPageIndex];

  // Initialize and handle file change
  const handleFilesChange = async (newFiles: UploadedPdfMeta[]) => {
    setFiles(newFiles);
    setResultBlob(null);
    setError(null);
    setPlacements([]);
    setCurrentPageIndex(0);

    if (newFiles.length === 0) {
      setPages([]);
      return;
    }

    const file = newFiles[0].file;
    setIsLoadingPages(true);

    try {
      const thumbs = await renderPdfThumbnails(file, { scale: 0.8 });
      setPages(thumbs);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load PDF pages for signing studio.'
      );
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    lastPointRef.current = { x, y };
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastPointRef.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;
    saveCanvasAsActiveSignature();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setActiveSignatureUrl(null);
  };

  const saveCanvasAsActiveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setActiveSignatureUrl(dataUrl);
  };

  // Generate typed cursive signature
  const fontStyles = [
    { name: 'Elegant Script', font: 'italic bold 36px "Brush Script MT", "Caveat", cursive' },
    { name: 'Classic Signature', font: 'italic 34px "Lucida Handwriting", "Great Vibes", cursive' },
    { name: 'Formal Calligraphy', font: 'italic 32px "Snell Roundhand", "Dancing Script", cursive' },
    { name: 'Casual Pen', font: 'italic 32px "Segoe Script", "Comic Sans MS", cursive' },
  ];

  const handleApplyTyped = (text: string, styleIdx: number, color: string) => {
    if (!text.trim()) return;
    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontStyles[styleIdx].font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const dataUrl = canvas.toDataURL('image/png');
    setActiveSignatureUrl(dataUrl);
  };

  // Handle Image Upload for Signature or Stamp
  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        // Strip white background to make it transparent
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // If close to white, make pixel transparent
          if (r > 225 && g > 225 && b > 225) {
            data[i + 3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setActiveSignatureUrl(canvas.toDataURL('image/png'));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Place active signature on current page
  const handlePlaceSignature = (targetAllPages = false) => {
    if (!activeSignatureUrl) return;

    const newPlacements: PlacedSignature[] = [];
    const targetPageNumbers = targetAllPages
      ? pages.map((p) => p.pageNumber)
      : [currentPage.pageNumber];

    for (const pageNum of targetPageNumbers) {
      newPlacements.push({
        id: `sig-${Date.now()}-${Math.random()}`,
        pageNumber: pageNum,
        normX: 0.6,
        normY: 0.78,
        normWidth: 0.28,
        normHeight: 0.12,
        dataUrl: activeSignatureUrl,
      });
    }

    setPlacements((prev) => [...prev, ...newPlacements]);
    setSelectedPlacementId(newPlacements[0].id);
  };

  // Dragging placement inside preview
  const handleMouseDownOnSig = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedPlacementId(id);
    setIsDragging(true);

    const sig = placements.find((p) => p.id === id);
    if (!sig) return;

    setDragOffset({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMovePreview = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !selectedPlacementId) return;

    const previewContainer = e.currentTarget.getBoundingClientRect();
    const deltaX = (e.clientX - dragOffset.x) / previewContainer.width;
    const deltaY = (e.clientY - dragOffset.y) / previewContainer.height;

    setPlacements((prev) =>
      prev.map((sig) => {
        if (sig.id !== selectedPlacementId) return sig;
        const newX = Math.max(0, Math.min(1 - sig.normWidth, sig.normX + deltaX));
        const newY = Math.max(0, Math.min(1 - sig.normHeight, sig.normY + deltaY));
        return { ...sig, normX: newX, normY: newY };
      })
    );

    setDragOffset({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUpPreview = () => {
    setIsDragging(false);
  };

  const handleDeletePlacement = (id: string) => {
    setPlacements((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlacementId === id) setSelectedPlacementId(null);
  };

  const handleScalePlacement = (id: string, delta: number) => {
    setPlacements((prev) =>
      prev.map((sig) => {
        if (sig.id !== id) return sig;
        const newW = Math.max(0.1, Math.min(0.6, sig.normWidth * delta));
        const newH = Math.max(0.04, Math.min(0.3, sig.normHeight * delta));
        return { ...sig, normWidth: newW, normHeight: newH };
      })
    );
  };

  // Sign & Export PDF
  const handleSignAndExport = async () => {
    if (!activeFile || placements.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const signaturePlacements: SignaturePlacement[] = placements.map((sig) => {
        const targetPage = pages.find((p) => p.pageNumber === sig.pageNumber) || pages[0];
        const originalWidth = targetPage.originalWidth;
        const originalHeight = targetPage.originalHeight;

        // Convert normalized preview coordinates to PDF points (pdf-lib uses bottom-left origin)
        const pdfWidth = sig.normWidth * originalWidth;
        const pdfHeight = sig.normHeight * originalHeight;
        const pdfX = sig.normX * originalWidth;
        // Invert Y coordinate for bottom-left origin
        const pdfY = (1 - sig.normY - sig.normHeight) * originalHeight;

        return {
          pageNumber: sig.pageNumber,
          x: pdfX,
          y: pdfY,
          width: pdfWidth,
          height: pdfHeight,
          imageDataUrl: sig.dataUrl,
        };
      });

      const blob = await signPdf(activeFile.file, signaturePlacements);
      setResultBlob(blob);
      const baseName = activeFile.name.replace(/\.pdf$/i, '');
      setResultName(`${baseName}_signed.pdf`);
      triggerConfetti();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to apply signatures to PDF.'
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
    setPages([]);
    setPlacements([]);
    setResultBlob(null);
    setError(null);
    clearCanvas();
  };

  const currentPagePlacements = placements.filter(
    (p) => p.pageNumber === currentPage?.pageNumber
  );

  return (
    <div className="w-full space-y-6">
      {!resultBlob ? (
        <>
          {pages.length === 0 && !isLoadingPages && (
            <FileDropzone
              multiple={false}
              accept=".pdf,application/pdf"
              files={files}
              onFilesChange={handleFilesChange}
              title="Drop PDF to sign with digital handwritten signature"
              description="Draw, type, or upload your signature and place it anywhere with 100% in-browser privacy"
            />
          )}

          {isLoadingPages && (
            <div className="p-12 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Loading Document Pages...
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Preparing interactive signature canvas in local RAM
              </p>
            </div>
          )}

          {pages.length > 0 && !isLoadingPages && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Signature Creator Studio (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <PenTool className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Create Your Signature
                    </h3>
                  </div>

                  {/* Mode Tabs */}
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    {[
                      { id: 'draw' as const, label: 'Draw', icon: PenTool },
                      { id: 'type' as const, label: 'Type', icon: Type },
                      { id: 'upload' as const, label: 'Upload', icon: Upload },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setMode(tab.id)}
                          className={`py-1.5 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
                            mode === tab.id
                              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mode 1: Draw Canvas */}
                  {mode === 'draw' && (
                    <div className="space-y-3">
                      <div className="relative border border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden bg-white shadow-inner">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={160}
                          onMouseDown={startDrawing}
                          onMouseMove={drawMove}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={drawMove}
                          onTouchEnd={stopDrawing}
                          className="w-full h-40 touch-none cursor-crosshair bg-white"
                        />
                        {!hasDrawn && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs font-mono text-neutral-400">
                            Sign here using mouse or finger
                          </div>
                        )}
                      </div>

                      {/* Pen Controls */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        {/* Color Picker */}
                        <div className="flex items-center gap-1.5">
                          {[
                            { color: '#111827', label: 'Black' },
                            { color: '#1e3a8a', label: 'Navy' },
                            { color: '#2563eb', label: 'Blue' },
                            { color: '#dc2626', label: 'Red' },
                          ].map((c) => (
                            <button
                              key={c.color}
                              type="button"
                              onClick={() => {
                                setPenColor(c.color);
                                if (hasDrawn) saveCanvasAsActiveSignature();
                              }}
                              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                penColor === c.color
                                  ? 'border-emerald-500 scale-110 shadow-sm'
                                  : 'border-transparent'
                              }`}
                              style={{ backgroundColor: c.color }}
                              title={c.label}
                            />
                          ))}
                        </div>

                        {/* Stroke Width */}
                        <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500">
                          <span>Thickness:</span>
                          {[2, 3.5, 5].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setPenWidth(w)}
                              className={`px-2 py-0.5 rounded text-xs ${
                                penWidth === w
                                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold'
                                  : 'bg-neutral-100 dark:bg-neutral-800'
                              }`}
                            >
                              {w === 2 ? 'Fine' : w === 3.5 ? 'Med' : 'Bold'}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          title="Clear drawing pad"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Type Signature */}
                  {mode === 'type' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1">
                          Full Name or Initials
                        </label>
                        <input
                          type="text"
                          value={typedName}
                          onChange={(e) => {
                            setTypedName(e.target.value);
                            handleApplyTyped(e.target.value, selectedFontStyle, penColor);
                          }}
                          placeholder="e.g. Antara Parab"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-all"
                        />
                      </div>

                      {/* Font Style Selection */}
                      <div className="grid grid-cols-2 gap-2">
                        {fontStyles.map((style, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedFontStyle(idx);
                              handleApplyTyped(typedName, idx, penColor);
                            }}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              selectedFontStyle === idx
                                ? 'border-neutral-900 dark:border-neutral-200 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                                : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            <div className="text-xs font-serif italic truncate">
                              {typedName || 'Antara Parab'}
                            </div>
                            <div className="text-[10px] font-mono opacity-70 mt-0.5">
                              {style.name}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Color Selector */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-mono text-neutral-500 mr-1">Ink:</span>
                        {[
                          { color: '#111827', label: 'Black' },
                          { color: '#1e3a8a', label: 'Navy' },
                          { color: '#2563eb', label: 'Blue' },
                          { color: '#dc2626', label: 'Red' },
                        ].map((c) => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => {
                              setPenColor(c.color);
                              handleApplyTyped(typedName, selectedFontStyle, c.color);
                            }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              penColor === c.color
                                ? 'border-emerald-500 scale-110 shadow-sm'
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c.color }}
                            title={c.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode 3: Upload Image */}
                  {mode === 'upload' && (
                    <div className="space-y-3">
                      <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/40 dark:bg-neutral-900/40">
                        <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Upload Signature or Stamp Image
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 mt-1">
                          PNG, JPG with auto-transparent background
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={handleUploadSignature}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Active Signature Action Bar */}
                  {activeSignatureUrl && (
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center h-16">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeSignatureUrl}
                          alt="Active Signature"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlaceSignature(false)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Place on Page {currentPageIndex + 1}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePlaceSignature(true)}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                        >
                          <span>Place on All Pages</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Placed Signatures Summary List */}
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                      Placed Stamps ({placements.length})
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Drag stamps on canvas to reposition
                    </span>
                  </div>

                  {placements.length === 0 ? (
                    <p className="text-xs font-mono text-neutral-400 text-center py-4">
                      No signature stamps placed yet. Create a signature and click &quot;Place on Page&quot;.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {placements.map((sig, idx) => (
                        <div
                          key={sig.id}
                          onClick={() => setSelectedPlacementId(sig.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            selectedPlacementId === sig.id
                              ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20'
                              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                              Page {sig.pageNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScalePlacement(sig.id, 0.85);
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              title="Shrink signature"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScalePlacement(sig.id, 1.15);
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              title="Enlarge signature"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlacement(sig.id);
                              }}
                              className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors ml-1"
                              title="Remove placement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive Document Canvas Viewer (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Page Navigation Header */}
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPageIndex === 0}
                      onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                      Page {currentPageIndex + 1} of {pages.length}
                    </span>
                    <button
                      type="button"
                      disabled={currentPageIndex === pages.length - 1}
                      onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-400">
                    {currentPagePlacements.length} {currentPagePlacements.length === 1 ? 'stamp' : 'stamps'} on this page
                  </span>
                </div>

                {/* Interactive Placement Canvas Container */}
                <div
                  onMouseMove={handleMouseMovePreview}
                  onMouseUp={handleMouseUpPreview}
                  className="relative w-full rounded-2xl bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center p-3 select-none overflow-hidden min-h-[500px]"
                >
                  {currentPage && (
                    <div className="relative inline-block max-w-full rounded-xl overflow-hidden shadow-2xl bg-white border border-neutral-200">
                      {/* Document Page Canvas Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentPage.dataUrl}
                        alt={`Page ${currentPageIndex + 1}`}
                        className="max-h-[640px] w-auto object-contain pointer-events-none"
                      />

                      {/* Placed Signatures on Current Page */}
                      {currentPagePlacements.map((sig) => (
                        <div
                          key={sig.id}
                          onMouseDown={(e) => handleMouseDownOnSig(e, sig.id)}
                          style={{
                            left: `${sig.normX * 100}%`,
                            top: `${sig.normY * 100}%`,
                            width: `${sig.normWidth * 100}%`,
                            height: `${sig.normHeight * 100}%`,
                          }}
                          className={`absolute cursor-move border-2 rounded p-1 group flex items-center justify-center ${
                            selectedPlacementId === sig.id
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-dashed border-indigo-400/80 bg-indigo-500/10 hover:border-emerald-500'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sig.dataUrl}
                            alt="Signature Stamp"
                            className="w-full h-full object-contain pointer-events-none"
                          />

                          <div className="absolute -top-3 -right-3 p-1 rounded-full bg-neutral-900 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <Move className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
                    {error}
                  </div>
                )}

                {/* Final Sign & Export Action */}
                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSignAndExport}
                    disabled={placements.length === 0 || isProcessing}
                    className="relative group px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-tight border border-neutral-800 dark:border-neutral-200 shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span className="font-mono">Applying Digital Signatures...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                        <span>
                          {placements.length > 0
                            ? `Sign & Download PDF (${placements.length} ${
                                placements.length === 1 ? 'Stamp' : 'Stamps'
                              })`
                            : 'Place Signature to Continue'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Result Success Card */
        <div className="p-6 sm:p-7 rounded-2xl border border-emerald-500/30 bg-neutral-950 text-white relative overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                Signature Placed Successfully <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              0 bytes cloud transfer &bull; 100% In Browser
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-base sm:text-lg font-bold tracking-tight text-white">
              {resultName}
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Signed Document: Embedded {placements.length} {placements.length === 1 ? 'signature' : 'signatures'} &bull; Size: {formatBytes(resultBlob.size)} &bull; Ready to download
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Signed PDF
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sign Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
