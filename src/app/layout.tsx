// --- Next ---
import type { Metadata, Viewport } from 'next';
import { Orbitron } from 'next/font/google';
// --- Components ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnalyticsInitializer from '@/components/AnalyticsInitializer';
// --- Utils ---
import { generateMetadata } from '@/utils/metadata';
import { generateViewport } from '@/utils/viewport';
// --- Styles ---
import './globals.css';

// Font Awesome CSS fix
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

// Font Definitions
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
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <AnalyticsInitializer />
      </body>
    </html>
  );
}
