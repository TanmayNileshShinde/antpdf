export type PageNumberPosition =
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'top-right'
  | 'top-left';

export type PageNumberFormat = 'page-x-of-y' | 'number-only' | 'page-x';

export interface PageNumberOptions {
  position?: PageNumberPosition;
  format?: PageNumberFormat;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
  margin?: number;
  startFrom?: number;
}

export interface WatermarkOptions {
  fontSize?: number;
  opacity?: number;
  rotationDegrees?: number;
  color?: { r: number; g: number; b: number };
}

export type CompressionQuality = 'low' | 'medium' | 'high';

export interface CompressOptions {
  quality?: CompressionQuality;
  removeMetadata?: boolean;
}

export interface PdfDocumentInfo {
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  isEncrypted: boolean;
  sizeBytes: number;
}
