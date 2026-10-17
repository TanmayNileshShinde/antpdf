'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Check,
  X as XIcon,
} from 'lucide-react';
import { ToolDefinition, ALL_TOOLS_LIST } from '@/lib/seo/toolsData';
import { generateToolJsonLd } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/common/JsonLd';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const jsonLdData = generateToolJsonLd(tool.slug);

  const relatedTools = ALL_TOOLS_LIST.filter(
    (t) => t.id !== tool.id && (t.category === tool.category || t.author === tool.author)
  ).slice(0, 4);

  return (
    <>
      <JsonLd data={jsonLdData} />

      <div className="w-full">
        {/* Breadcrumb Header */}
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/#tools-grid" className="hover:text-indigo-600 dark:hover:text-indigo-400 capitalize">
                {tool.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {tool.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-10 sm:py-14 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              {tool.badge ?? '100% Free'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Zero Server Uploads
            </span>
            {tool.author === 'Antara' ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                Co-authored with Antara Parab
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Architected by Tanmay Nilesh Shinde
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {tool.name} Online
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {tool.longDescription}
          </p>
        </section>

        {/* Interactive Tool Container */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <div className="p-6 sm:p-10 rounded-3xl glass-panel shadow-xl shadow-slate-200/50 dark:shadow-none relative">
            {children}
          </div>
        </section>

        {/* How It Works - 3 Step Guide (HowTo Schema) */}
        <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Step-by-Step Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                How to use {tool.name} in 3 Simple Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tool.howTo.map((item) => (
                <div
                  key={item.step}
                  id={`step-${item.step}`}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs relative"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-md shadow-indigo-600/20">
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Callout: AntPDF vs iLovePDF / Smallpdf */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              The AntPDF Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Why Choose AntPDF Over Cloud Converters?
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Feature</th>
                  <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400">AntPDF (This Site)</th>
                  <th className="p-4 font-semibold text-slate-500">iLovePDF & Smallpdf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-200">Server Uploads</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> 0% (Strictly Local WASM)
                  </td>
                  <td className="p-4 text-red-500 flex items-center gap-1.5">
                    <XIcon className="w-4 h-4" /> 100% Uploaded to Cloud
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-200">File Size Limit</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Unlimited (Browser RAM)
                  </td>
                  <td className="p-4 text-slate-500">Capped (15MB - 50MB free)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-200">Daily Task Limits</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Zero Limits & Zero Paywalls
                  </td>
                  <td className="p-4 text-slate-500">2 tasks/day then paid paywall</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-200">Processing Speed</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Instant (Sub-second WASM)
                  </td>
                  <td className="p-4 text-slate-500">Slow (Upload + Queue + Download)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-200">Source Code</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> 100% Open Source (MIT)
                  </td>
                  <td className="p-4 text-slate-500">Proprietary / Closed Source</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Accordion (FAQPage Schema) */}
        <section className="py-14 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Got Questions about {tool.name}?
              </h2>
            </div>

            <div className="space-y-3">
              {tool.faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                More Essential PDF Tools
              </h3>
              <Link
                href="/#tools-grid"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/${rel.slug}`}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 glow-card transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {rel.category}
                    </span>
                    {rel.author === 'Antara' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-medium">
                        Antara
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
