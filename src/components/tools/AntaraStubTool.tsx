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
      <div className="p-6 sm:p-7 rounded-2xl bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            </span>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                Interactive Canvas Studio &bull; Work in Progress
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Collaborative feature by Tanmay Nilesh Shinde &amp; Antara Parab
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
            <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ready for Pull</span>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
          <p className="leading-relaxed">
            This route and its Google programmatic SEO metadata, OpenGraph tags,
            sitemaps, and Schema.org JSON LD are 100% active and indexable.
          </p>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-200 space-y-1.5">
            <div className="text-neutral-500">{'// Development branch:'}</div>
            <div className="text-emerald-400">git pull origin main</div>
            <div className="text-neutral-300">git checkout -b feat/{tool.slug}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {tool.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
