# Contributing to AnTPDF

Thank you for your interest in contributing to **AnTPDF** — the 100% client-side in-browser PDF suite!

AnTPDF is a collaborative engineering initiative co-maintained by [@TanmayNileshShinde](https://github.com/TanmayNileshShinde) and [@Antara-Parab](https://github.com/Antara-Parab).

---

## Core Architectural Invariants

Before making code changes, please ensure the following non-negotiable principles are preserved:
- **Zero Server Uploads:** All PDF transformations, parsing, and rendering must execute strictly client-side inside the user's browser memory via WebAssembly and pdf-lib.
- **WASM & Memory Safety:** Revoke all Blob URLs (`URL.revokeObjectURL`) and free ArrayBuffers upon task completion to prevent memory leaks during large batch operations.
- **Tests First:** All new PDF transformations, compression algorithms, and utilities must include Vitest unit tests in `tests/`.
- **Zero Tracking:** No personal telemetry or document content should ever be collected or transmitted.

---

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TanmayNileshShinde/antpdf.git
   cd antpdf
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

---

## Branch Naming & Commits

- Branch conventions:
  - `feat/<feature-name>` for new capabilities
  - `fix/<bug-name>` for bug fixes
  - `docs/<doc-name>` for documentation improvements
- Commit messages follow the **Conventional Commits** standard (e.g. `feat(engine): add pdf watermarking`, `fix(worker): release blob memory`).

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment. Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.
