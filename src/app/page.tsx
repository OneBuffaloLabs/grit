import React from 'react';
import { ChallengeProvider } from '@/context/ChallengeContext';
import Welcome from '@/components/features/welcome/Welcome';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnalyticsInitializer from '@/components/AnalyticsInitializer';

/**
 * The main HomePage component that serves as the landing page for the application.
 * It is a Server Component that renders Client Components where interactivity is needed.
 */
export default function HomePage() {
  return (
    <ChallengeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Welcome />
        </main>
        <Footer />
        <AnalyticsInitializer />
      </div>
    </ChallengeProvider>
  );
}
