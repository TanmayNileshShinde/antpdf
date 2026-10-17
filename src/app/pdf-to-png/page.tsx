import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { PdfToPngTool } from '@/components/tools/PdfToPngTool';

export const metadata: Metadata = generateToolMetadata('pdf-to-png');

export default function PdfToPngPage() {
  const tool = TOOLS['pdf-to-png'];
  return (
    <ToolLayout tool={tool}>
      <PdfToPngTool />
    </ToolLayout>
  );
}
