# Contributing to AnTPDF

Thank you for contributing to AnTPDF — the 100% in-browser PDF studio.

## Core Architectural Invariants
- **Zero Server Uploads:** All PDF operations must execute strictly client-side inside the browser memory.
- **WASM & Memory Safety:** Revoke all Blob URLs and free array buffers upon task completion to prevent memory leaks.
- **Tests First:** All new PDF transformations must include Vitest unit tests in `tests/pdfEngine.test.ts`.

## Pull Request Guidelines
- Verify all unit tests pass before opening a PR (`npm test`).
- Maintain TypeScript strict typing without using `any`.
