import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearDisplay = startYear === currentYear ? startYear : `${startYear} - ${currentYear}`;

  return (
    <footer className="bg-[var(--color-background)] text-[var(--color-text-muted)] py-6 px-8 mt-auto">
      <div className="container mx-auto text-center text-sm">
        {/* Data Persistence Message */}
        <div className="bg-[var(--color-surface)] p-4 rounded-lg mb-6 text-xs text-[var(--color-foreground)]">
          <p className="flex items-center justify-center">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-[var(--color-primary)]" />
            <span>
              Your data is stored securely on this device. Clearing browser data will erase your
              progress.
            </span>
          </p>
          <p className="mt-1">Multi-device sync coming soon!</p>
        </div>

        <p className="mb-2">
          &copy; {yearDisplay}{' '}
          <a
            href="https://onebuffalolabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-primary-hover)] transition-colors">
            OneBuffaloLabs
          </a>
        </p>
        <p className="mb-4">
          <a
            href="https://github.com/OneBuffaloLabs/grit/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-primary-hover)] transition-colors">
            License
          </a>
        </p>
        <p className="italic text-xs">
          This app is an independent project created by OneBuffaloLabs and is not affiliated with,
          endorsed by, or sponsored by Andy Frisella or the official 75 HARD® program.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
