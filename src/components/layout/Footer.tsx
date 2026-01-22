import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import packageInfo from '../../../package.json';

/**
 * Global footer component displaying copyright, links, and the current app version.
 */
const Footer = () => {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearDisplay = startYear === currentYear ? startYear : `${startYear} - ${currentYear}`;

  return (
    <footer className="bg-[var(--color-surface)] text-[var(--color-text-muted)] py-8 px-8 mt-auto border-t border-[var(--color-background)]">
      <div className="container mx-auto text-center text-sm">
        {/* Data Persistence Message */}
        <div className="max-w-md mx-auto mb-8 text-xs bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-surface)]">
          <p className="flex items-center justify-center gap-2 mb-1 font-semibold text-[var(--color-foreground)]">
            <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--color-primary)]" />
            <span>Local Storage Only</span>
          </p>
          <p>
            Your data is stored securely on this device. Clearing browser data will erase your
            progress. Multi-device sync coming soon!
          </p>
        </div>

        <div className="grid gap-2">
          <p>
            &copy; {yearDisplay}{' '}
            <a
              href="https://onebuffalolabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-[var(--color-primary)] transition-colors">
              OneBuffaloLabs
            </a>
          </p>

          <div className="flex justify-center gap-4 text-xs">
            <a
              href="https://github.com/OneBuffaloLabs/grit"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-primary)] transition-colors">
              GitHub
            </a>
            <span>•</span>
            <a
              href="https://github.com/OneBuffaloLabs/grit/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-primary)] transition-colors">
              License
            </a>
            <span>•</span>
            <span
              className="flex items-center gap-1 text-[var(--color-text-muted)]"
              title={`Current Version: ${packageInfo.version}`}>
              <Link
                href="/changelog"
                className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors"
                title="View Changelog">
                <FontAwesomeIcon icon={faCodeBranch} className="w-3 h-3" />
                <span>v{packageInfo.version}</span>
              </Link>
            </span>
          </div>
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-wider opacity-50">
          Not affiliated with the official 75 HARD® program.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
