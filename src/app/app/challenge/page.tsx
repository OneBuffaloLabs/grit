'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { getChallengeById } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import DailyDashboard from '@/components/features/dashboard/DailyDashboard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CompletionModal from '@/components/ui/CompletionModal';
import ChallengeStatusBanner from '@/components/ui/ChallengeStatusBanner';

const ChallengeDetailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const { challenge, isLoading } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

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
      <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-2xl font-orbitron animate-pulse">Loading Challenge...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-xl max-w-md w-full border border-[var(--color-background)]">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-4xl text-[var(--color-text-muted)] mb-4"
            />
            <h2 className="text-2xl font-bold font-orbitron mb-2">Challenge Not Found</h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              We couldn&apos;t locate the challenge you are looking for. It may have been deleted or
              the ID is incorrect.
            </p>
            <button
              onClick={() => router.push('/app/')}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3 px-6 cursor-pointer rounded-lg transition-colors w-full flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faHome} />
              Return to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      {/* Header now manages Settings internally */}
      <Header />

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
      <ChallengeDetailContent />
    </Suspense>
  );
}
