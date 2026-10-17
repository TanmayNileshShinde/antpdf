'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Layers,
  Scissors,
  Minimize2,
  Lock,
  Unlock,
  RotateCw,
  Hash,
  Stamp,
  FileCheck,
  Grid,
  Trash2,
  Image,
  FileImage,
  Images,
  FileText,
  FileOutput,
  PenTool,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { ALL_TOOLS_LIST } from '@/lib/seo/toolsData';

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Scissors,
  Minimize2,
  Lock,
  Unlock,
  RotateCw,
  Hash,
  Stamp,
  FileCheck,
  Grid,
  Trash2,
  Image,
  FileImage,
  Images,
  FileText,
  FileOutput,
  PenTool,
};

export function BentoGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS_LIST.filter((tool) => {
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inName = tool.name.toLowerCase().includes(q);
      const inDesc = tool.shortDescription.toLowerCase().includes(q);
      const inKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return inName || inDesc || inKeywords;
    });
  }, [searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Studio Tools', count: ALL_TOOLS_LIST.length },
    { id: 'organize', label: 'Organize', count: 5 },
    { id: 'security', label: 'Security', count: 3 },
    { id: 'optimize', label: 'Optimize', count: 2 },
    { id: 'edit', label: 'Formatting', count: 2 },
    { id: 'convert', label: 'Transcode', count: 6 },
  ];

  return (
    <section id="tools-grid" className="w-full py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Command Search Deck */}
        <div className="p-3.5 sm:p-4 rounded-2xl studio-surface space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools by action (e.g. merge, compress, protect, watermark)..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-surface-border bg-slate-50 dark:bg-card text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-muted hover:text-slate-900 dark:hover:text-white font-medium"
                  >
                    Clear
                  </button>
                ) : (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted rounded bg-white dark:bg-white/5 border border-surface-border">
                    Quick filter
                  </span>
                )}
              </div>
            </div>

            {/* Total Results Counter */}
            <div className="text-[11px] font-mono text-muted flex items-center gap-1.5 px-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-tabular font-bold text-slate-900 dark:text-white">
                {filteredTools.length}
              </span>
              <span>of {ALL_TOOLS_LIST.length} tools active</span>
            </div>
          </div>

          {/* Category Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none pt-1 border-t border-surface-border">
            <Filter className="w-3.5 h-3.5 text-muted shrink-0 mr-1 hidden sm:inline" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100/70 dark:bg-white/5 text-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono font-normal opacity-70 ${
                  selectedCategory === cat.id ? 'text-white dark:text-slate-950' : ''
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Studio Tiles */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredTools.map((tool) => {
              const IconComponent = ICON_MAP[tool.icon] || Layers;

              return (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  className="group relative p-5 rounded-2xl studio-surface flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    {/* Top Tile Metadata */}
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-surface-border text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:border-indigo-500/40 group-hover:text-indigo-500 transition-all">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        {tool.author === 'Antara' ? (
                          <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-500 font-medium">
                            Antara Scope
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-medium">
                            Tanmay Scope
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title and Short Description */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors flex items-center gap-1">
                        <span>{tool.name}</span>
                      </h3>
                      <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Tile Bottom Launch Bar */}
                  <div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between text-xs font-semibold text-muted group-hover:text-slate-900 dark:group-hover:text-white">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                      {tool.category}
                    </span>
                    <span className="flex items-center gap-1 text-indigo-500 font-medium group-hover:translate-x-0.5 transition-transform">
                      <span>Launch</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 studio-surface rounded-2xl">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No tools matched your query &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-muted">
              Try searching for actions like merge, compress, protect, or split.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-indigo-500 hover:underline pt-2"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
