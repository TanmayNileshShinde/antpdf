'use client';

import React, { useState } from 'react';
import { GitBranch, Sparkles, CheckCircle2 } from 'lucide-react';
import { FileDropzone, UploadedPdfMeta } from '@/components/common/FileDropzone';
import { ToolDefinition } from '@/lib/seo/toolsData';

interface AntaraStubToolProps {
  tool: ToolDefinition;
}

export function AntaraStubTool({ tool }: AntaraStubToolProps) {
  const [files, setFiles] = useState<UploadedPdfMeta[]>([]);

  return (
    <div className="w-full space-y-6">
      {/* Visual File Dropzone */}
      <FileDropzone
        multiple={tool.slug === 'jpg-to-pdf'}
        accept={
          tool.slug === 'jpg-to-pdf'
            ? 'image/jpeg,image/png,image/webp'
            : tool.slug === 'word-to-pdf'
            ? '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : '.pdf,application/pdf'
        }
        files={files}
        onFilesChange={setFiles}
        title={`Drop files to test ${tool.name}`}
        description="100% In-Browser • Files processed entirely on your local machine"
      />

      {/* Collaboration Banner for Antara */}
      <div className="p-6 sm:p-8 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-purple-500/10 dark:from-violet-950/20 dark:via-indigo-950/15 dark:to-purple-950/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-violet-200/50 dark:border-violet-800/40">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-violet-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Co-Author Module: Antara&apos;s 35% Scope
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Architected by Tanmay Nilesh Shinde &bull; Ready for Antara Parab
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-300/60 dark:border-violet-700/60 self-start sm:self-auto">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Ready for Pull</span>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p>
            This route and its Google programmatic SEO metadata, OpenGraph tags,
            sitemaps, and Schema.org JSON-LD are 100% active and indexable.
          </p>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1">
            <div className="text-slate-400">{'// Next steps for Antara:'}</div>
            <div>git pull origin main</div>
            <div>git checkout -b feat/antara-{tool.slug}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {tool.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
