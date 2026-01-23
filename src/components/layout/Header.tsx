'use client';

import React, { useState, Suspense } from 'react'; // Added Suspense
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faRocket, faHouse, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useChallengeState } from '@/context/ChallengeContext';
import SettingsModal from '@/components/ui/SettingsModal';
import Notification, { NotificationProps } from '@/components/ui/Notification';

const Header = () => {
  const { challenge } = useChallengeState();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notification, setNotification] = useState<Omit<NotificationProps, 'onClose'> | null>(null);

  // Route Helpers
  const isHomePage = pathname === '/';
  const isInApp = pathname?.startsWith('/app');
  // Check if we are on the dashboard list vs details
  const isDashboardList = pathname === '/app' || pathname === '/app/';

  // Pass the challenge to settings ONLY if we are NOT on the main list page
  // This ensures the "Global Settings" (Delete All) show up on the list page
  const settingsChallengeContext = isDashboardList ? null : challenge;

  const showNotification = (notif: Omit<NotificationProps, 'onClose'>) => {
    setNotification(notif);
    // Auto-hide after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <header className="bg-[var(--color-background)] py-4 px-8 shadow-md sticky top-0 z-50">
        <nav className="container mx-auto flex items-center justify-between">
          {/* LOGO */}
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
            {/* 1. HOME LINK (Shows everywhere except Homepage) */}
            {!isHomePage && (
              <Link
                href="/"
                className="hidden md:flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-bold text-sm">
                <FontAwesomeIcon icon={faHouse} />
                <span>Home</span>
              </Link>
            )}

            {/* 2. LAUNCH APP (Shows on Home/Changelog) */}
            {!isInApp && (
              <Link
                href={challenge ? '/app' : '/app/'}
                className="bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <FontAwesomeIcon icon={challenge ? faArrowRight : faRocket} />
                <span>{challenge ? 'Dashboard' : 'Launch App'}</span>
              </Link>
            )}

            {/* 3. SETTINGS COG (Only visible inside the app) */}
            {isInApp && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-2xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer transition-colors p-2"
                aria-label="Open settings">
                <FontAwesomeIcon icon={faCog} />
              </button>
            )}
          </div>
        </nav>
      </header>

      <Suspense fallback={null}>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          challengeOverride={settingsChallengeContext}
          showNotification={showNotification}
        />
      </Suspense>

      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default Header;
