import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FlattenTool } from '@/components/tools/FlattenTool';

export const metadata: Metadata = generateToolMetadata('flatten-pdf');

export default function FlattenPdfPage() {
  const tool = TOOLS['flatten-pdf'];
  return (
    <ToolLayout tool={tool}>
      <FlattenTool />
    </ToolLayout>
  );
}
