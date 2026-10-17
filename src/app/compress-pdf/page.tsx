import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { CompressTool } from '@/components/tools/CompressTool';

export const metadata: Metadata = generateToolMetadata('compress-pdf');

export default function CompressPdfPage() {
  const tool = TOOLS['compress-pdf'];
  return (
    <ToolLayout tool={tool}>
      <CompressTool />
    </ToolLayout>
  );
}
