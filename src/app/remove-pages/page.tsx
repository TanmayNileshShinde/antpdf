import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { RemovePagesTool } from '@/components/tools/RemovePagesTool';

export const metadata: Metadata = generateToolMetadata('remove-pages');

export default function RemovePagesPage() {
  const tool = TOOLS['remove-pages'];
  return (
    <ToolLayout tool={tool}>
      <RemovePagesTool />
    </ToolLayout>
  );
}

