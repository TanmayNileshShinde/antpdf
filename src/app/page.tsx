import Link from 'next/link';
import { Shield, Zap, Heart, Cpu, CheckCircle } from 'lucide-react';
import { BentoGrid } from '@/components/common/BentoGrid';
import { JsonLd } from '@/components/common/JsonLd';
import { BASE_URL } from '@/lib/seo/toolsData';

export default function HomePage() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AnTPDF',
    url: BASE_URL,
    description:
      'Zero server, zero knowledge in browser PDF studio. Merge, split, compress, protect, unlock, rotate, and watermark PDFs 100% locally on your device.',
    author: {
      '@type': 'Person',
      name: 'Tanmay Shinde',
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
      <section className="relative overflow-hidden pt-12 pb-12 sm:pt-20 sm:pb-20 border-b border-surface-border studio-grid">
        {/* Ambient Studio Lighting Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-violet-500/10 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Engineering Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium border border-indigo-500/20 bg-indigo-500/10 text-indigo-900 dark:text-indigo-200 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">WASM In-Browser Engine Ready</span>
            <span className="text-muted">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero Server Transfer</span>
          </div>

          {/* Precision Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="bg-gradient-to-b from-slate-950 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Zero Server PDF Studio.
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300 bg-clip-text text-transparent font-bold">
              Desktop power directly in your browser.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Manipulate, merge, sign, encrypt, and optimize sensitive PDF files locally in device RAM.
            <strong className="text-slate-900 dark:text-white font-semibold"> Zero cloud uploads</strong>, zero paywalls, and zero file size caps.
          </p>

          {/* Primary Quick Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#tools-grid"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" /> Launch Studio Tools
            </a>

            <a
              href="/privacy"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl studio-surface hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-xs"
            >
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Zero Knowledge Security</span>
            </a>
          </div>

          {/* Studio Telemetry Grid */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left font-mono">
            <div className="p-4 rounded-2xl studio-surface relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans font-medium flex items-center justify-between">
                <span>Network Upload</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-tabular text-emerald-600 dark:text-emerald-400 mt-1">
                0 KB
              </div>
              <div className="text-[10px] text-muted mt-0.5">
                Never leaves device
              </div>
            </div>

            <div className="p-4 rounded-2xl studio-surface relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans font-medium flex items-center justify-between">
                <span>Execution Model</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-tabular text-indigo-600 dark:text-indigo-400 mt-1">
                WASM
              </div>
              <div className="text-[10px] text-muted mt-0.5">
                Client side memory
              </div>
            </div>

            <div className="p-4 rounded-2xl studio-surface relative overflow-hidden group hover:border-violet-500/40 transition-all">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans font-medium flex items-center justify-between">
                <span>File Size Limit</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              </div>
              <div className="text-2xl font-bold font-tabular text-violet-600 dark:text-violet-400 mt-1">
                Unlimited
              </div>
              <div className="text-[10px] text-muted mt-0.5">
                Browser RAM bound
              </div>
            </div>

            <div className="p-4 rounded-2xl studio-surface relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="text-[11px] uppercase tracking-wider text-muted font-sans font-medium flex items-center justify-between">
                <span>Daily Quotas</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <div className="text-2xl font-bold font-tabular text-amber-600 dark:text-amber-400 mt-1">
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
              AnTPDF runs directly on your hardware.
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
                AnTPDF does not throttle users with paid subscriptions or daily task limits.
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
            <span>Independent Software Studio</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans">
            Crafted by Tanmay Shinde &amp; Antara Parab
          </h2>

          <p className="text-xs text-muted max-w-lg mx-auto font-sans leading-relaxed">
            AnTPDF is an independent, privacy first studio built with client side WebAssembly.
            Every tool runs directly on your device with zero server uploads, zero telemetry, and zero paywalls.
          </p>

          <div className="pt-2">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:underline font-sans"
            >
              <span>Learn About Zero Knowledge Privacy</span>
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
