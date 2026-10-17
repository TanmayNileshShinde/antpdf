import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak, AlignmentType } from 'docx';

export interface WordToPdfOptions {
  pageSize?: 'A4' | 'Letter';
  margin?: number;
}

/**
 * Converts a Word .docx document into a clean PDF directly in browser memory.
 * Uses mammoth for OpenXML parsing and pdf-lib for vector page layout.
 */
export async function convertWordToPdf(
  file: File,
  options?: WordToPdfOptions
): Promise<{ blob: Blob; pageCount: number; htmlPreview: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer =
    typeof Buffer !== 'undefined'
      ? Buffer.from(arrayBuffer)
      : (arrayBuffer as unknown as Buffer);

  // Parse OpenXML document to extract HTML and structured text
  const mammothInput = { buffer: inputBuffer, arrayBuffer };
  const htmlResult = await mammoth.convertToHtml(mammothInput as unknown as mammoth.MammothOptions);
  const rawTextResult = await mammoth.extractRawText(mammothInput as unknown as mammoth.MammothOptions);

  const text = rawTextResult.value || 'Empty document';
  const htmlPreview = htmlResult.value || '';

  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const isLetter = options?.pageSize === 'Letter';
  const pageWidth = isLetter ? 612 : 595.28;
  const pageHeight = isLetter ? 792 : 841.89;
  const margin = options?.margin ?? 50;
  const contentWidth = pageWidth - margin * 2;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Title header from filename
  const cleanTitle = file.name.replace(/\.docx?$/i, '');
  page.drawText(cleanTitle, {
    x: margin,
    y,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.12),
  });
  y -= 26;

  // Horizontal divider rule
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.85),
  });
  y -= 22;

  // Split text into paragraphs
  const rawParagraphs = text.split(/\r?\n\s*\r?\n/);

  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Word wrap paragraph into lines
    const words = trimmed.split(/\s+/);
    let line = '';

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, 10.5);

      if (testWidth > contentWidth) {
        if (line) {
          page.drawText(line, {
            x: margin,
            y,
            size: 10.5,
            font: fontRegular,
            color: rgb(0.15, 0.15, 0.18),
          });
          y -= 15;

          if (y < margin + 40) {
            page = doc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
        }
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, {
        x: margin,
        y,
        size: 10.5,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.18),
      });
      y -= 22;

      if (y < margin + 40) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    }
  }

  // Stamp metadata
  doc.setProducer('AnTPDF (https://antpdf.tanmayshinde.com)');
  doc.setCreator('AnTPDF Word Transcoder Engine');

  const pdfBytes = await doc.save();
  const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  return {
    blob: pdfBlob,
    pageCount: doc.getPageCount(),
    htmlPreview,
  };
}

/**
 * Converts a PDF document into a standard Microsoft Word .docx file.
 * Reads text content per page and constructs OpenXML paragraphs.
 */
export async function convertPdfToWord(
  file: File
): Promise<{ blob: Blob; pageCount: number; extractedSnippet: string }> {
  const arrayBuffer = await file.arrayBuffer();

  // Dynamically import pdfjs to ensure browser compatibility
  const pdfjsLib = await import('pdfjs-dist/build/pdf.js');

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    disableFontFace: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const docChildren: Paragraph[] = [];
  let firstSnippet = '';

  // Document Title
  const cleanTitle = file.name.replace(/\.pdf$/i, '');
  docChildren.push(
    new Paragraph({
      text: cleanTitle,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();

    // Group items into logical lines based on vertical Y position
    const textItems = content.items as Array<{ str: string; transform: number[] }>;
    const linesMap = new Map<number, string[]>();

    for (const item of textItems) {
      if (!item.str || !item.str.trim()) continue;
      // Round Y position to cluster text on the same line
      const rawY = item.transform ? Math.round(item.transform[5] / 4) * 4 : 0;
      if (!linesMap.has(rawY)) {
        linesMap.set(rawY, []);
      }
      linesMap.get(rawY)!.push(item.str);
    }

    // Sort descending by Y (top of page first)
    const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);

    if (sortedY.length === 0) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Page ${pageNum} - Image or Non-Text Graphics]`,
              italics: true,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    } else {
      for (const y of sortedY) {
        const lineText = linesMap.get(y)!.join(' ').trim();
        if (!lineText) continue;

        if (!firstSnippet) {
          firstSnippet = lineText.slice(0, 180);
        }

        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: lineText,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    }

    // Add page break between PDF pages (except the last page)
    if (pageNum < numPages) {
      docChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }
  }

  // Create docx Document
  const wordDoc = new Document({
    creator: 'AnTPDF (https://antpdf.tanmayshinde.com)',
    title: cleanTitle,
    description: 'Converted from PDF with AnTPDF 100% In Browser Transcoder',
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const docxBlob = await Packer.toBlob(wordDoc);

  return {
    blob: docxBlob,
    pageCount: numPages,
    extractedSnippet: firstSnippet || 'Extracted document text',
  };
}
