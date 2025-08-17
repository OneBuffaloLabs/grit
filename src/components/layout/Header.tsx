import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <header className="bg-[var(--color-background)] py-4 px-8 shadow-md">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/assets/logos/logo-trans.svg"
            alt="Grit Logo"
            width={75}
            height={75}
            priority
          />
        </div>
        <div>
          <button
            onClick={onSettingsClick}
            className="text-2xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer"
            aria-label="Open settings">
            <FontAwesomeIcon icon={faCog} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
