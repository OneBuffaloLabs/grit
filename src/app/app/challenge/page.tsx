'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { getChallengeById } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faExclamationCircle,
  faCalendarAlt,
  faTrophy,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

import DailyDashboard from '@/components/features/dashboard/DailyDashboard';
import WeightTracker from '@/components/features/dashboard/WeightTracker';
import Journal from '@/components/features/dashboard/Journal';
import PhotoGallery from '@/components/ui/PhotoGallery';
import GritTimeline from '@/components/features/dashboard/GritTimeline';

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
  const [selectedDay, setSelectedDay] = useState(1);
  const [isFetchingId, setIsFetchingId] = useState(false); // Local loading state for ID fetch

  // --- Data Fetching ---
  useEffect(() => {
    let isMounted = true;

    const fetchChallenge = async () => {
      if (!id) {
        dispatch({ type: 'SET_CHALLENGE', payload: null });
        return;
      }

      // If we already have the correct challenge loaded, don't re-fetch
      if (challenge && challenge._id === id) {
        return;
      }

      setIsFetchingId(true);
      // dispatch({ type: 'START_LOADING' }); // Don't trigger global loading if we can help it, prevents flash

      try {
        const fetchedChallenge = await getChallengeById(id);
        if (isMounted) {
          dispatch({ type: 'SET_CHALLENGE', payload: fetchedChallenge });
        }
      } catch (error) {
        console.error('Failed to fetch challenge data:', error);
      } finally {
        if (isMounted) setIsFetchingId(false);
      }
    };

    fetchChallenge();

    return () => {
      isMounted = false;
    };
  }, [id, challenge, dispatch]);
  // Dependency on 'challenge' ensures that if Context overwrites us with 'Active' challenge,
  // we re-fire and fetch the correct ID again.

  // --- Calculate Active Day ---
  const nextDayToShow = useMemo(() => {
    if (!challenge) return 1;
    const completedDays = Object.keys(challenge.days)
      .map(Number)
      .filter((day) => challenge.days[day]?.completed);

    if (completedDays.length === 0) return 1;

    const highestCompletedDay = Math.max(...completedDays);
    return Math.min(highestCompletedDay + 1, challenge.duration);
  }, [challenge]);

  useEffect(() => {
    setSelectedDay(nextDayToShow);
  }, [nextDayToShow]);

  // --- Loading / Error States ---
  // We show loading if global is loading OR if we are specifically fetching the ID
  // AND we don't currently have the *correct* challenge displayed.
  const isWrongChallenge = challenge && id && challenge._id !== id;

  if (isLoading || isFetchingId || isWrongChallenge) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-2xl font-orbitron animate-pulse text-[var(--color-primary)]">
            Loading Protocol...
          </p>
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
          <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-xl max-w-md w-full border border-[var(--color-surface-border)]">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-4xl text-[var(--color-text-muted)] mb-4"
            />
            <h2 className="text-2xl font-bold font-orbitron mb-2">Challenge Not Found</h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              We couldn&apos;t locate the challenge.
            </p>
            <button
              onClick={() => router.push('/app/')}
              className="bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faHome} /> Return to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Layout Configuration ---
  const showWeight = challenge.rules.trackWeight;
  const showMeasurements = challenge.rules.trackMeasurements;
  const showJournal = challenge.rules.useDailyJournal;
  const hasSidebarFeatures = showWeight || showMeasurements || showJournal;
  const isReadOnly = challenge.status !== 'active';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="flex-grow pb-12">
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-background)] mb-8">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-bold text-sm">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-orbitron text-[var(--color-text)] mb-2">
                  {challenge.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} /> {challenge.duration} Days
                  </span>
                  <span className="flex items-center gap-2 uppercase tracking-wider font-bold text-[var(--color-primary)]">
                    <FontAwesomeIcon icon={faTrophy} /> {challenge.type} Mode
                  </span>
                </div>
              </div>

              {challenge.status !== 'active' && (
                <div className="w-full md:w-auto">
                  <ChallengeStatusBanner status={challenge.status} />
                  {challenge.status === 'completed' && (
                    <button
                      onClick={() => setIsCompletionModalOpen(true)}
                      className="w-full mt-2 text-sm bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer">
                      View Summary
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-background)]">
              <GritTimeline selectedDay={selectedDay} onDaySelect={setSelectedDay} />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <div
            className={`grid grid-cols-1 ${hasSidebarFeatures ? 'lg:grid-cols-3' : 'lg:grid-cols-1 lg:max-w-4xl lg:mx-auto'} gap-8`}>
            <div className="lg:col-span-2 space-y-8">
              <DailyDashboard
                selectedDay={selectedDay}
                onDaySelect={setSelectedDay}
                onFinishChallenge={() => setIsCompletionModalOpen(true)}
                isReadOnly={isReadOnly}
              />
              <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-surface-border)] shadow-sm">
                <h3 className="text-lg font-bold font-orbitron mb-4 border-b border-[var(--color-background)] pb-2">
                  Photo Gallery
                </h3>
                <PhotoGallery currentDay={selectedDay} isReadOnly={isReadOnly} />
              </div>
            </div>

            {hasSidebarFeatures && (
              <div className="space-y-6">
                {(showWeight || showMeasurements) && (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-surface-border)] shadow-sm">
                    <WeightTracker currentDay={selectedDay} isReadOnly={isReadOnly} />
                  </div>
                )}

                {showJournal && (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-surface-border)] shadow-sm">
                    <Journal currentDay={selectedDay} isReadOnly={isReadOnly} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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

export default function ChallengeDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-background)]" />}>
      <ChallengeDetailContent />
    </Suspense>
  );
}
