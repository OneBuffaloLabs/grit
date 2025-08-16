'use client';

import React, { useEffect } from 'react';
import {
  ChallengeProvider,
  useChallengeState,
  useChallengeDispatch,
} from '@/context/ChallengeContext';
import { getCurrentChallenge } from '@/lib/db';
import Welcome from '@/components/Welcome';
import DailyDashboard from '@/components/DailyDashboard';

const AppContent = () => {
  const { challenge, isLoading } = useChallengeState();
  const dispatch = useChallengeDispatch();

  useEffect(() => {
    const fetchChallenge = async () => {
      dispatch({ type: 'START_LOADING' });
      const currentChallenge = await getCurrentChallenge();
      dispatch({ type: 'SET_CHALLENGE', payload: currentChallenge });
    };

    fetchChallenge();
  }, [dispatch]);

  if (isLoading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <p className="text-2xl font-orbitron">Loading...</p>
      </main>
    );
  }

  return <main className="flex-grow">{challenge ? <DailyDashboard /> : <Welcome />}</main>;
};

export default function HomePage() {
  return (
    <ChallengeProvider>
      <AppContent />
    </ChallengeProvider>
  );
}
