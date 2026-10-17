import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { AntaraStubTool } from '@/components/tools/AntaraStubTool';

export const metadata: Metadata = generateToolMetadata('jpg-to-pdf');

export default function JpgToPdfPage() {
  const tool = TOOLS['jpg-to-pdf'];
  return (
    <ToolLayout tool={tool}>
      <AntaraStubTool tool={tool} />
    </ToolLayout>
  );
}
