// --- Next ---
import type { Metadata, Viewport } from 'next';
import { Orbitron, Geist_Mono } from 'next/font/google';
// --- Components ---
// import { Header } from '@/components/Header';
// import { Footer } from '@/components/Footer';
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
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
});
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

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
        className={`${orbitron.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
        {/* <Header /> */}
        <main className="flex-grow">{children}</main>
        {/* <Footer /> */}
        <AnalyticsInitializer />
      </body>
    </html>
  );
}
