import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AppProviders } from '@/components/providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const APP_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Memorama',
  description: 'A fun memory card matching game on Base',
  openGraph: {
    title: 'Memorama',
    description: 'Test your memory! Match all the pairs in this fun card game.',
    images: [`${APP_URL}/og-image.png`],
    url: APP_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memorama',
    description: 'Test your memory! Match all the pairs in this fun card game.',
    images: [`${APP_URL}/og-image.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'base:app_id': '696fe31eb1df0aaec05af3ec',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
