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
  ArrowRight,
} from 'lucide-react';
import { ALL_TOOLS_LIST } from '@/lib/seo/toolsData';

// Map icon string to Lucide component
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
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inName = tool.name.toLowerCase().includes(q);
      const inDesc = tool.shortDescription.toLowerCase().includes(q);
      const inKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return inName || inDesc || inKeywords;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section id="tools-grid" className="w-full py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Tools' },
              { id: 'organize', label: 'Organize' },
              { id: 'security', label: 'Security' },
              { id: 'optimize', label: 'Optimize' },
              { id: 'edit', label: 'Edit' },
              { id: 'convert', label: 'Convert' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Real-Time Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 18+ tools (e.g. merge, compress, protect)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Bento Grid Gallery */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map((tool) => {
              const IconComponent = ICON_MAP[tool.icon] || Layers;

              return (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  className="group relative p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 glow-card flex flex-col justify-between transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {tool.badge}
                          </span>
                        )}
                        {tool.author === 'Antara' ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                            Antara Scope
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                            Tanmay Scope
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No tools matched &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try searching for &quot;merge&quot;, &quot;split&quot;, &quot;compress&quot;, or &quot;protect&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2"
            >
              Reset search filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
