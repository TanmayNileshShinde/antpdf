import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { PageNumberTool } from '@/components/tools/PageNumberTool';

export const metadata: Metadata = generateToolMetadata('add-page-numbers');

export default function AddPageNumbersPage() {
  const tool = TOOLS['add-page-numbers'];
  return (
    <ToolLayout tool={tool}>
      <PageNumberTool />
    </ToolLayout>
  );
}
