import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { WordToPdfTool } from '@/components/tools/WordToPdfTool';

export const metadata: Metadata = generateToolMetadata('word-to-pdf');

export default function WordToPdfPage() {
  const tool = TOOLS['word-to-pdf'];
  return (
    <ToolLayout tool={tool}>
      <WordToPdfTool />
    </ToolLayout>
  );
}
