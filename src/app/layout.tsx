import type { Metadata, Viewport } from 'next';
import { Orbitron } from 'next/font/google';
import AnalyticsInitializer from '@/components/AnalyticsInitializer';
import { generateMetadata } from '@/utils/metadata';
import { generateViewport } from '@/utils/viewport';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import AppInitializer from '@/components/AppInitializer';

config.autoAddCss = false;
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} font-sans antialiased flex flex-col min-h-screen bg-[var(--color-surface)] text-foreground`}>
        {/* AppInitializer now handles all client-side logic */}
        <AppInitializer>{children}</AppInitializer>
        <AnalyticsInitializer />
      </body>
    </html>
  );
}
