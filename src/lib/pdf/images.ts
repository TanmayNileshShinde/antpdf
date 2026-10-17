import { PDFDocument } from 'pdf-lib';
import { uint8ArrayToBlob } from './helpers';

export interface ImagesToPdfOptions {
  pageSize?: 'A4' | 'Letter' | 'Fit';
  orientation?: 'portrait' | 'landscape' | 'auto';
  margin?: number;
}

export interface PdfToImagesOptions {
  format?: 'jpeg' | 'png';
  dpi?: 150 | 300;
  quality?: number;
}

export interface RenderedPageImage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Converts multiple image files (JPG, PNG, WebP) into a single unified PDF document.
 */
export async function convertImagesToPdf(
  files: File[],
  options?: ImagesToPdfOptions
): Promise<Blob> {
  if (!files || files.length === 0) {
    throw new Error('Please select at least one image file to convert.');
  }

  const doc = await PDFDocument.create();
  const margin = options?.margin ?? 20;
  const pageSizeOption = options?.pageSize ?? 'A4';

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let embeddedImage;
    const isJpg = file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name);
    const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);

    if (isJpg) {
      embeddedImage = await doc.embedJpg(bytes);
    } else if (isPng) {
      embeddedImage = await doc.embedPng(bytes);
    } else {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const pngBytes = await rasterizeImageToPngBytes(file);
        embeddedImage = await doc.embedPng(pngBytes);
      } else {
        try {
          embeddedImage = await doc.embedJpg(bytes);
        } catch {
          embeddedImage = await doc.embedPng(bytes);
        }
      }
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let pageWidth = 595.28;
    let pageHeight = 841.89;

    if (pageSizeOption === 'Fit') {
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    } else if (pageSizeOption === 'Letter') {
      pageWidth = 612;
      pageHeight = 792;
    } else {
      // ISO A4
      pageWidth = 595.28;
      pageHeight = 841.89;
    }

    if (
      options?.orientation === 'landscape' ||
      (options?.orientation === 'auto' && imgWidth > imgHeight)
    ) {
      if (pageSizeOption !== 'Fit') {
        const temp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      }
    }

    const availableWidth = Math.max(10, pageWidth - margin * 2);
    const availableHeight = Math.max(10, pageHeight - margin * 2);

    const scale = Math.min(
      availableWidth / imgWidth,
      availableHeight / imgHeight
    );
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = margin + (availableWidth - drawWidth) / 2;
    const y = margin + (availableHeight - drawHeight) / 2;

    const page = doc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  doc.setProducer('AnTPDF (https://antpdf.tanmayshinde.com)');
  doc.setCreator('AnTPDF Image Transcoder Engine');

  const pdfBytes = await doc.save({ useObjectStreams: true });
  return uint8ArrayToBlob(pdfBytes);
}

/**
 * Converts a PDF document into high-resolution JPG or PNG images.
 * Generates an in-memory ZIP archive of all pages for instant batch download.
 */
export async function convertPdfToImages(
  file: File,
  options?: PdfToImagesOptions
): Promise<{ pages: RenderedPageImage[]; zipBlob: Blob }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist/build/pdf.js');

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    disableFontFace: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const format = options?.format ?? 'jpeg';
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const ext = format === 'png' ? 'png' : 'jpg';
  const quality = options?.quality ?? 0.92;
  const dpi = options?.dpi ?? 150;
  const scale = dpi === 300 ? 300 / 72 : 150 / 72;

  const pages: RenderedPageImage[] = [];
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  const baseName = file.name.replace(/\.pdf$/i, '');

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context is not available.');
      }

      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error(`Failed to render page ${pageNum} to image.`));
          },
          mimeType,
          quality
        );
      });

      const dataUrl = canvas.toDataURL(mimeType, quality);

      pages.push({
        pageNumber: pageNum,
        blob,
        dataUrl,
        width: canvas.width,
        height: canvas.height,
      });

      const filename = `${baseName}_page_${String(pageNum).padStart(3, '0')}.${ext}`;
      zip.file(filename, blob);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  return {
    pages,
    zipBlob,
  };
}

/**
 * In-browser canvas rasterizer for WebP or other image formats into PNG bytes.
 */
async function rasterizeImageToPngBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2d context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert image to PNG'));
          return;
        }
        blob.arrayBuffer().then((ab) => resolve(new Uint8Array(ab)));
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };
    img.src = url;
  });
}
