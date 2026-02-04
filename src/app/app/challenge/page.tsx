'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { getChallengeById } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faExclamationCircle,
  faCalendarAlt,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';

// Feature Components
import DailyDashboard from '@/components/features/dashboard/DailyDashboard';
import WeightTracker from '@/components/features/dashboard/WeightTracker';
import Journal from '@/components/features/dashboard/Journal';
import PhotoGallery from '@/components/ui/PhotoGallery';

// Layout & UI
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

  // --- Data Fetching ---
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

  // --- Calculate Active Day ---
  // Logic lifted from DailyDashboard
  const nextDayToShow = useMemo(() => {
    if (!challenge) return 1;
    const completedDays = Object.keys(challenge.days)
      .map(Number)
      .filter((day) => challenge.days[day]?.completed);

    if (completedDays.length === 0) return 1;

    const highestCompletedDay = Math.max(...completedDays);
    return Math.min(highestCompletedDay + 1, challenge.duration);
  }, [challenge]);

  // Set initial selected day when challenge loads
  useEffect(() => {
    setSelectedDay(nextDayToShow);
  }, [nextDayToShow]);

  // --- Loading / Error States ---
  if (isLoading) {
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
        {/* Header Banner */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-background)] mb-8">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                      className="w-full mt-2 text-sm bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded">
                      View Summary
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div
            className={`grid grid-cols-1 ${hasSidebarFeatures ? 'lg:grid-cols-3' : 'lg:grid-cols-1 lg:max-w-4xl lg:mx-auto'} gap-8`}>
            {/* Primary Column */}
            <div className="lg:col-span-2 space-y-8">
              <DailyDashboard
                selectedDay={selectedDay}
                onDaySelect={setSelectedDay}
                onFinishChallenge={() => setIsCompletionModalOpen(true)}
                isReadOnly={isReadOnly}
              />
              {/* Photo Gallery moved to main column as it is visual/large */}
              <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-background)] shadow-sm">
                <h3 className="text-lg font-bold font-orbitron mb-4 border-b border-[var(--color-background)] pb-2">
                  Photo Gallery
                </h3>
                <PhotoGallery currentDay={selectedDay} isReadOnly={isReadOnly} />
              </div>
            </div>

            {/* Sidebar Column */}
            {hasSidebarFeatures && (
              <div className="space-y-6">
                {(showWeight || showMeasurements) && (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-background)] shadow-sm">
                    <h3 className="text-lg font-bold font-orbitron mb-4 border-b border-[var(--color-background)] pb-2">
                      Body Metrics
                    </h3>
                    <WeightTracker currentDay={selectedDay} isReadOnly={isReadOnly} />
                  </div>
                )}

                {showJournal && (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-background)] shadow-sm">
                    <h3 className="text-lg font-bold font-orbitron mb-4 border-b border-[var(--color-background)] pb-2">
                      Daily Journal
                    </h3>
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
