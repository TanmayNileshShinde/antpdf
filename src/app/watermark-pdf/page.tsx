import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { TOOLS } from '@/lib/seo/toolsData';
import { ToolLayout } from '@/components/common/ToolLayout';
import { WatermarkTool } from '@/components/tools/WatermarkTool';

export const metadata: Metadata = generateToolMetadata('watermark-pdf');

export default function WatermarkPdfPage() {
  const tool = TOOLS['watermark-pdf'];
  return (
    <ToolLayout tool={tool}>
      <WatermarkTool />
    </ToolLayout>
  );
}
