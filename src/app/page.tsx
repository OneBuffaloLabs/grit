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

/**
 * This component handles the main application logic, deciding whether to show
 * the Welcome screen or the Daily Dashboard based on the challenge state.
 */
const AppContent = () => {
  const { challenge, isLoading } = useChallengeState();
  const dispatch = useChallengeDispatch();

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

  // If a challenge exists, show the dashboard. Otherwise, show the welcome screen.
  return challenge ? <DailyDashboard /> : <Welcome />;
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
