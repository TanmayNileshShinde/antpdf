import { PDFDocument } from 'pdf-lib';
import { PdfDocumentInfo } from './types';

/**
 * Converts a File or Blob into a Uint8Array
 */
export async function fileToUint8Array(file: File | Blob): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Converts a Uint8Array to a downloadable PDF Blob
 */
export function uint8ArrayToBlob(
  bytes: Uint8Array,
  mimeType: string = 'application/pdf'
): Blob {
  return new Blob([new Uint8Array(bytes)], { type: mimeType });
}

/**
 * Triggers an immediate browser download for a given Blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Human-readable byte formatting (e.g. 1.25 MB, 450 KB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Parses user range strings such as "1-3, 5, 8-10" or "1, 2, 4" into 1-based page numbers.
 * Validates against the total pages of the document.
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const cleanStr = rangeStr.trim();
  if (!cleanStr) {
    throw new Error('Please enter at least one page number or range.');
  }

  const pages = new Set<number>();
  const parts = cleanStr.split(/[,;\s]+/).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid range specification: "${part}". Example: 1-5`);
      }
      if (start < 1 || end < 1) {
        throw new Error(`Page numbers must be greater than 0: "${part}"`);
      }
      if (start > end) {
        throw new Error(`Start page cannot be greater than end page: "${part}"`);
      }

      for (let p = start; p <= end; p++) {
        if (p <= totalPages) {
          pages.add(p);
        } else {
          throw new Error(
            `Page ${p} exceeds total document page count (${totalPages}).`
          );
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum)) {
        throw new Error(`Invalid page number: "${part}"`);
      }
      if (pageNum < 1) {
        throw new Error(`Page number must be at least 1: "${pageNum}"`);
      }
      if (pageNum > totalPages) {
        throw new Error(
          `Page ${pageNum} exceeds total document page count (${totalPages}).`
        );
      }
      pages.add(pageNum);
    }
  }

  const result = Array.from(pages).sort((a, b) => a - b);
  if (result.length === 0) {
    throw new Error('No valid pages found in the provided range.');
  }
  return result;
}

/**
 * Returns the page count of a PDF file
 */
export async function getPdfPageCount(
  fileOrBytes: File | Blob | Uint8Array
): Promise<number> {
  const bytes =
    fileOrBytes instanceof Uint8Array
      ? fileOrBytes
      : await fileToUint8Array(fileOrBytes);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

/**
 * Retrieves full document info and metadata from a PDF file
 */
export async function getPdfInfo(
  file: File | Blob | Uint8Array
): Promise<PdfDocumentInfo> {
  const bytes =
    file instanceof Uint8Array ? file : await fileToUint8Array(file);
  const sizeBytes = bytes.byteLength;
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  return {
    pageCount: doc.getPageCount(),
    title: doc.getTitle() || undefined,
    author: doc.getAuthor() || undefined,
    subject: doc.getSubject() || undefined,
    creator: doc.getCreator() || undefined,
    producer: doc.getProducer() || undefined,
    creationDate: doc.getCreationDate() || undefined,
    modificationDate: doc.getModificationDate() || undefined,
    isEncrypted: doc.isEncrypted,
    sizeBytes,
  };
}
