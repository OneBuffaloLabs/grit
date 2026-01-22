'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileContract,
  faGavel,
  faTriangleExclamation,
  faHeartPulse,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const TermsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-[var(--color-background)] text-[var(--color-foreground)]">
        {/* Hero Section */}
        <div className="py-16 px-4 text-center bg-[var(--color-surface)]">
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron mb-4">Terms of Service</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Effective Date: January 22, 2026
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          {/* 1. Acceptance */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <FontAwesomeIcon icon={faFileContract} className="text-2xl" />
              <h2 className="text-2xl font-bold font-orbitron">1. Agreement to Terms</h2>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              By accessing or using the Grit application ("the App"), provided by One Buffalo Labs
              ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not
              agree to these terms, do not use the App.
            </p>
          </section>

          {/* 2. Medical Disclaimer (CRITICAL) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <FontAwesomeIcon icon={faHeartPulse} className="text-2xl" />
              <h2 className="text-2xl font-bold font-orbitron">2. Health & Safety Disclaimer</h2>
            </div>
            <div className="bg-[var(--color-surface)]/50 p-6 rounded-lg border-l-4 border-[var(--color-primary)]">
              <p className="text-[var(--color-foreground)] font-bold mb-2">
                Consult a Physician Before Starting
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Grit is a tracking utility, not a medical provider. The challenges tracked by this
                app (such as 75 Hard) involve rigorous physical activity and dietary changes. You
                expressly agree that your use of the App is at your sole risk.
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-2">
                We are not responsible for any injuries, health problems, or death that may result
                from your participation in these challenges. Always listen to your body and consult
                a healthcare professional.
              </p>
            </div>
          </section>

          {/* 3. Trademark Acknowledgement */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl" />
              <h2 className="text-2xl font-bold font-orbitron">3. Trademark Disclaimer</h2>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Grit is an unofficial companion tool designed to help users track their personal
              discipline goals.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)]">
              <li>
                <strong>"75 Hard"</strong> is a registered trademark of{' '}
                <strong>Andy Frisella</strong>.
              </li>
              <li>
                One Buffalo Labs and the Grit application are{' '}
                <strong>not affiliated with, endorsed by, or associated with</strong> Andy Frisella
                or the 75 Hard program in any way.
              </li>
            </ul>
          </section>

          {/* 4. Data Responsibility */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <FontAwesomeIcon icon={faDatabase} className="text-2xl" />
              <h2 className="text-2xl font-bold font-orbitron">4. User Data & Liability</h2>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Grit operates on a "Local-First" architecture. Your data is stored exclusively in your
              browser's local storage (IndexedDB).
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              <strong>We do not have a backup of your data.</strong> You are solely responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)]">
              <li>Ensuring your device is secure.</li>
              <li>Not clearing your browser's site data/cache for this domain.</li>
              <li>Exporting any data you wish to keep (if export features are available).</li>
            </ul>
            <p className="text-[var(--color-text-muted)] leading-relaxed mt-2">
              We shall not be liable for any loss of data, streaks, or progress logs resulting from
              device failure, browser updates, or user error.
            </p>
          </section>

          {/* 5. Governing Law */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <FontAwesomeIcon icon={faGavel} className="text-2xl" />
              <h2 className="text-2xl font-bold font-orbitron">5. Governing Law</h2>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              These Terms shall be governed by and defined following the laws of the State of New
              York. One Buffalo Labs and yourself irrevocably consent that the courts of New York
              shall have exclusive jurisdiction to resolve any dispute which may arise in connection
              with these terms.
            </p>
          </section>

          {/* 6. Contact */}
          <section className="space-y-4 border-t border-[var(--color-surface)] pt-8">
            <h2 className="text-xl font-bold font-orbitron text-[var(--color-foreground)]">
              Contact Us
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              For legal inquiries or questions regarding these terms, please open an issue on our
              public repository:
            </p>
            <a
              href="https://github.com/OneBuffaloLabs/grit/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-foreground)] transition-colors font-bold">
              <FontAwesomeIcon icon={faGithub} />
              <span>One Buffalo Labs Support</span>
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
