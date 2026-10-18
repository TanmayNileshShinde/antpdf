# System Architecture — AnTPDF Studio

This document details the client-side WebAssembly execution engine, PDF-Lib pipeline, docx transcoders, and programmatic SEO routing architecture.

## Architecture Overview

```text
[ User Browser RAM ]
        |
        +---> [ Programmatic SEO Next.js SSG Routes ] (/merge-pdf, /split-pdf, etc.)
        |
        +---> [ Client Engine Core (lib/pdf/) ]
                   |
                   +--- [ WebAssembly PDF-Lib Engine ] (Merge, Split, Protect, Rotate)
                   |
                   +--- [ Mammoth & Docx Transcoders ] (Word-to-PDF / PDF-to-Word)
                   |
                   +--- [ PDF.js Canvas Rasterizer ] (High-DPI PDF to PNG/JPG)
```

### Privacy & Memory Guarantees
1. **Zero Remote Requests:** 0 bytes of document payloads are ever dispatched over HTTP.
2. **Buffer Lifecycle:** Typed arrays and WebAssembly memories are explicitly reclaimed after downloads.
