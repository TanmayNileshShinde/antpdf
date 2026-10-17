declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }

  export interface MammothOptions {
    arrayBuffer?: ArrayBuffer;
    buffer?: Buffer;
    path?: string;
  }

  export function convertToHtml(options: MammothOptions): Promise<MammothResult>;
  export function extractRawText(options: MammothOptions): Promise<MammothResult>;
}

declare module 'pdfjs-dist/legacy/build/pdf.js' {
  export * from 'pdfjs-dist';
}

declare module 'pdfjs-dist/build/pdf.js' {
  export * from 'pdfjs-dist';
}

