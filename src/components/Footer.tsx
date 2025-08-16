import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-background)] text-[var(--color-text-muted)] py-6 px-8 mt-auto">
      <div className="container mx-auto text-center text-sm">
        <p className="mb-2">&copy; 2025 OneBuffaloLabs</p>
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
