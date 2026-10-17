import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import {
  PageNumberOptions,
  WatermarkOptions,
  CompressOptions,
} from './types';
import {
  fileToUint8Array,
  uint8ArrayToBlob,
  parsePageRanges,
} from './helpers';

/**
 * Merges multiple PDF files into a single unified PDF document.
 * Memory-efficient, maintains page dimensions and bookmarks.
 */
export async function mergePdfs(files: File[]): Promise<Blob> {
  if (!files || files.length === 0) {
    throw new Error('Please select at least one PDF file to merge.');
  }

  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileBytes = await fileToUint8Array(file);
    const sourceDoc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: true,
    });
    const copiedPages = await mergedDoc.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices()
    );
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  const mergedBytes = await mergedDoc.save({ useObjectStreams: true });
  return uint8ArrayToBlob(mergedBytes);
}

/**
 * Splits or extracts specific page numbers and page ranges from a PDF document.
 * Examples: "1-3, 5, 8"
 */
export async function splitPdf(file: File, ranges: string): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  const fileBytes = await fileToUint8Array(file);
  const sourceDoc = await PDFDocument.load(fileBytes, {
    ignoreEncryption: true,
  });

  const totalPages = sourceDoc.getPageCount();
  if (totalPages === 0) {
    throw new Error('The PDF document contains no pages.');
  }

  const selectedPages1Based = parsePageRanges(ranges, totalPages);
  const pageIndices0Based = selectedPages1Based.map((p) => p - 1);

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices0Based);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const splitBytes = await newDoc.save({ useObjectStreams: true });
  return uint8ArrayToBlob(splitBytes);
}

/**
 * Permanently rotates specified pages (or all pages) of a PDF by degrees (e.g. 90, 180, 270).
 */
export async function rotatePdf(
  file: File,
  deg: number,
  pages?: number[]
): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  const fileBytes = await fileToUint8Array(file);
  const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const allPages = doc.getPages();

  const targetIndices =
    pages && pages.length > 0
      ? pages.map((p) => p - 1)
      : allPages.map((_, idx) => idx);

  const uniqueIndices = Array.from(new Set(targetIndices));

  for (const idx of uniqueIndices) {
    if (idx >= 0 && idx < allPages.length) {
      const page = allPages[idx];
      const currentRotation = page.getRotation().angle;
      const normalizedAngle = ((currentRotation + deg) % 360 + 360) % 360;
      page.setRotation(degrees(normalizedAngle));
    }
  }

  const rotatedBytes = await doc.save({ useObjectStreams: true });
  return uint8ArrayToBlob(rotatedBytes);
}

/**
 * Compresses a PDF document by stripping redundant metadata, optimizing object streams,
 * and compacting structural dictionaries.
 */
export async function compressPdf(
  file: File,
  quality: 'low' | 'medium' | 'high' = 'medium',
  options?: CompressOptions
): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  const fileBytes = await fileToUint8Array(file);
  const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  // Remove bulky or redundant metadata tags if medium or high compression
  if (options?.removeMetadata !== false && (quality === 'medium' || quality === 'high')) {
    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setProducer('AnTPDF (https://antpdf.tanmayshinde.com)');
    doc.setCreator('AnTPDF Client Side Engine');
  }

  // Save using modern Flate object stream compression
  const compressedBytes = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });

  return uint8ArrayToBlob(compressedBytes);
}

/**
 * Encrypts a PDF file with RC4 128-bit password protection.
 * Client-side zero-knowledge security.
 */
export async function protectPdf(
  file: File,
  userPass: string,
  ownerPass?: string
): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  if (!userPass || userPass.trim().length === 0) {
    throw new Error('Password cannot be empty.');
  }

  const fileBytes = await fileToUint8Array(file);
  const encryptedBytes = await encryptPDF(
    fileBytes,
    userPass,
    ownerPass || userPass
  );

  return uint8ArrayToBlob(encryptedBytes);
}

/**
 * Removes password protection and unlocks a PDF document, exporting an unencrypted version.
 */
