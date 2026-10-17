import { Shield, Zap, Heart, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/common/GithubIcon';
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
      'Zero-server, zero-knowledge in-browser PDF studio. Merge, split, compress, protect, unlock, rotate, and watermark PDFs 100% locally on your device.',
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-indigo-50/40 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/15 to-emerald-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/70 shadow-xs">
            <span className="text-sm">🐜</span>
            <span>AntPDF 1.0 &bull; 100% In-Browser PDF Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            The Zero-Server PDF Studio.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
              Faster. Private. Unlimited.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Never upload confidential contracts, tax records, or bank statements to
            remote cloud servers again. AntPDF manipulates PDF files directly in your
            browser memory using WebAssembly.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#tools-grid"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold text-sm sm:text-base shadow-xl shadow-indigo-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Explore All 18+ Tools
            </a>

            <a
              href="https://github.com/TanmayNileshShinde/antpdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
            >
              <GithubIcon className="w-4 h-4" /> GitHub Repository
            </a>
          </div>

          {/* Stat Pillars */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                0 KB
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Sent to Any Server
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                100% Free
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Zero Daily Paywalls
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-violet-600 dark:text-violet-400">
                &infin; Size
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                No Artificial File Limits
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                WASM
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Sub-Second Speed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Tools Section */}
      <BentoGrid />

      {/* Feature Philosophy Section */}
      <section id="features" className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why We Built AntPDF
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              The Problem With Legacy Cloud Converters
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Services like iLovePDF and Smallpdf charge subscriptions, throttle your usage, and
              require you to upload personal documents to their remote servers. AntPDF changes that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your PDF files are parsed, processed, encrypted, and saved right in your
                device&apos;s memory using WebAssembly. Verify in your browser DevTools: 0 upload bytes!
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Paywalls &amp; No Limits
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No &quot;2 tasks per day&quot; popups. No 15MB file size limits.
                Process 100MB documents with 500 pages completely free of charge.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <GithubIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Open-Source Collaborative
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Co-authored by Tanmay Nilesh Shinde and Antara Parab under the MIT license.
                Transparent, community-driven, and permanently accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Authorship Section */}
      <section className="py-14 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Collaborative Flagship Project</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Architected &amp; Built by Tanmay &amp; Antara
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Phase 1 covers Tanmay&apos;s 65% scope (Core WASM Engine, pSEO Architecture, Bento UI, and Core PDF Tools).
            Phase 2 covers Antara&apos;s 35% scope (Visual Page Organizer, Remover, Image Extractors, and Digital Signatures).
          </p>

          <div className="pt-2">
            <a
              href="https://github.com/TanmayNileshShinde/antpdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Contribute on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
