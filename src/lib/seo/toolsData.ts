export interface ToolHowToStep {
  step: number;
  title: string;
  description: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export type ToolCategory = 'organize' | 'security' | 'optimize' | 'convert' | 'edit';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategory;
  icon: string;
  author: 'Tanmay' | 'Antara';
  badge?: string;
  isV2?: boolean;
  keywords: string[];
  howTo: ToolHowToStep[];
  faqs: ToolFaq[];
  features: string[];
  isAvailable: boolean;
}

export const BASE_URL = 'https://antpdf.tanmayshinde.com';

export const TOOLS: Record<string, ToolDefinition> = {
  'merge-pdf': {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    metaTitle: 'Merge PDF Online Free — Combine Multiple PDF Files | AnTPDF',
    metaDescription:
      'Merge multiple PDF documents into one single file directly in your browser. 100% client-side, zero server uploads, no file size limits, completely free.',
    shortDescription: 'Combine multiple PDFs into a unified document in your exact order.',
    longDescription:
      'Combine multiple PDF documents into a clean, unified file in seconds. AnTPDF processes your files entirely in-memory on your device using WebAssembly and pdf-lib — meaning your documents are never uploaded to any remote server.',
    category: 'organize',
    icon: 'Layers',
    author: 'Tanmay',
    badge: 'Most Popular',
    keywords: [
      'merge pdf',
      'combine pdf online',
      'merge pdf files free',
      'join pdf documents',
      'in-browser pdf merger',
      'zero upload pdf merge',
    ],
    howTo: [
      {
        step: 1,
        title: 'Select or Drop PDF Files',
        description:
          'Drag and drop your PDF documents into the upload zone or click to select them from your computer.',
      },
      {
        step: 2,
        title: 'Arrange Order & Verify',
        description:
          'Review the list of uploaded PDFs. Rearrange them if needed into the desired merge sequence.',
      },
      {
        step: 3,
        title: 'Merge & Instant Download',
        description:
          'Click "Merge PDF Now" to generate the unified file in milliseconds and save it directly to your storage.',
      },
    ],
    faqs: [
      {
        question: 'Are my files uploaded to any server when merging?',
        answer:
          'No! Unlike iLovePDF or Smallpdf, AnTPDF executes 100% of the PDF merging process locally in your browser memory using WebAssembly. Your files never leave your computer or touch a cloud server.',
      },
      {
        question: 'Is there any file size or document limit?',
        answer:
          'There are zero artificial file size limits or daily quotas on AnTPDF. Because processing occurs on your device, you can merge as many pages or large files as your browser memory permits.',
      },
      {
        question: 'Will the original quality or hyperlinks be preserved?',
        answer:
          'Yes. Vector graphics, fonts, embedded annotations, and internal links remain pristine with zero compression degradation.',
      },
    ],
    features: [
      '100% Client-Side In-Browser Processing',
      'Zero Server Uploads & Strict Zero-Knowledge Privacy',
      'No File Size Caps or Daily Usage Limits',
      'Maintains Original Formatting & Vector Fidelity',
    ],
    isAvailable: true,
  },

  'split-pdf': {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    metaTitle: 'Split PDF Online Free — Extract Pages & Ranges | AnTPDF',
    metaDescription:
      'Extract specific pages or page ranges from any PDF document for free. 100% client-side privacy, blazing fast WebAssembly processing, zero server uploads.',
    shortDescription: 'Extract specific pages or ranges (e.g. 1-3, 5, 8) into a fresh PDF.',
    longDescription:
      'Isolate precisely the pages you need from any PDF file. Input custom page numbers or ranges (e.g. 1-4, 7, 9-12) to generate a lightweight, targeted PDF file in milliseconds.',
    category: 'organize',
    icon: 'Scissors',
    author: 'Tanmay',
    badge: 'Essential',
    keywords: [
      'split pdf',
      'extract pages from pdf',
      'split pdf online free',
      'separate pdf pages',
      'cut pdf pages',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload Your PDF File',
        description:
          'Drop your PDF into the secure container. Your file is parsed locally in-memory.',
      },
      {
        step: 2,
        title: 'Specify Pages or Ranges',
        description:
          'Enter comma-separated page numbers or ranges, such as "1-3, 5, 8-10".',
      },
      {
        step: 3,
        title: 'Extract & Save',
        description:
          'Click "Split PDF Now" to immediately extract the selected pages into a new standalone document.',
      },
    ],
    faqs: [
      {
        question: 'How do I specify multiple page ranges?',
        answer:
          'You can type comma-separated values like "1-3, 5, 8-12". AnTPDF extracts exactly those pages in sequential order.',
      },
      {
        question: 'Does splitting affect the resolution of images in the PDF?',
        answer:
          'No. AnTPDF performs lossless extraction of the original PDF stream objects, preserving exact DPI and vector quality.',
      },
      {
        question: 'Can I split password-protected PDFs?',
        answer:
          'If the PDF is encrypted, first use our Unlock PDF tool to decrypt it, then split the resulting document.',
      },
    ],
    features: [
      'Flexible syntax: single pages, continuous ranges, or combinations',
      'Lossless stream extraction without re-rendering artifacts',
      'Zero latency client-side execution',
      'Completely free with zero watermarks',
    ],
    isAvailable: true,
  },

  'compress-pdf': {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    metaTitle: 'Compress PDF Online Free — Reduce File Size Privately | AnTPDF',
    metaDescription:
      'Reduce PDF file size in your browser without sacrificing legibility. 100% private, no server upload, zero cost, no file size limitations.',
    shortDescription: 'Optimize and reduce PDF file size while maintaining clarity.',
    longDescription:
      'Shrink bulky PDF files for easy email attachments and web distribution. AnTPDF optimizes object cross-reference tables, strips bloated structural metadata, and cleans redundant dictionary streams entirely in your browser.',
    category: 'optimize',
    icon: 'Minimize2',
    author: 'Tanmay',
    badge: 'High Impact',
    keywords: [
      'compress pdf',
      'reduce pdf file size',
      'shrink pdf online free',
      'pdf optimizer in-browser',
      'compress pdf without losing quality',
    ],
    howTo: [
      {
        step: 1,
        title: 'Choose PDF to Compress',
        description:
          'Select your heavy PDF document. It will be loaded into browser memory.',
      },
      {
        step: 2,
        title: 'Choose Compression Profile',
        description:
          'Pick between High, Medium, or Low compression depending on your desired balance.',
      },
      {
        step: 3,
        title: 'Compress & Download',
        description:
          'Download your optimized PDF with detailed file size comparison statistics.',
      },
    ],
    faqs: [
      {
        question: 'How does AnTPDF compress files without a server?',
        answer:
          'AnTPDF utilizes pdf-lib with Flate object streams and dictionary compaction directly within browser WebAssembly, stripping obsolete revision trees and metadata.',
      },
      {
        question: 'Will text remain sharp and readable?',
        answer:
          'Yes! Text vectors and standard typography are never rasterized into blurry pixels.',
      },
      {
        question: 'Is there a limit on how large a PDF I can compress?',
        answer:
          'No arbitrary limits! You can compress files of 50MB, 100MB+, provided your computer has available RAM.',
      },
    ],
    features: [
      'Modern Flate object stream compression',
      'Strips bloated revision history and tracking tags',
      'Real-time before/after size reduction metrics',
      'No watermark and no subscription required',
    ],
    isAvailable: true,
  },

  'protect-pdf': {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    name: 'Protect PDF',
    metaTitle: 'Password Protect PDF Online — Encrypt PDF Free | AnTPDF',
    metaDescription:
      'Add secure 128-bit password encryption to sensitive PDF documents in your browser. Zero-knowledge privacy: your password and files never touch a server.',
    shortDescription: 'Lock and encrypt your PDF with strong 128-bit password protection.',
    longDescription:
      'Encrypt your private PDF documents with standard RC4 128-bit encryption. Perfect for contracts, bank statements, legal forms, and confidential research.',
    category: 'security',
    icon: 'Lock',
    author: 'Tanmay',
    badge: 'Security',
    keywords: [
      'password protect pdf',
      'encrypt pdf online',
      'lock pdf file',
      'secure pdf document',
      'pdf encryption free',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload Confidential PDF',
        description:
          'Select your document. It stays strictly protected inside your local browser.',
      },
      {
        step: 2,
        title: 'Set Strong Password',
        description:
          'Enter a user password required to view and open the document.',
      },
      {
        step: 3,
        title: 'Encrypt & Download',
        description:
          'Click "Encrypt PDF Now" to generate an industry-standard password-protected file.',
      },
    ],
    faqs: [
      {
        question: 'Does AnTPDF or anyone else know my password?',
        answer:
          'Impossible. The encryption cipher is executed strictly inside your local browser runtime. AnTPDF has no database, no backend server, and zero tracking.',
      },
      {
        question: 'What encryption algorithm is used?',
        answer:
          'Standard PDF revision 3 128-bit encryption compatible with Adobe Acrobat, Apple Preview, Google Chrome, and all PDF viewers.',
      },
      {
        question: 'What if I forget my password?',
        answer:
          'Because AnTPDF uses true cryptographic protection and zero server storage, forgotten passwords cannot be recovered.',
      },
    ],
    features: [
      'Standard 128-bit cryptographic encryption',
      'Compatible with Adobe Reader, Preview, Chrome, Safari',
      'Zero-knowledge architecture: password stays on your device',
      'Fast sub-second client-side cipher generation',
    ],
    isAvailable: true,
  },

  'unlock-pdf': {
    id: 'unlock-pdf',
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    metaTitle: 'Unlock PDF Online Free — Remove Password Protection | AnTPDF',
    metaDescription:
      'Remove password protection and permission restrictions from PDF files directly in your browser. Free, fast, and 100% client-side.',
    shortDescription: 'Strip password locks and restrictions from your authorized PDF files.',
    longDescription:
      'Remove security restrictions and passwords from PDF documents you own. Export an open, unencrypted copy for effortless sharing, editing, and printing.',
    category: 'security',
    icon: 'Unlock',
    author: 'Tanmay',
    badge: 'Privacy First',
    keywords: [
      'unlock pdf',
      'remove password from pdf',
      'decrypt pdf online',
      'remove pdf restrictions',
      'pdf password remover',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload Locked PDF',
        description:
          'Select the encrypted PDF document from your local storage.',
      },
      {
        step: 2,
        title: 'Provide Password (If Required)',
        description:
          'Enter the password to decrypt the internal security dictionary.',
      },
      {
        step: 3,
        title: 'Unlock & Save',
        description:
          'Click "Unlock PDF" to export an unrestricted, unlocked version immediately.',
      },
    ],
    faqs: [
      {
        question: 'Can AnTPDF unlock any PDF without knowing the password?',
        answer:
          'Standard permission restrictions (such as printing or editing locks) can be removed instantly. For owner/user encrypted files, providing the correct key allows permanent decryption.',
      },
      {
        question: 'Is it legal to unlock a PDF?',
        answer:
          'Yes, provided you are the rightful owner or have authorized permission to access and modify the document.',
      },
      {
        question: 'Are my decrypted files safe?',
        answer:
          '100%. The decryption happens in your local device RAM. No file copy is sent across the internet.',
      },
    ],
    features: [
      'Instant removal of printing and copying restrictions',
      'Exports clean unencrypted PDF documents',
      'Zero server roundtrip — instantaneous execution',
      'Full privacy guarantee',
    ],
    isAvailable: true,
  },

  'rotate-pdf': {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    metaTitle: 'Rotate PDF Pages Permanently Online — 90°, 180°, 270° | AnTPDF',
    metaDescription:
      'Permanently fix upside-down or sideways PDF pages online for free. Rotate 90, 180, or 270 degrees in-browser with zero quality loss.',
    shortDescription: 'Permanently rotate upside-down or sideways pages by 90°, 180°, or 270°.',
    longDescription:
      'Fix scanned documents with incorrect orientation permanently. Rotate all pages or specific pages by 90 degrees clockwise, counter-clockwise, or 180 degrees with permanent metadata persistence.',
    category: 'organize',
    icon: 'RotateCw',
    author: 'Tanmay',
    badge: 'Instant Fix',
    keywords: [
      'rotate pdf',
      'rotate pdf pages permanently',
      'turn pdf upside down',
      'fix pdf orientation online',
      'rotate pdf 90 degrees',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload Scanned or Sideways PDF',
        description:
          'Drop your PDF into the tool. It will be loaded immediately.',
      },
      {
        step: 2,
        title: 'Select Rotation Angle & Pages',
        description:
          'Choose 90° Right, 180°, or 90° Left. Select all pages or custom page numbers.',
      },
      {
        step: 3,
        title: 'Rotate & Download',
        description:
          'Click "Rotate PDF" to permanently save the adjusted orientation to disk.',
      },
    ],
    faqs: [
      {
        question: 'Is this rotation permanent?',
        answer:
          'Yes. Unlike temporary viewer toggles in browser tabs, AnTPDF writes the rotation angle directly into the PDF page dictionary so it opens correctly everywhere.',
      },
      {
        question: 'Can I rotate only odd or specific pages?',
        answer:
          'Yes, you can target specific pages (e.g. 1, 3, 5) or apply the rotation to the entire document.',
      },
      {
        question: 'Does rotating degrade scanned images?',
        answer:
          'Zero degradation. AnTPDF only changes the vector orientation matrix without re-compressing raster images.',
      },
    ],
    features: [
      'Permanent orientation metadata update',
      '90° Clockwise, 180°, and 90° Counter-Clockwise options',
      'All pages or selective page targeting',
      'Zero quality loss guaranteed',
    ],
    isAvailable: true,
  },

  'add-page-numbers': {
    id: 'add-page-numbers',
    slug: 'add-page-numbers',
    name: 'Add Page Numbers',
    metaTitle: 'Add Page Numbers to PDF Online Free — Number PDF Pages | AnTPDF',
    metaDescription:
      'Stamp clean page numbers onto your PDF documents in seconds. Custom positions, fonts, numbering formats ("Page X of Y"), and starting numbers.',
    shortDescription: 'Add page numbers with custom positions, styling, and formatting.',
    longDescription:
      'Number multi-page PDFs professionally for reports, theses, proposals, and contracts. Choose exact positioning (bottom-right, bottom-center, header), starting index, and formatting style.',
    category: 'edit',
    icon: 'Hash',
    author: 'Tanmay',
    badge: 'Pro Formatting',
    keywords: [
      'add page numbers to pdf',
      'number pdf pages online',
      'pdf page numbering free',
      'bates numbering alternative',
      'insert page numbers pdf',
    ],
    howTo: [
      {
        step: 1,
        title: 'Select Your Document',
        description:
          'Upload your PDF into the in-browser numbering studio.',
      },
      {
        step: 2,
        title: 'Configure Layout & Typography',
        description:
          'Choose position (e.g. bottom-right), format ("Page 1 of 10" or "1"), font size, and starting number.',
      },
      {
        step: 3,
        title: 'Stamp & Download',
        description:
          'Click "Add Page Numbers" to render the typography across all pages instantly.',
      },
    ],
    faqs: [
      {
        question: 'Can I start numbering from a specific number (e.g. page 5)?',
        answer:
          'Yes! You can configure the "Start From" field so your document integrates into existing books or dossiers.',
      },
      {
        question: 'Which positions are supported?',
        answer:
          'Bottom-Center, Bottom-Right, Bottom-Left, Top-Right, Top-Center, and Top-Left.',
      },
      {
        question: 'Will page numbers overlap existing text?',
        answer:
          'You can adjust the margin parameter to place numbers precisely in the white space of your margins.',
      },
    ],
    features: [
      '6 versatile alignment positions',
      '3 format templates: "Page X of Y", "Page X", or simple digit',
      'Custom starting page offset for chapter stitching',
      'Clean Helvetica typography embedded losslessly',
    ],
    isAvailable: true,
  },

  'watermark-pdf': {
    id: 'watermark-pdf',
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    metaTitle: 'Add Watermark to PDF Online Free — Text Watermark Tool | AnTPDF',
    metaDescription:
      'Protect your PDF files with diagonal text watermarks ("CONFIDENTIAL", "DRAFT", "COPY"). Customize opacity, angle, and size with 100% client-side privacy.',
    shortDescription: 'Stamp diagonal text watermarks (e.g. DRAFT, CONFIDENTIAL) with opacity.',
    longDescription:
      'Brand and protect your intellectual property with customizable text watermarks. Stamp "CONFIDENTIAL", "DRAFT", "DO NOT DISTRIBUTE", or custom company marks diagonally across all pages.',
    category: 'edit',
    icon: 'Stamp',
    author: 'Tanmay',
    badge: 'Copyright Protection',
    isV2: true,
    keywords: [
      'watermark pdf',
      'add watermark to pdf online',
      'stamp confidential on pdf',
      'pdf watermark generator free',
      'protect pdf copyright',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload PDF Document',
        description:
          'Drop your PDF into the tool. Processing remains completely local.',
      },
      {
        step: 2,
        title: 'Customize Watermark Text',
        description:
          'Type your watermark text, adjust transparency/opacity, font size, and rotation angle.',
      },
      {
        step: 3,
        title: 'Apply & Save',
        description:
          'Click "Watermark PDF" to stamp all pages and download the watermarked file.',
      },
    ],
    faqs: [
      {
        question: 'Can the watermark be easily deleted by recipients?',
        answer:
          'The watermark is embedded directly into the PDF content stream. When paired with our Flatten PDF tool, it becomes permanently fused into the page graphics.',
      },
      {
        question: 'Can I control the transparency so text behind it remains readable?',
        answer:
          'Yes! Use our opacity slider (from 10% subtle to 80% bold) to ensure the underlying document remains completely legible.',
      },
      {
        question: 'What angles are available?',
        answer:
          '45° diagonal is standard, or you can specify 0° (horizontal) or 90° (vertical).',
      },
    ],
    features: [
      'Customizable text, opacity (0.1 to 1.0), and rotation angle',
      'Centered geometric projection across varied page sizes',
      'Fast client-side vector text embedding',
      'Zero server upload guarantee',
    ],
    isAvailable: true,
  },

  'flatten-pdf': {
    id: 'flatten-pdf',
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    metaTitle: 'Flatten PDF Form Fields Online Free — Lock Annotations | AnTPDF',
    metaDescription:
      'Flatten interactive AcroForms, form fields, and annotations into static PDF pages. Prevent accidental editing and ensure uniform printing across devices.',
    shortDescription: 'Lock and flatten form fields and annotations into static pages.',
    longDescription:
      'Turn interactive PDF forms, text inputs, checkboxes, and digital annotations into non-editable static content. Essential before submitting official contracts, court filings, or government documents.',
    category: 'edit',
    icon: 'FileCheck',
    author: 'Tanmay',
    badge: 'Form Locking',
    isV2: true,
    keywords: [
      'flatten pdf',
      'flatten pdf form fields',
      'lock pdf forms',
      'convert pdf form to flat',
      'prevent editing pdf form',
    ],
    howTo: [
      {
        step: 1,
        title: 'Upload Interactive Form',
        description:
          'Drop your filled PDF form or annotated document into the dropzone.',
      },
      {
        step: 2,
        title: 'Verify Form Integrity',
        description:
          'AnTPDF inspects the document AcroForm dictionary in memory.',
      },
      {
        step: 3,
        title: 'Flatten & Download',
        description:
          'Click "Flatten PDF" to bake form values into permanent static visual content.',
      },
    ],
    faqs: [
      {
        question: 'What is the purpose of flattening a PDF?',
        answer:
          'Flattening converts interactive form fields into static text and graphics so recipients cannot accidentally change submitted answers or suffer from missing font glitches.',
      },
      {
        question: 'Will filled-in text remain visible?',
        answer:
          'Yes! Every typed field, checked checkbox, and annotation is permanently burned into the page exactly as rendered.',
      },
      {
        question: 'Can a flattened PDF be unflattened?',
        answer:
          'No. Flattening is a one-way security operation that removes the interactive form fields permanently.',
      },
    ],
    features: [
      'Permanently locks AcroForm fields and text boxes',
      'Ensures uniform rendering across mobile and print viewers',
      'Crucial for legal filings and financial disclosures',
      'Instantaneous client-side processing',
    ],
    isAvailable: true,
  },

  // Interactive Canvas Studio Tools with full pSEO metadata:
  'organize-pdf': {
    id: 'organize-pdf',
    slug: 'organize-pdf',
    name: 'Reorder Pages',
    metaTitle: 'Reorder PDF Pages Online Free — Visual Drag and Drop | AnTPDF',
    metaDescription:
      'Reorder, sort, and arrange PDF pages visually with interactive drag and drop. 100% client-side privacy, free with zero server uploads.',
    shortDescription: 'Drag-and-drop visual page sorter to reorder document pages easily.',
    longDescription:
      'Visually reorganize multi-page PDF documents. Drag and drop page thumbnails to rearrange order, delete unwanted pages, or rotate individual sheets.',
    category: 'organize',
    icon: 'Grid',
    author: 'Antara',
    badge: 'Visual Grid',
    isV2: true,
    keywords: ['organize pdf', 'reorder pdf pages', 'rearrange pdf pages visually', 'sort pdf pages'],
    howTo: [
      { step: 1, title: 'Upload Document', description: 'Load your multi-page PDF to render visual thumbnails.' },
      { step: 2, title: 'Drag and Reorder', description: 'Drag page cards into your preferred sequence.' },
      { step: 3, title: 'Export PDF', description: 'Download the newly organized PDF instantly.' },
    ],
    faqs: [
      {
        question: 'How does the visual organizer work?',
        answer: 'Thumbnails are rendered directly in browser canvas via pdfjs-dist without server uploads.',
      },
    ],
    features: ['Interactive visual drag-and-drop', 'Real-time thumbnail preview', '100% In-Browser'],
    isAvailable: false,
  },

  'remove-pages': {
    id: 'remove-pages',
    slug: 'remove-pages',
    name: 'Remove Pages',
    metaTitle: 'Remove Pages from PDF Online Free — Visual Page Deleter | AnTPDF',
    metaDescription:
      'Delete unwanted pages from PDF files with a single click. Interactive thumbnail preview, 100% private in-browser tool.',
    shortDescription: 'Click-to-delete visual page remover for effortless document cleanup.',
    longDescription:
      'Remove blank sheets, outdated sections, or unnecessary appendices from any PDF file with an intuitive visual thumbnail gallery.',
    category: 'organize',
    icon: 'Trash2',
    author: 'Antara',
    badge: 'Interactive',
    isV2: true,
    keywords: ['remove pages from pdf', 'delete pdf pages', 'cut pages from pdf', 'pdf page deleter'],
    howTo: [
      { step: 1, title: 'Upload File', description: 'Inspect all pages as interactive visual cards.' },
      { step: 2, title: 'Click Pages to Remove', description: 'Click the trash icon on any page to mark for deletion.' },
      { step: 3, title: 'Download Clean PDF', description: 'Export the sanitized document with pages removed.' },
    ],
    faqs: [
      {
        question: 'Can I undo deleted pages before downloading?',
        answer: 'Yes! You can toggle pages on and off interactively before finalizing your export.',
      },
    ],
    features: ['Visual thumbnail selector', 'One-click deletion', 'Safe local processing'],
    isAvailable: false,
  },

  'pdf-to-jpg': {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    metaTitle: 'PDF to JPG Converter Online Free — High Resolution Images | AnTPDF',
    metaDescription:
      'Convert PDF pages into high-resolution JPG images directly in your browser. 100% client-side privacy, free with zero server uploads.',
    shortDescription: 'Extract high-resolution JPG images from every page of your PDF.',
    longDescription:
      'Transform document pages into crisp, high-resolution JPG image files. Extract single pages or batch download a ZIP archive containing all pages.',
    category: 'convert',
    icon: 'Image',
    author: 'Antara',
    keywords: ['pdf to jpg', 'convert pdf to image', 'save pdf as jpg', 'pdf to picture'],
    howTo: [
      { step: 1, title: 'Upload PDF', description: 'Select the PDF file you wish to convert to JPG.' },
      { step: 2, title: 'Choose Resolution DPI', description: 'Select 150 DPI or 300 DPI high-definition rendering.' },
      { step: 3, title: 'Download Images', description: 'Save individual JPGs or a single zipped archive.' },
    ],
    faqs: [
      {
        question: 'What DPI resolution is supported?',
        answer: 'Standard 150 DPI for web sharing and Ultra 300 DPI for print reproduction.',
      },
    ],
    features: ['High-DPI rendering', 'Batch ZIP packaging', 'Zero server uploads'],
    isAvailable: true,
  },

  'pdf-to-png': {
    id: 'pdf-to-png',
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    metaTitle: 'PDF to PNG Converter Online Free — Transparent & Lossless | AnTPDF',
    metaDescription:
      'Extract PDF pages to lossless transparent PNG images in your browser. Free, unlimited, and 100% private.',
    shortDescription: 'Export lossless PNG pictures from PDF pages with crystal clarity.',
    longDescription:
      'Extract razor-sharp PNG graphics and pages from PDF documents. Ideal for presentations, web design, and digital portfolios.',
    category: 'convert',
    icon: 'FileImage',
    author: 'Antara',
    keywords: ['pdf to png', 'convert pdf to png', 'extract png from pdf', 'lossless pdf to image'],
    howTo: [
      { step: 1, title: 'Upload PDF', description: 'Select your PDF document for image extraction.' },
      { step: 2, title: 'Render Pages', description: 'In-browser canvas renders transparent, lossless pixels.' },
      { step: 3, title: 'Download PNGs', description: 'Save high-definition PNG files directly.' },
    ],
    faqs: [
      {
        question: 'Why choose PNG over JPG?',
        answer: 'PNG provides lossless compression and supports transparent backgrounds.',
      },
    ],
    features: ['Lossless rendering', 'Preserves vector sharpness', 'Client-side canvas'],
    isAvailable: true,
  },

  'jpg-to-pdf': {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    metaTitle: 'JPG to PDF Converter Online Free — Images to Document | AnTPDF',
    metaDescription:
      'Convert JPG and PNG photos into a beautiful PDF document in seconds. 100% client-side privacy, free with no file size limits.',
    shortDescription: 'Combine multiple JPG/PNG images into a single professional PDF.',
    longDescription:
      'Turn photo albums, receipts, whiteboard captures, and sketches into a clean, paginated PDF file in your browser.',
    category: 'convert',
    icon: 'Images',
    author: 'Antara',
    keywords: ['jpg to pdf', 'images to pdf', 'photo to pdf', 'convert pictures to pdf'],
    howTo: [
      { step: 1, title: 'Select Photos', description: 'Drop multiple JPG or PNG images into the dropzone.' },
      { step: 2, title: 'Adjust Page Size', description: 'Choose between A4, US Letter, or Fit to Image.' },
      { step: 3, title: 'Generate PDF', description: 'Download your compiled PDF document instantly.' },
    ],
    faqs: [
      {
        question: 'Can I reorder pictures before generating the PDF?',
        answer: 'Yes, drag image cards into your intended reading sequence.',
      },
    ],
    features: ['Multiple photo stitching', 'Auto orientation fit', '100% local processing'],
    isAvailable: true,
  },

  'word-to-pdf': {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    metaTitle: 'Word to PDF Converter Online Free — Convert DOCX to PDF | AnTPDF',
    metaDescription:
      'Convert Word .docx documents to PDF format directly in your browser. Fast, free, and zero server uploads.',
    shortDescription: 'Convert Microsoft Word (.docx) files into clean, shareable PDFs.',
    longDescription:
      'Convert Microsoft Word .docx files into universally readable PDF documents without requiring Microsoft Office or uploading to external servers.',
    category: 'convert',
    icon: 'FileText',
    author: 'Tanmay',
    keywords: ['word to pdf', 'docx to pdf', 'convert word to pdf online free', 'doc to pdf'],
    howTo: [
      { step: 1, title: 'Upload DOCX Document', description: 'Select your Word file.' },
      { step: 2, title: 'Client-Side Transcoding', description: 'Transcoded directly inside browser memory.' },
      { step: 3, title: 'Download PDF', description: 'Save the converted PDF document.' },
    ],
    faqs: [
      {
        question: 'Is Microsoft Office required?',
        answer: 'No, AnTPDF uses in-browser OpenXML and vector layout engines.',
      },
    ],
    features: ['DOCX parsing', 'Zero cloud upload', 'Free and unlimited'],
    isAvailable: true,
  },

  'pdf-to-word': {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    metaTitle: 'PDF to Word Converter Online Free — Convert PDF to DOCX | AnTPDF',
    metaDescription:
      'Convert PDF documents to editable Microsoft Word .docx files in your browser. Free, secure, zero server uploads.',
    shortDescription: 'Convert PDF files into editable Microsoft Word (.docx) documents.',
    longDescription:
      'Extract text, formatting, and layout from PDF files into fully editable Microsoft Word .docx files.',
    category: 'convert',
    icon: 'FileOutput',
    author: 'Tanmay',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to word editable free', 'pdf to doc'],
    howTo: [
      { step: 1, title: 'Upload PDF', description: 'Select the PDF you need to edit.' },
      { step: 2, title: 'Text & Layout Extraction', description: 'Extracts paragraphs and typography.' },
      { step: 3, title: 'Download Word File', description: 'Save your editable .docx file.' },
    ],
    faqs: [
      {
        question: 'Can I edit the output file in Microsoft Word or Google Docs?',
        answer: 'Yes! The exported file is standard OpenXML .docx format.',
      },
    ],
    features: ['Extracts editable paragraphs', 'Preserves text flow', '100% private'],
    isAvailable: true,
  },

  'sign-pdf': {
    id: 'sign-pdf',
    slug: 'sign-pdf',
    name: 'Sign PDF',
    metaTitle: 'Sign PDF Online Free — Digital Signature Canvas | AnTPDF',
    metaDescription:
      'Draw, create, and stamp your digital signature onto PDF documents directly in your browser. 100% private, free, and legally ready.',
    shortDescription: 'Draw or upload your digital signature to stamp documents quickly.',
    longDescription:
      'Sign contracts, tax forms, NDAs, and agreements without printing or scanning. Draw your handwritten signature on an interactive smoothing canvas pad or upload a signature image.',
    category: 'edit',
    icon: 'PenTool',
    author: 'Antara',
    badge: 'Digital Signature',
    isV2: true,
    keywords: ['sign pdf online', 'digital signature pdf', 'draw signature on pdf', 'electronic signature free'],
    howTo: [
      { step: 1, title: 'Upload PDF Document', description: 'Load the document requiring signature.' },
      { step: 2, title: 'Draw or Upload Signature', description: 'Use touch, mouse, or stylus on the signature pad.' },
      { step: 3, title: 'Place & Sign', description: 'Position signature on the desired page and download.' },
    ],
    faqs: [
      {
        question: 'Is my handwritten signature kept private?',
        answer: 'Yes! Your signature never leaves your local device memory.',
      },
    ],
    features: ['Vector canvas smoothing', 'Touch & stylus support', 'Zero server storage'],
    isAvailable: false,
  },
};

export const ALL_TOOLS_LIST = Object.values(TOOLS);
export const TANMAY_TOOLS_LIST = ALL_TOOLS_LIST.filter((t) => t.author === 'Tanmay');
export const ANTARA_TOOLS_LIST = ALL_TOOLS_LIST.filter((t) => t.author === 'Antara');
