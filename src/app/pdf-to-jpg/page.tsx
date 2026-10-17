import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { PdfToJpgTool } from '@/components/tools/PdfToJpgTool';

export const metadata: Metadata = generateToolMetadata('pdf-to-jpg');

export default function PdfToJpgPage() {
  const tool = TOOLS['pdf-to-jpg'];
  return (
    <ToolLayout tool={tool}>
      <PdfToJpgTool />
    </ToolLayout>
  );
}
