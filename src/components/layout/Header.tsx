'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faRocket, faHistory, faTasks } from '@fortawesome/free-solid-svg-icons';
import { useChallengeState } from '@/context/ChallengeContext';

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  const { challenge } = useChallengeState();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isHistoryPage = pathname === '/app/history/';
  const isAppPage = pathname === '/app/';

  return (
    <header className="bg-[var(--color-background)] py-4 px-8 shadow-md">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Grit Homepage">
          <Image
            src="/assets/logos/logo-trans.svg"
            alt="Grit Logo"
            width={75}
            height={75}
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          {isHomePage && (
            <Link
              href="/app"
              className="bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faRocket} />
              <span>Launch App</span>
            </Link>
          )}

          {challenge && isAppPage && (
            <Link
              href="/app/history"
              className="text-md text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer flex items-center gap-2"
              title="View Challenge History">
              <FontAwesomeIcon icon={faHistory} />
              <span>History</span>
            </Link>
          )}

          {challenge && isHistoryPage && (
            <Link
              href="/app"
              className="text-md text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer flex items-center gap-2"
              title="View Current Challenge">
              <FontAwesomeIcon icon={faTasks} />
              <span>Current</span>
            </Link>
          )}

          {!isHomePage && challenge && (
            <button
              onClick={onSettingsClick}
              className="text-2xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer"
              aria-label="Open settings">
              <FontAwesomeIcon icon={faCog} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
