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
    default: 'AnTPDF — 100% In Browser PDF Studio | Free, Zero Server Uploads',
    template: '%s | AnTPDF',
  },
  description:
    'AnTPDF is the zero server, zero knowledge in browser PDF studio. Merge, split, compress, protect, unlock, rotate, watermark, and flatten PDFs with 100% client side privacy. Zero file size caps, zero paywalls.',
  keywords: [
    'AnTPDF',
    'free pdf editor online',
    'merge pdf',
    'split pdf',
    'compress pdf',
    'in browser pdf studio',
    'client side pdf tool',
    'zero server upload pdf',
    'ilovepdf alternative',
    'smallpdf alternative',
  ],
  authors: [
    { name: 'Tanmay Shinde', url: 'https://tanmayshinde.com' },
    { name: 'Antara Parab' },
  ],
  creator: 'Tanmay Shinde',
  publisher: 'AnTPDF',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'AnTPDF — 100% In Browser PDF Studio',
    description:
      'Zero server uploads. Zero paywalls. Zero daily limits. Merge, split, compress, protect, and edit PDFs directly inside your browser memory.',
    url: BASE_URL,
    siteName: 'AnTPDF',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnTPDF — 100% In Browser PDF Studio',
    description:
      'Zero server uploads. Zero paywalls. Zero daily limits. 100% client side in browser WebAssembly PDF processing.',
    creator: '@tanmayshinde',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('antpdf-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans bg-background text-foreground`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
