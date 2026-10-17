import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { ALL_TOOLS_LIST } from '@/lib/seo/toolsData';

export function Footer() {
  const organizeTools = ALL_TOOLS_LIST.filter((t) => t.category === 'organize');
  const securityTools = ALL_TOOLS_LIST.filter((t) => t.category === 'security');
  const editTools = ALL_TOOLS_LIST.filter((t) => t.category === 'edit' || t.category === 'optimize');
  const convertTools = ALL_TOOLS_LIST.filter((t) => t.category === 'convert');

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/80 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-lg">🐜</span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                AntPDF
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The zero-server, zero-knowledge in-browser PDF studio.
              Every document is processed 100% locally on your machine using
              WebAssembly. No remote cloud uploads, no daily paywalls, and no size caps.
            </p>

            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 max-w-sm">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Knowledge Security:</strong> Your files never touch a remote server.
                Inspect your browser Network Tab anytime to verify 0 upload requests.
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/TanmayNileshShinde/antpdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <GithubIcon className="w-4 h-4" /> Open Source on GitHub
              </a>
            </div>
          </div>

          {/* Column 1: Organize */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Organize PDF
            </h3>
            <ul className="space-y-2 text-xs">
              {organizeTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{tool.name}</span>
                    {tool.author === 'Antara' && (
                      <span className="text-[9px] px-1 py-0.2 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded">
                        v2
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Edit & Optimize */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Edit & Security
            </h3>
            <ul className="space-y-2 text-xs">
              {[...securityTools, ...editTools].map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{tool.name}</span>
                    {tool.author === 'Antara' && (
                      <span className="text-[9px] px-1 py-0.2 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded">
                        v2
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Convert & Stubs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Convert & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              {convertTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{tool.name}</span>
                    {tool.author === 'Antara' && (
                      <span className="text-[9px] px-1 py-0.2 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded">
                        v2
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/privacy"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Co-Authorship & Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2026 AntPDF. Open-source under MIT License.</span>
          </div>

          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span>Engineered with passion by</span>
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              Tanmay Nilesh Shinde
            </span>
            <span>&</span>
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              Antara Parab
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
