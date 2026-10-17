import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { SplitTool } from '@/components/tools/SplitTool';

export const metadata: Metadata = generateToolMetadata('split-pdf');

export default function SplitPdfPage() {
  const tool = TOOLS['split-pdf'];
  return (
    <ToolLayout tool={tool}>
      <SplitTool />
    </ToolLayout>
  );
}
