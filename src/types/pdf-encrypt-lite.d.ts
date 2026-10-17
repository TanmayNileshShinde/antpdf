declare module '@pdfsmaller/pdf-encrypt-lite' {
  export interface EncryptOptions {
    ownerPassword?: string | null;
    userPassword?: string | null;
    permissions?: {
      printing?: 'highResolution' | 'lowResolution' | 'none';
      modifying?: boolean;
      copying?: boolean;
      annotating?: boolean;
      fillingForms?: boolean;
      contentAccessibility?: boolean;
      documentAssembly?: boolean;
    };
  }

  export function encryptPDF(
    pdfBytes: Uint8Array | ArrayBuffer,
    userPassword: string,
    ownerPasswordOrOptions?: string | EncryptOptions | null
  ): Promise<Uint8Array>;

  export class AlreadyEncryptedError extends Error {}
  export class PasswordEncodingError extends Error {}
}
