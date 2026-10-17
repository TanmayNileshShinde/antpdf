import { Metadata } from 'next';
import { Shield, ServerOff } from 'lucide-react';
import { BASE_URL } from '@/lib/seo/toolsData';

export const metadata: Metadata = {
  title: 'Privacy Policy — 100% Zero-Server Guarantee | AnTPDF',
  description:
    'AnTPDF guarantees zero-knowledge client-side privacy. Your PDF documents are never uploaded to any remote server or cloud infrastructure.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Strict Zero-Knowledge Policy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Last updated: October 2026
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ServerOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>The Core Zero-Server Guarantee</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          At AnTPDF, privacy is not a policy addendum — it is our fundamental architectural foundation.
          Unlike legacy cloud PDF processors (such as iLovePDF, Smallpdf, Adobe Cloud),
          <strong> AnTPDF does not possess or operate any file-processing backend servers.</strong>
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Where Are My Files Processed?
          </h2>
          <p>
            When you select or drop a PDF into AnTPDF, the file is read directly into your
            computer&apos;s or mobile phone&apos;s RAM (Random Access Memory). All operations — including
            merging, splitting, rotating, encrypting, compressing, watermarking, and flattening — are
            executed locally by your web browser using WebAssembly and pure client-side JavaScript.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. How Can I Verify This?
          </h2>
          <p>
            You can independently inspect network traffic using your browser Developer Tools (F12 &gt; Network tab).
            When performing any PDF operation, you will observe <strong>zero HTTP POST or PUT requests</strong> transmitting
            document binary data to any server. You can even disconnect your Wi-Fi after loading the page and continue
            processing your documents completely offline!
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Document Retention &amp; Storage
          </h2>
          <p>
            Because no document is ever received by AnTPDF servers, there are zero databases, zero cloud buckets (S3),
            and zero caches storing your files. Closing the browser tab instantly flushes all document data from your device RAM.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Telemetry and Analytics
          </h2>
          <p>
            AnTPDF does not use intrusive third-party trackers, cross-site cookies, or fingerprinting scripts.
            Any standard hosting analytics (e.g. Vercel web vitals) measure aggregate page views without capturing personal data.
          </p>
        </section>
      </div>
    </div>
  );
}
