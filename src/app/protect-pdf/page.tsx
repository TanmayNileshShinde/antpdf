import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { ProtectTool } from '@/components/tools/ProtectTool';

export const metadata: Metadata = generateToolMetadata('protect-pdf');

export default function ProtectPdfPage() {
  const tool = TOOLS['protect-pdf'];
  return (
    <ToolLayout tool={tool}>
      <ProtectTool />
    </ToolLayout>
  );
}
