'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCode, faCodeBranch, faBug, faLightbulb } from '@fortawesome/free-solid-svg-icons';

/**
 * Renders the Open Source and Community section.
 * Replaces the "Privacy" column (now in HowItWorks) with a "Contribution" column.
 */
const OpenSource = () => {
  return (
    <section className="bg-[var(--color-background)] py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-surface)]">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Column 1: The Code (Tech Stack & Repo) */}
          <div className="text-left space-y-4 bg-[var(--color-surface)]/30 p-8 rounded-2xl border border-[var(--color-surface)] h-full flex flex-col">
            <div className="flex items-center gap-3 text-[var(--color-primary)] mb-2">
              <FontAwesomeIcon icon={faCode} className="text-2xl" />
              <h3 className="text-2xl font-bold font-orbitron">Open Source</h3>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed flex-grow">
              We believe in total transparency. You can inspect our code to verify our privacy
              claims, audit the security, or fork the repo to build your own version.
              <br />
              <br />
              <span className="text-xs font-mono bg-[var(--color-background)] p-1 rounded">
                TypeScript
              </span>{' '}
              <span className="text-xs font-mono bg-[var(--color-background)] p-1 rounded">
                Next.js 15
              </span>{' '}
              <span className="text-xs font-mono bg-[var(--color-background)] p-1 rounded">
                Tailwind
              </span>
            </p>
            <div className="pt-4">
              <a
                href="https://github.com/OneBuffaloLabs/grit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#24292F] hover:bg-[#24292F]/80 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
                <FontAwesomeIcon icon={faGithub} className="text-xl" />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>

          {/* Column 2: The Community (Contribution & Issues) */}
          <div className="text-left space-y-4 bg-[var(--color-surface)]/30 p-8 rounded-2xl border border-[var(--color-surface)] h-full flex flex-col">
            <div className="flex items-center gap-3 text-[var(--color-primary)] mb-2">
              <FontAwesomeIcon icon={faCodeBranch} className="text-2xl" />
              <h3 className="text-2xl font-bold font-orbitron">Help Us Build Grit</h3>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed flex-grow">
              Grit is built by the community, for the community. Found a bug? Have a great idea for
              a feature? We want your help to make this the best privacy-focused tracker on the web.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4">
              <a
                href="https://github.com/OneBuffaloLabs/grit/issues/new?template=bug_report.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-background)] hover:bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-surface)] font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
                <FontAwesomeIcon icon={faBug} className="text-red-400" />
                <span>Report Bug</span>
              </a>
              <a
                href="https://github.com/OneBuffaloLabs/grit/issues/new?template=feature_request.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-background)] hover:bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-surface)] font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
                <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400" />
                <span>Request Feature</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
