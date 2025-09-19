'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLock, faCheck, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getAllChallenges, startNewChallenge } from '@/lib/db';
import { ChallengeDoc } from '@/types';
import { ChallengeProvider } from '@/context/ChallengeContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ChallengeCard = ({ challenge }: { challenge: ChallengeDoc }) => {
  const { duration } = challenge;
  const completedDays = Object.values(challenge.days).filter((day) => day.completed).length;

  // Set progress to 100% if the challenge is completed
  const progressPercentage =
    challenge.status === 'completed' ? 100 : (completedDays / duration) * 100;

  const getStatusInfo = () => {
    switch (challenge.status) {
      case 'active':
        return {
          icon: <div className="w-3 h-3 bg-blue-500 rounded-full" title="Active"></div>,
          text: `Day ${completedDays + 1} of ${duration}`,
        };
      case 'completed':
        return {
          icon: <FontAwesomeIcon icon={faCheck} className="text-green-500" title="Completed" />,
          text: challenge.completionDate
            ? `Completed on ${new Date(challenge.completionDate).toLocaleDateString()}`
            : 'Challenge Completed',
        };
      case 'failed':
        return {
          icon: <FontAwesomeIcon icon={faTimes} className="text-red-500" title="Failed" />,
          text: `Failed after ${completedDays} days`,
        };
    }
  };

  const { icon, text } = getStatusInfo();

  return (
    <Link href={`/app/challenge/?id=${challenge._id}`} className="block h-full">
      <div className="bg-secondary rounded-lg shadow-lg p-6 h-full flex flex-col justify-between transform transition-transform hover:scale-105">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold font-orbitron text-foreground">{challenge.type}</h3>
            {icon}
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-4 mb-2">
            <div
              className="bg-primary h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={completedDays}
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-label={`${challenge.type} progress`}></div>
          </div>
          <p className="text-sm text-neutral-400 mb-2">{text}</p>
          <p className="text-sm text-text-muted">
            Started: {new Date(challenge.startDate).toLocaleDateString()}
          </p>
        </div>
        <button className="mt-4 bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded-lg transition-colors w-full cursor-pointer">
          View Challenge
        </button>
      </div>
    </Link>
  );
};

const NewChallengeModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChallenge = async (type: '75 Hard') => {
    setIsCreating(true);
    try {
      // For testing, creating a 3-day challenge
      const newChallenge = await startNewChallenge(type, 3);
      if (newChallenge) {
        router.push(`/app/challenge/?id=${newChallenge._id}`);
      }
    } catch (error) {
      console.error('Failed to create challenge', error);
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-surface p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="text-3xl font-bold font-orbitron text-center mb-6">Start a New Challenge</h3>
        <div className="space-y-4">
          <button
            onClick={() => handleCreateChallenge('75 Hard')}
            disabled={isCreating}
            className="w-full cursor-pointer text-left p-4 bg-secondary rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between disabled:cursor-not-allowed">
            <div>
              <p className="font-bold text-lg">75 Hard</p>
              <p className="text-sm text-text-muted">The original mental toughness challenge.</p>
            </div>
            {isCreating && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
          </button>
          <div className="w-full text-left p-4 bg-gray-800 rounded-lg flex items-center justify-between cursor-not-allowed opacity-50">
            <div>
              <p className="font-bold text-lg">75 Soft</p>
              <p className="text-sm text-text-muted">
                A more flexible approach to building discipline.
              </p>
            </div>
            <FontAwesomeIcon icon={faLock} />
          </div>
        </div>
        <div className="text-right mt-6">
          <button onClick={onClose} className="text-text-muted hover:text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function ChallengeListPage() {
  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      const allChallenges = await getAllChallenges();
      allChallenges.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setChallenges(allChallenges);
      setIsLoading(false);
    };
    fetchChallenges();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-orbitron">Loading Challenges...</p>
      </div>
    );
  }

  return (
    <>
      {isModalOpen && <NewChallengeModal onClose={() => setIsModalOpen(false)} />}
      <section className="bg-secondary text-foreground py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          <header className="text-center mb-12">
            <h2 className="text-5xl font-bold font-orbitron mb-4">Your Challenges</h2>
            <p className="text-lg text-text-muted">
              Start a new challenge or review your past progress.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="border-2 cursor-pointer border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-800 hover:border-gray-500 transition-colors p-6 min-h-[220px]">
              <FontAwesomeIcon icon={faPlus} className="text-4xl mb-2" />
              <span>Start New Challenge</span>
            </button>
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function AppPage() {
  return (
    <ChallengeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ChallengeListPage />
        </main>
        <Footer />
      </div>
    </ChallengeProvider>
  );
}
