import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { OrganizeTool } from '@/components/tools/OrganizeTool';

export const metadata: Metadata = generateToolMetadata('organize-pdf');

export default function OrganizePdfPage() {
  const tool = TOOLS['organize-pdf'];
  return (
    <ToolLayout tool={tool}>
      <OrganizeTool />
    </ToolLayout>
  );
}

