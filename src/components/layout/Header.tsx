'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faRocket,
  faHistory,
  faTasks,
  faHouse,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useChallengeState } from '@/context/ChallengeContext';

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  const { challenge } = useChallengeState();
  const pathname = usePathname();

  // Route Helpers
  const isHomePage = pathname === '/';
  const isInApp = pathname?.startsWith('/app'); // True for /app, /app/history, etc.
  const isHistoryPage = pathname === '/app/history';
  // Note: pathname often comes without trailing slash, so we check both just in case
  const isDashboard = pathname === '/app' || pathname === '/app/';

  return (
    <header className="bg-[var(--color-background)] py-4 px-8 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between">
        {/* LOGO (Preserved) */}
        <Link href="/" className="flex items-center group" aria-label="Grit Homepage">
          <Image
            src="/assets/logos/logo-trans.svg"
            alt="Grit Logo"
            width={75}
            height={75}
            priority
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* NAVIGATION ITEMS */}
        <div className="flex items-center gap-6">
          {/* 1. HOME LINK (New: Shows everywhere except Homepage) */}
          {!isHomePage && (
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-bold text-sm">
              <FontAwesomeIcon icon={faHouse} />
              <span>Home</span>
            </Link>
          )}

          {/* 2. LAUNCH APP (Updated: Shows on Home AND Changelog) */}
          {!isInApp && (
            <Link
              href={challenge ? '/app' : '/app/'}
              className="bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <FontAwesomeIcon icon={challenge ? faArrowRight : faRocket} />
              <span>{challenge ? 'Dashboard' : 'Launch App'}</span>
            </Link>
          )}

          {/* 3. APP NAVIGATION (Only visible inside the app) */}

          {/* History Link */}
          {challenge && isDashboard && (
            <Link
              href="/app/history"
              className="text-md text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer flex items-center gap-2 transition-colors"
              title="View Challenge History">
              <FontAwesomeIcon icon={faHistory} />
              <span>History</span>
            </Link>
          )}

          {/* Current Dashboard Link */}
          {challenge && isHistoryPage && (
            <Link
              href="/app"
              className="text-md text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer flex items-center gap-2 transition-colors"
              title="View Current Challenge">
              <FontAwesomeIcon icon={faTasks} />
              <span>Current</span>
            </Link>
          )}

          {/* Settings (Only show if we are INSIDE the app) */}
          {isInApp && challenge && (
            <button
              onClick={onSettingsClick}
              className="text-2xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer transition-colors"
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
