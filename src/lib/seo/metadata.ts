import type { Metadata } from 'next';
import { BASE_URL, TOOLS, ToolDefinition } from './toolsData';

/**
 * Dynamic Next.js Metadata generator for any tool page
 */
export function generateToolMetadata(slug: string): Metadata {
  const tool: ToolDefinition | undefined = TOOLS[slug];

  if (!tool) {
    return {
      title: 'Tool Not Found | AntPDF',
      description: 'The requested PDF tool was not found on AntPDF.',
    };
  }

  const canonicalUrl = `${BASE_URL}/${slug}`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    authors: [
      { name: 'Tanmay Nilesh Shinde', url: 'https://tanmayshinde.com' },
      { name: 'Antara Parab' },
    ],
    creator: 'Tanmay Nilesh Shinde',
    publisher: 'AntPDF',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: canonicalUrl,
      siteName: 'AntPDF',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${BASE_URL}/og/${slug}.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} — AntPDF In-Browser Studio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
      creator: '@tanmayshinde',
      images: [`${BASE_URL}/og/${slug}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Structured Data (Schema.org JSON-LD): WebApplication, HowTo, and FAQPage schemas
 */
export function generateToolJsonLd(slug: string) {
  const tool = TOOLS[slug];
  if (!tool) return null;

  const toolUrl = `${BASE_URL}/${slug}`;

  // 1. WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `AntPDF - ${tool.name}`,
    url: toolUrl,
    description: tool.metaDescription,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All (Chrome, Safari, Firefox, Edge)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.features,
    browserRequirements: 'Requires JavaScript and HTML5 Canvas / WebAssembly support.',
    author: {
      '@type': 'Person',
      name: 'Tanmay Nilesh Shinde',
      url: 'https://tanmayshinde.com',
    },
  };

  // 2. HowTo Schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.name} Online`,
    description: `Step-by-step guide to use ${tool.name} without uploading files to any server.`,
    step: tool.howTo.map((item) => ({
      '@type': 'HowToStep',
      position: item.step,
      name: item.title,
      text: item.description,
      url: `${toolUrl}#step-${item.step}`,
    })),
  };

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return [webAppSchema, howToSchema, faqSchema];
}
