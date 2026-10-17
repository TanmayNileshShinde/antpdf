import { MetadataRoute } from 'next';
import { BASE_URL, ALL_TOOLS_LIST } from '@/lib/seo/toolsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date('2026-10-17T00:00:00.000Z');

  // Root Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // All 18+ PDF Tools
  ALL_TOOLS_LIST.forEach((tool) => {
    routes.push({
      url: `${BASE_URL}/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: tool.author === 'Tanmay' ? 0.9 : 0.85,
    });
  });

  // Legal & Informational Pages
  routes.push(
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  );

  return routes;
}
