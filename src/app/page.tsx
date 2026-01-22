import React from 'react';
import Welcome from '@/components/features/welcome/Welcome';
import Methodology from '@/components/features/welcome/Methodology';
import HowItWorks from '@/components/features/welcome/HowItWorks';
import OpenSource from '@/components/features/welcome/OpenSource';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * The main HomePage component that serves as the landing page for the application.
 * It is a Server Component that renders Client Components where interactivity is needed.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero and Rules Section (The "What") */}
        <Welcome />

        {/* Local-First Architecture Explainer (The "How") */}
        <HowItWorks />

        {/* Psychology and Persona Guide (The "Why" and "Who") */}
        <Methodology />

        {/* Open Source and Privacy Details */}
        <OpenSource />
      </main>
      <Footer />
    </div>
  );
}
