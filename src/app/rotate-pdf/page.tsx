import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { RotateTool } from '@/components/tools/RotateTool';

export const metadata: Metadata = generateToolMetadata('rotate-pdf');

export default function RotatePdfPage() {
  const tool = TOOLS['rotate-pdf'];
  return (
    <ToolLayout tool={tool}>
      <RotateTool />
    </ToolLayout>
  );
}
