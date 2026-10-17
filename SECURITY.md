# Security Policy & Vulnerability Disclosure

**AnTPDF** (`https://antpdf.tanmayshinde.com`) is engineered around a strict **zero-knowledge, client-side only** architecture. We treat user security and privacy as our top priority.

---

## 🔒 Security Architecture Guarantees

1. **100% In-Browser Execution:** Every PDF processing algorithm (merging, splitting, rotating, flattening, signing, converting) executes in the client browser's local RAM using WebAssembly and pure TypeScript engines.
2. **Zero Server Uploads:** Document bytes are never transmitted across the network, stored on cloud disks, or logged to server telemetry.
3. **No Intermediate Caching:** When a tab or browser session is closed, all document buffers are immediately garbage collected by the browser engine.

---

## 🛡️ Supported Versions

We actively maintain and provide security updates for the current production release:

| Version | Supported |
| :--- | :--- |
| `0.1.x` (Current Main) | ✅ Active Security Support |
| `< 0.1.0` | ❌ End of Life |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or privacy concern within AnTPDF, please follow responsible disclosure:

1. **Do not disclose the vulnerability in public GitHub issues, discussions, or pull requests.**
2. Send a detailed report directly to the project maintainer:
   - **Email:** `tanmaynileshshinde@gmail.com`
   - **Subject Line:** `[SECURITY] AnTPDF Vulnerability Report`
3. Please include:
   - Description of the vulnerability and its potential impact.
   - Exact steps or proof-of-concept (PoC) to reproduce the issue.
   - Any suggested mitigations or patches.

### ⏱️ Our Response Commitment
- **Initial Acknowledgment:** Within **24 to 48 hours**.
- **Assessment & Triage:** Within **3 business days**.
- **Fix & Deployment:** Critical vulnerabilities will be patched and deployed within **7 days** of confirmation.

Thank you for helping keep AnTPDF and its users secure!
