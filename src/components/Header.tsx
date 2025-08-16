import React from 'react';
import Image from 'next/image';

const Header = () => {
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
      </nav>
    </header>
  );
};

export default Header;
