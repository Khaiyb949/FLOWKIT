import React from 'react';
import type { Metadata } from 'next';
// @ts-ignore - CSS import for styling
import './global.css';
import { RootLayout } from '@/layouts';

export const metadata: Metadata = {
  title: 'FileKit | Image Converter',
  description:
    'Convert, resize, and compress image batches locally in your browser without uploading files to a server.',
  keywords: ['image converter', 'jpg to png', 'resize image', 'compress image', 'webp converter'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
