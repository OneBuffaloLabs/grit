'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getArchivedChallenges } from '@/lib/db';
import { ChallengeDoc } from '@/types';

const ChallengeCard = ({ challenge }: { challenge: ChallengeDoc }) => {
  // Assuming a standard 75-day challenge if total is not specified
  const totalDays = 75;

  // Calculate the number of completed days
  const completedDays = Object.values(challenge.days).filter((day) => day.completed).length;
  const progressPercentage = (completedDays / totalDays) * 100;

  return (
    <div className="bg-[var(--color-secondary)] rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold font-orbitron text-[var(--color-foreground)]">
            Challenge Started: {new Date(challenge.startDate).toLocaleDateString()}
          </h3>
          <button
            aria-label={`More options for this challenge`}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-foreground)]">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className="bg-[var(--color-primary)] h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={completedDays}
            aria-valuemin={0}
            aria-valuemax={totalDays}></div>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
          {challenge.status === 'failed' ? (
            <>
              <FontAwesomeIcon icon={faTimes} className="text-red-500" title="Failed" />
              <span>
                Failed after {completedDays} of {totalDays} days
              </span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} className="text-green-500" title="Completed" />
              <span>
                Completed: {completedDays} of {totalDays} days
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

const ChallengeList = () => {
  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      const archived = await getArchivedChallenges();
      // Sort by start date, newest first
      archived.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setChallenges(archived);
      setIsLoading(false);
    };
    fetchChallenges();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[var(--color-text-muted)]">Loading Challenge History...</p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="challenges-title"
      className="bg-[var(--color-background)] text-[var(--color-foreground)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <h2 id="challenges-title" className="text-5xl font-bold font-orbitron mb-4">
            Challenge History
          </h2>
          <p className="text-lg text-[var(--color-text-muted)]">
            You have no active challenge. Start a new one from the homepage or review your past
            attempts.
          </p>
        </header>

        {challenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-[var(--color-text-muted)]">
            You have no archived challenges.
          </p>
        )}
      </div>
    </section>
  );
};

export default ChallengeList;
