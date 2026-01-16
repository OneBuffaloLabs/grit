'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCode, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Renders the Open Source and Privacy information section.
 * Highlights the project's transparency and GitHub presence.
 */
const OpenSource = () => {
  return (
    <section className="bg-[var(--color-background)] py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-surface)]">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Privacy Column */}
          <div className="text-left space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)] mb-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-2xl" />
              <h3 className="text-2xl font-bold font-orbitron">Privacy First</h3>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Grit is built on a &quot;Local-First&quot; architecture. We do not have servers, and
              we do not sell your data. Everything you track exists solely on your device in an
              encrypted PouchDB database.
            </p>
          </div>

          {/* Open Source Column */}
          <div className="text-left space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)] mb-2">
              <FontAwesomeIcon icon={faCode} className="text-2xl" />
              <h3 className="text-2xl font-bold font-orbitron">Open Source</h3>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              We believe in transparency. You can inspect our code, contribute features, or report
              issues directly on GitHub. Built with TypeScript, Next.js, and Tailwind.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/OneBuffaloLabs/grit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#24292F] hover:bg-[#24292F]/80 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
                <FontAwesomeIcon icon={faGithub} className="text-xl" />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
