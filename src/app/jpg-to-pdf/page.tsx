import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { JpgToPdfTool } from '@/components/tools/JpgToPdfTool';

export const metadata: Metadata = generateToolMetadata('jpg-to-pdf');

export default function JpgToPdfPage() {
  const tool = TOOLS['jpg-to-pdf'];
  return (
    <ToolLayout tool={tool}>
      <JpgToPdfTool />
    </ToolLayout>
  );
}
