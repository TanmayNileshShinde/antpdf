import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { ALL_TOOLS_LIST } from '@/lib/seo/toolsData';

export function Footer() {
  const organizeTools = ALL_TOOLS_LIST.filter((t) => t.category === 'organize');
  const securityTools = ALL_TOOLS_LIST.filter((t) => t.category === 'security');
  const editTools = ALL_TOOLS_LIST.filter((t) => t.category === 'edit' || t.category === 'optimize');
  const convertTools = ALL_TOOLS_LIST.filter((t) => t.category === 'convert');

  return (
    <footer className="w-full border-t border-surface-border bg-slate-50/70 dark:bg-[#07090e] transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm shadow-xs">
                🐜
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white" title="Antara & Tanmay PDF">
                AnTPDF
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-surface-border text-muted">
                Studio
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-sm font-sans">
              The zero server, zero knowledge in browser PDF studio named after co creators Antara Parab &amp; Tanmay Nilesh Shinde.
              Every document executes 100% locally on your machine using
              WebAssembly. No remote cloud uploads, no daily paywalls, and no file size caps.
            </p>

            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-start gap-2.5 max-w-sm">
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>
                <strong>Zero Knowledge Memory:</strong> Your files never leave this device.
                Open the DevTools Network Tab anytime to verify 0 upload requests.
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Zero Cloud Transmission Guarantee
              </Link>
            </div>
          </div>

          {/* Column 1: Organize */}
          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-900 dark:text-slate-100 font-semibold mb-3.5">
              Organize Studio
            </h3>
            <ul className="space-y-2 text-xs">
              {organizeTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-muted hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{tool.name}</span>
                    {tool.isV2 && (
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded">
                        v2
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Edit & Security */}
          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-900 dark:text-slate-100 font-semibold mb-3.5">
              Edit & Security
            </h3>
            <ul className="space-y-2 text-xs">
              {[...securityTools, ...editTools].map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-muted hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{tool.name}</span>
                    {tool.isV2 && (
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded">
                        v2
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Convert & Legal */}
          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-900 dark:text-slate-100 font-semibold mb-3.5">
              Convert & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              {convertTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-muted hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{tool.name}</span>
                    {tool.isV2 && (
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded">
                        v2
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-surface-border">
                <Link
                  href="/privacy"
                  className="text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Co-Authorship & Bottom Bar */}
        <div className="pt-8 mt-10 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <span>© 2026 AnTPDF &bull; All rights reserved</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Engineered by</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              Tanmay Nilesh Shinde
            </span>
            <span>&</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              Antara Parab
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
