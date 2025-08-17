'use client';

import React, { useEffect, useState } from 'react';
import {
  ChallengeProvider,
  useChallengeState,
  useChallengeDispatch,
} from '@/context/ChallengeContext';
import { getCurrentChallenge } from '@/lib/db';
import Welcome from '@/components/features/welcome/Welcome';
import DailyDashboard from '@/components/features/dashboard/DailyDashboard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/ui/SettingsModal';
import AnalyticsInitializer from '@/components/AnalyticsInitializer';

/**
 * This component handles the main application logic, deciding whether to show
 * the Welcome screen or the Daily Dashboard based on the challenge state.
 */
const AppContent = () => {
  const { challenge, isLoading } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // This effect runs once on component mount on the client-side
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

  // Show a loading state while we check for an existing challenge
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-orbitron">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-grow">{challenge ? <DailyDashboard /> : <Welcome />}</main>
      <Footer />
      {challenge && (
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      )}
      <AnalyticsInitializer />
    </div>
  );
};

/**
 * The main HomePage component that wraps our application content
 * with the state provider.
 */
export default function HomePage() {
  return (
    <ChallengeProvider>
      <AppContent />
    </ChallengeProvider>
  );
}
