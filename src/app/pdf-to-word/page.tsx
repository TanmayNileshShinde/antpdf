import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { AntaraStubTool } from '@/components/tools/AntaraStubTool';

export const metadata: Metadata = generateToolMetadata('pdf-to-word');

export default function PdfToWordPage() {
  const tool = TOOLS['pdf-to-word'];
  return (
    <ToolLayout tool={tool}>
      <AntaraStubTool tool={tool} />
    </ToolLayout>
  );
}
