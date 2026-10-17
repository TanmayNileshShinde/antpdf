'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { ThemeToggle } from './ThemeToggle';
import { ALL_TOOLS_LIST } from '@/lib/seo/toolsData';

export function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🐜</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
                  AntPDF
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  WASM
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:inline">
                Zero-Server PDF Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-expanded={isToolsOpen}
              >
                <span>Tools Directory</span>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-hover:rotate-180" />
              </button>

              {isToolsOpen && (
                <div className="absolute left-0 mt-1 w-[460px] p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Popular Client-Side Tools
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> 100% In-Browser
                    </span>
                  </div>
                  {ALL_TOOLS_LIST.slice(0, 10).map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.slug}`}
                      onClick={() => setIsToolsOpen(false)}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex flex-col group/item"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400">
                          {tool.name}
                        </span>
                        {tool.author === 'Antara' && (
                          <span className="text-[9px] px-1 rounded bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-medium">
                            Antara
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {tool.shortDescription}
                      </span>
                    </Link>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      href="/#tools-grid"
                      onClick={() => setIsToolsOpen(false)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      View all 18+ PDF tools <Sparkles className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#features"
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              Zero-Server Philosophy
            </Link>

            <Link
              href="/privacy"
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              Privacy
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5">
            {/* Privacy Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero Server Uploads</span>
            </div>

            {/* GitHub Repo */}
            <a
              href="https://github.com/TanmayNileshShinde/antpdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-xs flex items-center gap-1.5"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">GitHub</span>
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Browse Tools
            </span>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {ALL_TOOLS_LIST.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 py-1"
            >
              Zero-Server Philosophy
            </Link>
            <Link
              href="/privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 py-1"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 py-1"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
