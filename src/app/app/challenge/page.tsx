'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ChallengeProvider,
  useChallengeState,
  useChallengeDispatch,
} from '@/context/ChallengeContext';
import { getChallengeById } from '@/lib/db';
import DailyDashboard from '@/components/features/dashboard/DailyDashboard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/ui/SettingsModal';
import Notification from '@/components/ui/Notification';
import type { NotificationProps } from '@/components/ui/Notification';
import CompletionModal from '@/components/ui/CompletionModal';
import ChallengeStatusBanner from '@/components/ui/ChallengeStatusBanner';

const ChallengeDetailContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { challenge, isLoading } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [notification, setNotification] = useState<Omit<NotificationProps, 'onClose'> | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) {
        dispatch({ type: 'SET_CHALLENGE', payload: null });
        return;
      }
      dispatch({ type: 'START_LOADING' });
      try {
        const fetchedChallenge = await getChallengeById(id);
        dispatch({ type: 'SET_CHALLENGE', payload: fetchedChallenge });
      } catch (error) {
        console.error('Failed to fetch challenge data:', error);
        dispatch({ type: 'STOP_LOADING' });
      }
    };

    fetchChallenge();
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-orbitron">Loading Challenge...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-orbitron">Challenge not found or ID is missing.</p>
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
      <main className="flex-grow">
        {challenge.status === 'completed' && (
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <ChallengeStatusBanner status="completed" />
            <button
              onClick={() => setIsCompletionModalOpen(true)}
              className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary-hover transition-colors cursor-pointer mt-4">
              View Your Summary
            </button>
          </div>
        )}
        <DailyDashboard onFinishChallenge={() => setIsCompletionModalOpen(true)} />
      </main>
      <Footer />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        showNotification={setNotification}
      />
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        challenge={challenge}
      />
    </div>
  );
};

// Use Suspense to handle the client-side nature of search parameters
export default function ChallengeDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChallengeProvider>
        <ChallengeDetailContent />
      </ChallengeProvider>
    </Suspense>
  );
}
