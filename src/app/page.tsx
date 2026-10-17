import { Shield, Zap, Heart, ExternalLink, Cpu, CheckCircle } from 'lucide-react';
import { BentoGrid } from '@/components/common/BentoGrid';
import { JsonLd } from '@/components/common/JsonLd';
import { BASE_URL } from '@/lib/seo/toolsData';

export default function HomePage() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AntPDF',
    url: BASE_URL,
    description:
      'Zero server, zero knowledge in browser PDF studio. Merge, split, compress, protect, unlock, rotate, and watermark PDFs 100% locally on your device.',
    author: {
      '@type': 'Person',
      name: 'Tanmay Nilesh Shinde',
      url: 'https://tanmayshinde.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/#tools-grid`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      {/* Studio Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-20 sm:pb-16 border-b border-surface-border studio-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Engineering Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium studio-surface text-slate-800 dark:text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>WASM In Browser Engine Ready</span>
            <span className="text-muted">•</span>
            <span className="text-muted">Zero Server Transfer</span>
          </div>

          {/* Precision Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Zero Server PDF Studio.
            <br />
            <span className="text-slate-500 dark:text-slate-400 font-semibold">
              Desktop power directly in your browser.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted leading-relaxed">
            Manipulate, merge, encrypt, and optimize sensitive PDF files locally in device RAM.
            Zero cloud uploads, zero paywalls, and zero file size caps.
          </p>

          {/* Primary Quick Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#tools-grid"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Launch Studio Tools
            </a>

            <a
              href="https://github.com/TanmayNileshShinde/antpdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl studio-surface hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>GitHub Source Code</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          {/* Studio Telemetry Grid */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left font-mono">
            <div className="p-3.5 rounded-xl studio-surface">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans">
                Network Upload
              </div>
              <div className="text-xl font-bold font-tabular text-emerald-500 mt-1">
                0 KB
              </div>
              <div className="text-[10px] text-muted mt-0.5">
                Never leaves device
              </div>
            </div>

            <div className="p-3.5 rounded-xl studio-surface">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans">
                Execution Model
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                WASM
              </div>
              <div className="text-[10px] text-muted mt-0.5">
                Client side memory
              </div>
            </div>

            <div className="p-3.5 rounded-xl studio-surface">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans">
                File Size Limit
              </div>
              <div className="text-xl font-bold font-tabular text-indigo-500 mt-1">
                Unlimited
              </div>
              <div className="text-[10px] text-muted mt-0.5">
                Browser RAM bound
              </div>
            </div>

            <div className="p-3.5 rounded-xl studio-surface">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans">
                Daily Quotas
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Zero
              </div>
              <div className="text-[10px] text-muted mt-0.5">
                No paywall locks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Gallery Section */}
      <BentoGrid />

      {/* Architectural Comparison Section */}
      <section id="features" className="py-14 border-t border-surface-border bg-slate-50/40 dark:bg-card/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-500">
              Architectural Shift
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why In Browser Execution Wins
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Cloud converters force you to upload personal documents to their infrastructure.
              AntPDF runs directly on your hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl studio-surface space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Zero Knowledge Privacy
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Your documents stay inside your local browser memory space.
                No third party data retention, no external servers, and zero telemetry tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl studio-surface space-y-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sub Second WASM Processing
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Skip the upload wait and download queues.
                WebAssembly processes multi page PDFs in milliseconds using native device threads.
              </p>
            </div>

            <div className="p-6 rounded-2xl studio-surface space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No Paywalls or Throttling
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Because there are zero server processing costs on Vercel,
                AntPDF does not throttle users with paid subscriptions or daily task limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Authorship Engineering Spotlight */}
      <section className="py-12 border-t border-surface-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-3 font-mono">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-violet-500/10 text-violet-500 font-medium">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>Open Source Collaborative Architecture</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans">
            Crafted by Tanmay Nilesh Shinde &amp; Antara Parab
          </h2>

          <p className="text-xs text-muted max-w-lg mx-auto font-sans leading-relaxed">
            Phase 1 implements Tanmay 65% scope covering the Core WASM Engine, Programmatic SEO, and Studio Bento UI.
            Phase 2 implements Antara 35% scope covering Visual Page Organizers and Transcoders.
          </p>

          <div className="pt-2">
            <a
              href="https://github.com/TanmayNileshShinde/antpdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:underline"
            >
              <span>Explore GitHub Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
