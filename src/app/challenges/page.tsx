import React from 'react';
import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'Your Challenges',
  description: 'View all your past and current challenges in the Grit app.',
};

// --- Mock Data ---
// In a real application, this data would come from your PouchDB database.
const challenges = [
  {
    id: 1,
    title: '75 Hard',
    status: 'active',
    progress: 42,
    total: 75,
  },
  {
    id: 2,
    title: '100 Days of Code',
    status: 'completed',
    progress: 100,
    total: 100,
  },
  {
    id: 3,
    title: 'Read 12 Books',
    status: 'failed',
    progress: 5,
    total: 12,
    completedDays: 98, // Days completed before failure
  },
  {
    id: 4,
    title: '30-Day Fitness Challenge',
    status: 'active',
    progress: 15,
    total: 30,
  },
];

const ChallengeCard = ({ challenge }: { challenge: (typeof challenges)[0] }) => {
  const progressPercentage = (challenge.progress / challenge.total) * 100;

  const getStatusIndicator = () => {
    switch (challenge.status) {
      case 'active':
        return <div className="w-3 h-3 bg-blue-500 rounded-full" title="Active"></div>;
      case 'completed':
        return <FontAwesomeIcon icon={faCheck} className="text-green-500" title="Completed" />;
      case 'failed':
        return <FontAwesomeIcon icon={faTimes} className="text-red-500" title="Failed" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[var(--color-secondary)] rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold font-orbitron text-[var(--color-foreground)]">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-2">
            {getStatusIndicator()}
            <button
              aria-label={`More options for ${challenge.title}`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-foreground)]">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>

        {/* --- Progress Bar --- */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className="bg-[var(--color-primary)] h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={challenge.progress}
            aria-valuemin={0}
            aria-valuemax={challenge.total}
            aria-label={`${challenge.title} progress`}></div>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {challenge.status === 'failed'
            ? `Failed after ${challenge.completedDays} days`
            : `Day ${challenge.progress} of ${challenge.total}`}
        </p>
      </div>

      {challenge.status === 'active' && (
        <button className="w-full bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-[var(--color-primary-hover)] transition-transform duration-300 transform hover:scale-105 cursor-pointer">
          Mark Day Complete
        </button>
      )}
    </div>
  );
};

export default function ChallengesPage() {
  return (
    <section
      aria-labelledby="challenges-title"
      className="bg-[var(--color-background)] text-[var(--color-foreground)] py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <h2 id="challenges-title" className="text-5xl font-bold font-orbitron mb-4">
            Your Grit Challenges
          </h2>
          <p className="text-lg text-[var(--color-text-muted)]">
            Track your progress, stay motivated, and conquer your goals.
          </p>
        </header>

        {/* --- Challenges Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
    </section>
  );
}
