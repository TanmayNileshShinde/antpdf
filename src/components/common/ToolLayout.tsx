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
  ShieldCheck,
  Lock,
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
        {/* Studio Breadcrumb Bar */}
        <div className="border-b border-surface-border bg-slate-100/50 dark:bg-card/40 py-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs font-mono text-muted">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Studio
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <Link href="/#tools-grid" className="hover:text-slate-900 dark:hover:text-white transition-colors capitalize">
                {tool.category}
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {tool.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Tool Studio Header */}
        <section className="py-8 sm:py-12 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-surface-border text-slate-700 dark:text-slate-300 font-semibold">
              {tool.badge ?? 'Studio Tool'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" /> Zero Server Transfer
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold">
              Client Side WASM
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {tool.name}
          </h1>

          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            {tool.longDescription}
          </p>
        </section>

        {/* Studio Interactive Workbench */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-14">
          <div className="p-6 sm:p-8 rounded-2xl studio-surface studio-grid">
            {children}
          </div>
        </section>

        {/* How It Works (HowTo Schema Section) */}
        <section className="py-12 border-t border-surface-border bg-slate-50/50 dark:bg-card/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-500">
                Execution Workflow
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                How to use {tool.name} in 3 steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tool.howTo.map((item) => (
                <div
                  key={item.step}
                  id={`step-${item.step}`}
                  className="p-5 rounded-xl studio-surface space-y-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-xs">
                    0{item.step}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Callout: AnTPDF vs iLovePDF / Smallpdf */}
        <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500">
              Architecture Analysis
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              AnTPDF vs Cloud Converters
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl studio-surface">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-slate-100/50 dark:bg-white/5 font-mono text-[11px] uppercase tracking-wider text-muted">
                  <th className="p-3.5 font-semibold">Capability</th>
                  <th className="p-3.5 font-bold text-indigo-500">AnTPDF Client Studio</th>
                  <th className="p-3.5 font-semibold text-muted">Legacy Cloud Services</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                <tr>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">Server Uploads</td>
                  <td className="p-3.5 font-bold text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> 0% (Local WASM)
                  </td>
                  <td className="p-3.5 text-red-500 flex items-center gap-1.5">
                    <XIcon className="w-3.5 h-3.5" /> 100% Uploaded to Cloud
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">File Size Limit</td>
                  <td className="p-3.5 font-bold text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Unlimited (RAM Bound)
                  </td>
                  <td className="p-3.5 text-muted">Capped at 15MB free</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">Daily Task Limits</td>
                  <td className="p-3.5 font-bold text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Zero Paywalls
                  </td>
                  <td className="p-3.5 text-muted">2 tasks per day lock</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">Processing Speed</td>
                  <td className="p-3.5 font-bold text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Sub Second Execution
                  </td>
                  <td className="p-3.5 text-muted">Slow cloud queues</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">Source Code</td>
                  <td className="p-3.5 font-bold text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> 100% Open Source MIT
                  </td>
                  <td className="p-3.5 text-muted">Closed Proprietary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Accordions */}
        <section className="py-12 border-t border-surface-border bg-slate-50/50 dark:bg-card/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-500">
                Documentation
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2.5">
              {tool.faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl studio-surface overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-surface-border pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related Studio Tools */}
        {relatedTools.length > 0 && (
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                Related Studio Tools
              </h3>
              <Link
                href="/#tools-grid"
                className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1 font-mono"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/${rel.slug}`}
                  className="p-4 rounded-xl studio-surface flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                      {rel.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
