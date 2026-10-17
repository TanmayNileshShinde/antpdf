import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { MergeTool } from '@/components/tools/MergeTool';

export const metadata: Metadata = generateToolMetadata('merge-pdf');

export default function MergePdfPage() {
  const tool = TOOLS['merge-pdf'];
  return (
    <ToolLayout tool={tool}>
      <MergeTool />
    </ToolLayout>
  );
}
