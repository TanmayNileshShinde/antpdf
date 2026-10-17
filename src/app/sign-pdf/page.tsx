import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { AntaraStubTool } from '@/components/tools/AntaraStubTool';

export const metadata: Metadata = generateToolMetadata('sign-pdf');

export default function SignPdfPage() {
  const tool = TOOLS['sign-pdf'];
  return (
    <ToolLayout tool={tool}>
      <AntaraStubTool tool={tool} />
    </ToolLayout>
  );
}
