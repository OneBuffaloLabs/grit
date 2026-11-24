'use client';

// --- React ---
import React, { useState, useEffect } from 'react';

// --- Next / Framework ---
import Link from 'next/link';

// --- Icons ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// --- Context / Hooks ---
import { useChallengeController } from '@/context/ChallengeContext';

// --- Components ---
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChallengeCard from '@/components/features/dashboard/ChallengeCard';

// --- Database & Types ---
import { getAllChallenges } from '@/lib/db';
import type { ChallengeDoc } from '@/types';

function ChallengeListPage() {
  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteChallenge } = useChallengeController();

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      const allChallenges = await getAllChallenges();
      allChallenges.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
      setChallenges(allChallenges);
      setIsLoading(false);
    };
    void fetchChallenges();
  }, []);

  const handleDeleteChallenge = async (id: string) => {
    const previous = [...challenges];
    setChallenges((prev) => prev.filter((c) => c._id !== id));

    try {
      await deleteChallenge(id);
    } catch (err) {
      console.error('Failed to delete challenge:', err);
      setChallenges(previous);
      alert('Failed to delete challenge. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-orbitron animate-pulse">Loading Challenges...</p>
      </div>
    );
  }

  return (
    <section className="bg-secondary text-foreground py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <h2 className="text-5xl font-bold font-orbitron mb-4">Your Journey</h2>
          <p className="text-lg text-text-muted">
            Track your active progress or look back at your grit.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/app/setup"
            className="border-2 cursor-pointer border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-800 hover:border-gray-500 transition-colors p-6 min-h-[220px] group">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4 group-hover:bg-gray-600 transition-colors">
              <FontAwesomeIcon icon={faPlus} className="text-2xl text-white" />
            </div>
            <span className="font-bold text-lg group-hover:text-white transition-colors">
              Start New Challenge
            </span>
          </Link>

          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              onDelete={handleDeleteChallenge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AppPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ChallengeListPage />
      </main>
      <Footer />
    </div>
  );
}
