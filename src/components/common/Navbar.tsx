'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
  Search,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ALL_TOOLS_LIST } from '@/lib/seo/toolsData';

export function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border studio-glass transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Mark and Identity */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                <span>🐜</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white" title="Antara & Tanmay PDF">
                  AnTPDF
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-medium">
                  Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Tools Flyout */}
              <div
                className="relative"
                onMouseEnter={() => setIsToolsOpen(true)}
                onMouseLeave={() => setIsToolsOpen(false)}
              >
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                  aria-expanded={isToolsOpen}
                >
                  <span>Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {isToolsOpen && (
                  <div className="absolute left-0 mt-1 w-[440px] p-3 studio-surface rounded-2xl shadow-2xl grid grid-cols-2 gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="col-span-2 pb-2 mb-1 border-b border-surface-border flex items-center justify-between text-[11px] text-muted">
                      <span className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        In Browser PDF Tools
                      </span>
                      <span className="text-emerald-500 font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Client Side
                      </span>
                    </div>

                    {ALL_TOOLS_LIST.slice(0, 10).map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/${tool.slug}`}
                        onClick={() => setIsToolsOpen(false)}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex flex-col group/item"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover/item:text-indigo-500">
                            {tool.name}
                          </span>
                          {tool.isV2 && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 font-bold">
                              v2
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted line-clamp-1 mt-0.5">
                          {tool.shortDescription}
                        </span>
                      </Link>
                    ))}

                    <div className="col-span-2 pt-2 border-t border-surface-border text-center">
                      <Link
                        href="/#tools-grid"
                        onClick={() => setIsToolsOpen(false)}
                        className="text-xs font-semibold text-indigo-500 hover:underline inline-flex items-center gap-1"
                      >
                        Browse all 18 tools <Sparkles className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/#features"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                Philosophy
              </Link>

              <Link
                href="/privacy"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                Zero Knowledge
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Command palette search trigger */}
            <Link
              href="/#tools-grid"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-slate-100/60 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs text-muted hover:text-slate-900 dark:hover:text-white transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search tools</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-800 border border-surface-border text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </Link>

            {/* Live WASM Telemetry Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>0 KB Server Transfer</span>
            </div>

            {/* Dark Mode Switcher */}
            <ThemeToggle />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-surface-border text-slate-700 dark:text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-white dark:bg-card p-4 space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Quick Select
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1.5">
              {ALL_TOOLS_LIST.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg text-xs font-semibold bg-surface text-slate-900 dark:text-slate-100"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-surface-border flex flex-col gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
              Zero Server Philosophy
            </Link>
            <Link href="/privacy" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
              Privacy Guarantee
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
