'use client';

import React, { useEffect, useState } from 'react';
import {
  ChallengeProvider,
  useChallengeState,
  useChallengeDispatch,
} from '@/context/ChallengeContext';
import { getCurrentChallenge } from '@/lib/db';
import DailyDashboard from '@/components/features/dashboard/DailyDashboard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/ui/SettingsModal';
import AnalyticsInitializer from '@/components/AnalyticsInitializer';
import Notification from '@/components/ui/Notification';
import type { NotificationProps } from '@/components/ui/Notification';
import ChallengeList from '@/components/features/challenges/ChallengeList';

/**
 * This component handles the main application logic, deciding whether to show
 * the Daily Dashboard (for an active challenge) or the ChallengeList.
 */
const AppContent = () => {
  const { challenge, isLoading } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notification, setNotification] = useState<Omit<NotificationProps, 'onClose'> | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      dispatch({ type: 'START_LOADING' });
      try {
        const currentChallenge = await getCurrentChallenge();
        dispatch({ type: 'SET_CHALLENGE', payload: currentChallenge });
      } catch (error) {
        console.error('Failed to fetch challenge data:', error);
        dispatch({ type: 'STOP_LOADING' });
      }
    };

    fetchChallenge();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-orbitron">Loading Grit...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-grow">{challenge ? <DailyDashboard /> : <ChallengeList />}</main>
      <Footer />
      {challenge && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          showNotification={setNotification}
        />
      )}
      <AnalyticsInitializer />
    </div>
  );
};

export default function AppPage() {
  return (
    <ChallengeProvider>
      <AppContent />
    </ChallengeProvider>
  );
}
