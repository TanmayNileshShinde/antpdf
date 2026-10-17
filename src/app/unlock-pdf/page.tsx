import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { UnlockTool } from '@/components/tools/UnlockTool';

export const metadata: Metadata = generateToolMetadata('unlock-pdf');

export default function UnlockPdfPage() {
  const tool = TOOLS['unlock-pdf'];
  return (
    <ToolLayout tool={tool}>
      <UnlockTool />
    </ToolLayout>
  );
}