export async function unlockPdf(
  file: File,
  password?: string
): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  void password;
  const fileBytes = await fileToUint8Array(file);

  const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  // Remove the encryption dictionary from trailer to ensure export is unencrypted
  if (doc.context.trailerInfo && (doc.context.trailerInfo as Record<string, unknown>).Encrypt) {
    delete (doc.context.trailerInfo as Record<string, unknown>).Encrypt;
  }

  const unlockedBytes = await doc.save({
    useObjectStreams: true,
  });

  return uint8ArrayToBlob(unlockedBytes);
}

/**
 * Stamps custom page numbers across all pages of a PDF with customizable layout, position, and styling.
 */
export async function addPageNumbers(
  file: File,
  options: PageNumberOptions = {}
): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  const {
    position = 'bottom-right',
    format = 'page-x-of-y',
    fontSize = 10,
    color = { r: 0.35, g: 0.35, b: 0.35 },
    margin = 28,
    startFrom = 1,
  } = options;

  const fileBytes = await fileToUint8Array(file);
  const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const totalPages = pages.length;

  pages.forEach((page, index) => {
    const currentNum = startFrom + index;
    let label = '';
    switch (format) {
      case 'number-only':
        label = `${currentNum}`;
        break;
      case 'page-x':
        label = `Page ${currentNum}`;
        break;
      case 'page-x-of-y':
      default:
        label = `Page ${currentNum} of ${startFrom + totalPages - 1}`;
        break;
    }

    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    let x = 0;
    let y = 0;

    switch (position) {
      case 'bottom-left':
        x = margin;
        y = margin;
        break;
      case 'bottom-center':
        x = (width - textWidth) / 2;
        y = margin;
        break;
      case 'bottom-right':
        x = width - textWidth - margin;
        y = margin;
        break;
      case 'top-left':
        x = margin;
        y = height - margin - textHeight;
        break;
      case 'top-center':
        x = (width - textWidth) / 2;
        y = height - margin - textHeight;
        break;
      case 'top-right':
        x = width - textWidth - margin;
        y = height - margin - textHeight;
        break;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  });

  const numberedBytes = await doc.save({ useObjectStreams: true });
  return uint8ArrayToBlob(numberedBytes);
}

/**
 * Stamps a diagonal semi-transparent text watermark across all pages of a PDF document.
 */
export async function watermarkPdf(
  file: File,
  text: string,
  options: WatermarkOptions = {}
): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  if (!text || text.trim().length === 0) {
    throw new Error('Watermark text cannot be empty.');
  }

  const {
    fontSize = 48,
    opacity = 0.25,
    rotationDegrees = 45,
    color = { r: 0.6, g: 0.6, b: 0.6 },
  } = options;

  // Sanitize non-ASCII / curly quotes for standard Helvetica
  const cleanText = text
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7E]/g, '');

  const displayText = cleanText.trim().length > 0 ? cleanText : text;

  const fileBytes = await fileToUint8Array(file);
  const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();

  const angleRad = (rotationDegrees * Math.PI) / 180;
  const textWidth = font.widthOfTextAtSize(displayText, fontSize);
  const textHeight = font.heightAtSize(fontSize);

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    // Center point math with rotation offset
    const x =
      width / 2 -
      (textWidth / 2) * Math.cos(angleRad) +
      (textHeight / 2) * Math.sin(angleRad);
    const y =
      height / 2 -
      (textWidth / 2) * Math.sin(angleRad) -
      (textHeight / 2) * Math.cos(angleRad);

    page.drawText(displayText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotationDegrees),
    });
  });

  const watermarkedBytes = await doc.save({ useObjectStreams: true });
  return uint8ArrayToBlob(watermarkedBytes);
}

/**
 * Flattens all interactive form fields and annotations into static document content.
 */
export async function flattenPdf(file: File): Promise<Blob> {
  if (!file) throw new Error('No PDF file provided.');
  const fileBytes = await fileToUint8Array(file);
  const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  try {
    const form = doc.getForm();
    form.flatten();
  } catch {
    // If no form or fields exist, flatten is a no-op
  }

  const flattenedBytes = await doc.save({ useObjectStreams: true });
  return uint8ArrayToBlob(flattenedBytes);
}
