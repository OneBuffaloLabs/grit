'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { registerServiceWorker } from '@/lib/notifications';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';

const AppInitializer = ({ children }: { children: ReactNode }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      {children}
      <Footer />
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
};

export default AppInitializer;
