import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { PdfToWordTool } from '@/components/tools/PdfToWordTool';

export const metadata: Metadata = generateToolMetadata('pdf-to-word');

export default function PdfToWordPage() {
  const tool = TOOLS['pdf-to-word'];
  return (
    <ToolLayout tool={tool}>
      <PdfToWordTool />
    </ToolLayout>
  );
}
