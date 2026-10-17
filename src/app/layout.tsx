import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { BASE_URL } from '@/lib/seo/toolsData';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'AntPDF — 100% In-Browser PDF Studio | Free, Zero Server Uploads',
    template: '%s | AntPDF',
  },
  description:
    'AntPDF is the zero-server, zero-knowledge in-browser PDF studio. Merge, split, compress, protect, unlock, rotate, watermark, and flatten PDFs with 100% client-side privacy. Zero file size caps, zero paywalls.',
  keywords: [
    'AntPDF',
    'free pdf editor online',
    'merge pdf',
    'split pdf',
    'compress pdf',
    'in-browser pdf studio',
    'client-side pdf tool',
    'zero server upload pdf',
    'ilovepdf alternative',
    'smallpdf alternative',
  ],
  authors: [
    { name: 'Tanmay Nilesh Shinde', url: 'https://tanmayshinde.com' },
    { name: 'Antara Parab' },
  ],
  creator: 'Tanmay Nilesh Shinde',
  publisher: 'AntPDF',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'AntPDF — 100% In-Browser PDF Studio',
    description:
      'Zero server uploads. Zero paywalls. Zero daily limits. Merge, split, compress, protect, and edit PDFs directly inside your browser memory.',
    url: BASE_URL,
    siteName: 'AntPDF',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AntPDF — 100% In-Browser PDF Studio',
    description:
      'Zero server uploads. Zero paywalls. Zero daily limits. 100% client-side in-browser WebAssembly PDF processing.',
    creator: '@tanmayshinde',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
