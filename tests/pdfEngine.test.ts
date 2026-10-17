import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  compressPdf,
  protectPdf,
  unlockPdf,
  addPageNumbers,
  watermarkPdf,
  flattenPdf,
  convertWordToPdf,
  convertPdfToWord,
  parsePageRanges,
  formatBytes,
} from '../src/lib/pdf';

// Helper to create a test PDF File with N pages
async function createTestPdfFile(name: string, pageCount: number = 2): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([300, 400]);
    // Tag each page with some content
    const font = await doc.embedFont('Helvetica');
    page.drawText(`Page ${i + 1} content`, { x: 50, y: 350, size: 14, font });
  }
  const bytes = await doc.save();
  return new File([bytes.buffer as ArrayBuffer], name, { type: 'application/pdf' });
}

describe('AnTPDF Core Client-Side Engine Tests', () => {
  it('formats bytes properly into human-readable strings', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB');
  });

  it('parses page ranges correctly and rejects out-of-bounds inputs', () => {
    expect(parsePageRanges('1-3, 5', 5)).toEqual([1, 2, 3, 5]);
    expect(parsePageRanges('2, 4', 5)).toEqual([2, 4]);
    expect(() => parsePageRanges('1-10', 5)).toThrowError();
    expect(() => parsePageRanges('0', 5)).toThrowError();
    expect(() => parsePageRanges('5-2', 5)).toThrowError();
  });

  it('merges multiple PDF files into one single document', async () => {
    const file1 = await createTestPdfFile('doc1.pdf', 2);
    const file2 = await createTestPdfFile('doc2.pdf', 3);

    const mergedBlob = await mergePdfs([file1, file2]);
    expect(mergedBlob).toBeInstanceOf(Blob);
    expect(mergedBlob.type).toBe('application/pdf');

    const buffer = await mergedBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPageCount()).toBe(5);
  });

  it('splits / extracts specified page ranges from a PDF', async () => {
    const file = await createTestPdfFile('doc.pdf', 4);
    const splitBlob = await splitPdf(file, '1, 3-4');

    expect(splitBlob).toBeInstanceOf(Blob);
    const buffer = await splitBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPageCount()).toBe(3);
  });

  it('rotates PDF pages by requested degrees permanently', async () => {
    const file = await createTestPdfFile('doc.pdf', 2);
    // Rotate only page 1 by 90 degrees
    const rotatedBlob = await rotatePdf(file, 90, [1]);

    const buffer = await rotatedBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    const pages = doc.getPages();
    expect(pages[0].getRotation().angle).toBe(90);
    expect(pages[1].getRotation().angle).toBe(0);
  });

  it('compresses PDF and optimizes object stream structures', async () => {
    const file = await createTestPdfFile('doc.pdf', 3);
    const compressedBlob = await compressPdf(file, 'high');

    expect(compressedBlob).toBeInstanceOf(Blob);
    const buffer = await compressedBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPageCount()).toBe(3);
  });

  it('encrypts / protects PDF with user password and unlocks it', async () => {
    const file = await createTestPdfFile('doc.pdf', 2);
    const protectedBlob = await protectPdf(file, 'AnTPDF_Secret_2026');

    expect(protectedBlob).toBeInstanceOf(Blob);
    const encryptedBuffer = await protectedBlob.arrayBuffer();

    // Verify it is recognized as encrypted
    const encryptedDoc = await PDFDocument.load(encryptedBuffer, { ignoreEncryption: true });
    expect(encryptedDoc.isEncrypted).toBe(true);

    // Now unlock it
    const protectedFile = new File([encryptedBuffer], 'protected.pdf', {
      type: 'application/pdf',
    });
    const unlockedBlob = await unlockPdf(protectedFile, 'AnTPDF_Secret_2026');
    const unlockedBuffer = await unlockedBlob.arrayBuffer();

    // Verify unlocked PDF can be parsed normally without ignoreEncryption
    const unlockedDoc = await PDFDocument.load(unlockedBuffer);
    expect(unlockedDoc.getPageCount()).toBe(2);
    expect(unlockedDoc.isEncrypted).toBe(false);
  });

  it('stamps page numbers with custom formats and positions', async () => {
    const file = await createTestPdfFile('doc.pdf', 3);
    const numberedBlob = await addPageNumbers(file, {
      position: 'bottom-right',
      format: 'page-x-of-y',
      fontSize: 10,
    });

    expect(numberedBlob).toBeInstanceOf(Blob);
    const buffer = await numberedBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPageCount()).toBe(3);
  });

  it('watermarks PDF pages diagonally with custom opacity', async () => {
    const file = await createTestPdfFile('doc.pdf', 2);
    const watermarkedBlob = await watermarkPdf(file, 'CONFIDENTIAL', {
      fontSize: 36,
      opacity: 0.3,
      rotationDegrees: 45,
    });

    expect(watermarkedBlob).toBeInstanceOf(Blob);
    const buffer = await watermarkedBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPageCount()).toBe(2);
  });

  it('flattens interactive annotations and form fields', async () => {
    const file = await createTestPdfFile('doc.pdf', 1);
    const flattenedBlob = await flattenPdf(file);

    expect(flattenedBlob).toBeInstanceOf(Blob);
    const buffer = await flattenedBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPageCount()).toBe(1);
  });

  it('converts a Word docx file to PDF in-memory', async () => {
    const wordDoc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: 'AnTPDF Word to PDF In-Memory Test' }),
            new Paragraph({ text: 'Second paragraph with “curly quotes” and dashes.' }),
          ],
        },
      ],
    });

    const docxBlob = await Packer.toBlob(wordDoc);
    const docxFile = new File([docxBlob], 'sample.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const res = await convertWordToPdf(docxFile, { pageSize: 'Letter' });
    expect(res.blob).toBeInstanceOf(Blob);
    expect(res.blob.type).toBe('application/pdf');
    expect(res.pageCount).toBeGreaterThanOrEqual(1);

    const pdfBuffer = await res.blob.arrayBuffer();
    const loadedDoc = await PDFDocument.load(pdfBuffer);
    expect(loadedDoc.getPageCount()).toBe(1);
  });

  it('converts a PDF file to editable Word docx format in-memory', async () => {
    const testPdf = await createTestPdfFile('contract.pdf', 2);
    const res = await convertPdfToWord(testPdf);

    expect(res.blob).toBeInstanceOf(Blob);
    expect(res.pageCount).toBe(2);
    expect(res.blob.size).toBeGreaterThan(1000);
  });

  it('parses ranges with spaces around hyphens and validates edge cases', () => {
    expect(parsePageRanges(' 1 - 3, 5 ', 5)).toEqual([1, 2, 3, 5]);
    expect(parsePageRanges('3', 5)).toEqual([3]);
    expect(() => parsePageRanges('', 5)).toThrowError();
    expect(() => parsePageRanges('   ', 5)).toThrowError();
  });

  it('handles empty file list gracefully in mergePdfs', async () => {
    await expect(mergePdfs([])).rejects.toThrowError('Please select at least one PDF file to merge.');
  });

  it('handles empty password rejection in protectPdf and watermark text validation', async () => {
    const testPdf = await createTestPdfFile('test.pdf', 1);
    await expect(protectPdf(testPdf, '')).rejects.toThrowError('Password cannot be empty.');
    await expect(watermarkPdf(testPdf, '')).rejects.toThrowError('Watermark text cannot be empty.');
  });

  it('handles duplicate page indices in rotatePdf without double rotating', async () => {
    const testPdf = await createTestPdfFile('rotate-test.pdf', 2);
    const rotatedBlob = await rotatePdf(testPdf, 90, [1, 1]);
    const buffer = await rotatedBlob.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPages()[0].getRotation().angle).toBe(90);
  });

  it('supports multiple positions and number-only format in addPageNumbers', async () => {
    const testPdf = await createTestPdfFile('numbered-test.pdf', 2);
    const res = await addPageNumbers(testPdf, {
      position: 'bottom-center',
      format: 'number-only',
      startFrom: 10,
    });
    expect(res).toBeInstanceOf(Blob);
    const buffer = await res.arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    expect(doc.getPageCount()).toBe(2);
  });
});
