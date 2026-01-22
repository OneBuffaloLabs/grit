'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCodeBranch, faDatabase } from '@fortawesome/free-solid-svg-icons';
import packageInfo from '../../../package.json';

const Footer = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold font-orbitron mb-4 text-[var(--color-foreground)]">
              GRIT
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-xs mb-4">
              A privacy-first, offline-capable tracker for 75 Hard, 75 Soft, and 75 Balanced. Built
              to help you build mental toughness without sacrificing your data.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/OneBuffaloLabs/grit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="GitHub">
                <FontAwesomeIcon icon={faGithub} className="text-xl" />
              </a>
              <a
                href="https://twitter.com/onebuffalolabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Twitter">
                <FontAwesomeIcon icon={faXTwitter} className="text-xl" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-bold text-[var(--color-foreground)] mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <Link
                  href="/changelog"
                  className="hover:text-[var(--color-primary)] transition-colors">
                  Updates & Timeline
                </Link>
              </li>
              <li>
                <Link href="/app/" className="hover:text-[var(--color-primary)] transition-colors">
                  Start Challenge
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/OneBuffaloLabs/grit/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-primary)] transition-colors">
                  Report a Bug
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-bold text-[var(--color-foreground)] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[var(--color-primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section (NEW) */}
        <div className="border-t border-[var(--color-background)] py-6 text-xs text-[var(--color-text-muted)] text-center opacity-60">
          <p>
            Grit is an unofficial companion app and is not affiliated with, endorsed by, or
            associated with 75 Hard, Andy Frisella, or the 75 Hard program. &quot;75 Hard&quot; is a
            registered trademark of Andy Frisella.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Stats */}
        <div className="border-t border-[var(--color-background)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-text-muted)]">
          <div>
            &copy; {year}{' '}
            <a
              href="https://onebuffalolabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-primary)] transition-colors font-bold">
              One Buffalo Labs
            </a>
            . All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1" title="Data stored locally">
              <FontAwesomeIcon icon={faDatabase} className="w-3 h-3" />
              <span>Local-First</span>
            </span>
            <span>•</span>
            <Link
              href="/changelog"
              className="flex items-center gap-1 hover:text-[var(--color-foreground)] transition-colors"
              title="View Changelog">
              <FontAwesomeIcon icon={faCodeBranch} className="w-3 h-3" />
              <span>v{packageInfo.version}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
