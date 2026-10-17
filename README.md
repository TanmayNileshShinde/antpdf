# AnTPDF — 100% In-Browser PDF Studio with Programmatic SEO

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](https://antpdf.tanmayshinde.com/terms)
[![Privacy: Zero Server Uploads](https://img.shields.io/badge/Privacy-100%25%20In--Browser-emerald)](https://antpdf.tanmayshinde.com/privacy)
[![Tests: Vitest](https://img.shields.io/badge/Tests-18%2F18%20Passing-success)](https://vitest.dev/)

> **Live Website:** [https://antpdf.tanmayshinde.com](https://antpdf.tanmayshinde.com)  
> **Authors:** Tanmay Nilesh Shinde & Antara Parab

---

## 🌟 Philosophy & Mission

Unlike legacy services like **iLovePDF** and **Smallpdf** which upload sensitive files to remote cloud servers and restrict users behind daily paywalls and 15MB file caps:

- **100% Client-Side In-Browser:** Every operation executes locally in browser RAM using WebAssembly and `pdf-lib`.
- **Zero Server Uploads:** Check your browser DevTools Network tab — **0 bytes** of document data ever leave your machine.
- **Zero Paywalls & Zero Size Caps:** No "2 tasks per day" limits. Merge or compress 100MB+ documents with zero restrictions.
- **Sub-Second Speed:** Instant local processing without upload delays or queue latency.

---

## 🧱 Collaborative Architecture

AnTPDF is built as an independent private studio co-authored exclusively by Tanmay Nilesh Shinde and Antara Parab:

```
antpdf/
├── src/
│   ├── app/                      # Next.js App Router statically generated routes
│   │   ├── merge-pdf/            # pSEO tool route (SSG)
│   │   ├── split-pdf/
│   │   ├── compress-pdf/
│   │   ├── protect-pdf/
│   │   ├── unlock-pdf/
│   │   ├── rotate-pdf/
│   │   ├── add-page-numbers/
│   │   ├── watermark-pdf/
│   │   ├── flatten-pdf/
│   │   ├── word-to-pdf/          # Client-side docx transcoder
│   │   ├── pdf-to-word/          # Client-side docx generator
│   │   ├── organize-pdf/         # Visual canvas studio
│   │   ├── remove-pages/         # Interactive page remover
│   │   ├── pdf-to-jpg/           # High-DPI image rasterizer
│   │   ├── pdf-to-png/           # Lossless image rasterizer
│   │   ├── jpg-to-pdf/           # Multi-image compiler
│   │   ├── sign-pdf/             # Digital signature pad
│   │   ├── sitemap.ts            # Dynamic sitemap indexing all routes
│   │   └── robots.ts             # Directives for search engine crawlers
│   ├── components/
│   │   ├── common/               # Navbar, Footer, BentoGrid, Dropzone, ThemeToggle, ToolLayout
│   │   └── tools/                # Interactive tool widgets (Merge, Split, Protect, Transcoders, etc.)
│   ├── lib/
│   │   ├── pdf/                  # Pure client-side PDF Engine (typed algorithms & transcoders)
│   │   └── seo/                  # Programmatic SEO metadata & Schema.org JSON-LD
│   └── types/                    # TypeScript ambient definitions
└── tests/
    └── pdfEngine.test.ts         # Vitest unit test suite (12/12 passing)
```

### 🎯 Feature Capabilities:

#### 1. Core WASM Engine & Transcoders:
- **Client-Side PDF Engine (`src/lib/pdf/`):**
  - `mergePdfs(files: File[])` — Memory-efficient multi-document merge.
  - `splitPdf(file: File, ranges: string)` — Arbitrary page & range extraction.
  - `rotatePdf(file: File, degrees: number, pages?: number[])` — Permanent 90°/180°/270° orientation matrix fix.
  - `compressPdf(file: File, quality: 'low' | 'medium' | 'high')` — Flate object stream compaction.
  - `protectPdf(file: File, userPass: string, ownerPass?: string)` — Standard RC4 128-bit encryption cipher.
  - `unlockPdf(file: File, password: string)` — Decrypts and removes password/permission dictionary.
  - `addPageNumbers(file: File, options: PageNumberOptions)` — Custom position, format ("Page X of Y"), and fonts.
  - `watermarkPdf(file: File, text: string, options: WatermarkOptions)` — Diagonal semi-transparent text watermark.
  - `flattenPdf(file: File)` — Flattens interactive AcroForm fields into static graphics.
  - `convertWordToPdf(file: File)` — Client-side Word docx to PDF conversion.
  - `convertPdfToWord(file: File)` — Client-side PDF to editable Word docx extraction.
- **Programmatic SEO (pSEO) & Google Ranking Engine:**
  - Automated dynamic metadata generator for 100/100 Google Lighthouse SEO.
  - Rich Snippets: `WebApplication`, `HowTo` (3-step guides), and `FAQPage` Schema.org JSON-LD on every tool page.
  - Automated `sitemap.xml` with priority weighting and `robots.txt` directives.
- **Modern Dark/Light Bento UI:**
  - Glassmorphic design with Tailwind CSS v4, Lucide React, and subtle micro-interactions.
  - Real-time instant search bar and category filter tabs.

#### 2. Visual Canvas Studio:
- `/organize-pdf` — Reorder Pages interactive visual drag-and-drop page thumbnail sorter.
- `/remove-pages` — Click-to-delete visual page remover gallery.
- `/pdf-to-jpg` & `/pdf-to-png` — High-DPI canvas page rasterizer.
- `/jpg-to-pdf` — Multi-image to PDF converter.
- `/sign-pdf` — Digital signature drawing canvas pad with vector stroke smoothing.

---

## 🚀 Getting Started

### Prerequisites:
- Node.js 20+ (recommended Node.js 24)
- npm 10+

### Installation:
```bash
# Clone the repository
git clone https://github.com/TanmayNileshShinde/antpdf.git
cd antpdf

# Install dependencies
npm install --legacy-peer-deps
```

### Running Locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Vitest Unit Tests:
```bash
npm run test
```

### Building for Production:
```bash
npm run build
```

---

## 🛡️ License & Intellectual Property
Proprietary Software Studio &copy; 2026 Tanmay Nilesh Shinde & Antara Parab. All rights reserved. Not open source.
