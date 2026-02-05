'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faRunning } from '@fortawesome/free-solid-svg-icons';
import { getAllChallenges } from '@/lib/db';
import { ChallengeDoc } from '@/types';
import { THEME } from '@/data/theme';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ChallengeCard = ({ challenge }: { challenge: ChallengeDoc }) => {
  const { duration, type, name } = challenge;
  // Fallback to 'hard' theme if type isn't found
  const theme = THEME[type] || THEME.hard;
  const completedDays = Object.values(challenge.days).filter((day) => day.completed).length;

  const progressPercentage =
    challenge.status === 'completed' ? 100 : (completedDays / duration) * 100;

  // Updated Status Logic
  const getStatusInfo = () => {
    switch (challenge.status) {
      case 'active':
        return {
          label: 'Active',
          // Added size="lg" as requested
          icon: (
            <FontAwesomeIcon icon={faRunning} size="lg" className={theme.color} title="Active" />
          ),
          details: `Day ${completedDays + 1} of ${duration}`,
          statusColor: theme.color,
        };
      case 'completed':
        return {
          label: 'Completed',
          // Added size="lg"
          icon: (
            <FontAwesomeIcon icon={faCheck} size="lg" className={theme.color} title="Completed" />
          ),
          details: challenge.completionDate
            ? new Date(challenge.completionDate).toLocaleDateString()
            : 'Mission Accomplished',
          statusColor: theme.color,
        };
      case 'failed':
        return {
          label: 'Failed',
          // Added size="lg"
          icon: <FontAwesomeIcon icon={faTimes} size="lg" className={theme.color} title="Failed" />,
          details: `Failed after ${completedDays} days`,
          statusColor: theme.color,
        };
      default:
        return {
          label: 'Unknown',
          icon: null,
          details: '',
          statusColor: 'text-gray-500',
        };
    }
  };

  // Dynamic Button Text Logic
  const getButtonText = () => {
    switch (challenge.status) {
      case 'completed':
        return 'View Journey';
      case 'failed':
        return 'View Attempt';
      default:
        return 'Track Progress';
    }
  };

  const { label, icon, details, statusColor } = getStatusInfo();

  return (
    <Link href={`/app/challenge/?id=${challenge._id}`} className="block h-full">
      <div
        className={`bg-secondary rounded-lg shadow-lg p-6 h-full flex flex-col justify-between transform transition-all hover:scale-105 border-t-4 ${theme.border}`}>
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={theme.icon} className={`text-xl ${theme.color}`} />
              <div>
                {/* Use the Custom Name if available, fallback to Type */}
                <h3 className="text-xl font-bold font-orbitron text-foreground capitalize">
                  {name || type.replace('-', ' ')}
                </h3>
                {/* Status Badge */}
                <div
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 mt-1 ${statusColor}`}>
                  {icon}
                  <span>{label}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-neutral-700 rounded-full h-4 mb-2">
            <div
              className={`${theme.button.split(' ')[0]} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={completedDays}
              aria-valuemin={0}
              aria-valuemax={duration}></div>
          </div>
          <p className="text-sm text-neutral-400 mb-2">{details}</p>
          <p className="text-xs text-text-muted">
            Started: {new Date(challenge.startDate).toLocaleDateString()}
          </p>
        </div>
        <button
          className={`mt-4 ${theme.button} text-white font-bold py-2 px-4 rounded-lg transition-colors w-full cursor-pointer`}>
          {getButtonText()}
        </button>
      </div>
    </Link>
  );
};

function ChallengeListPage() {
  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      const allChallenges = await getAllChallenges();
      // Sort: Active first, then by date descending
      allChallenges.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
      setChallenges(allChallenges);
      setIsLoading(false);
    };
    fetchChallenges();
  }, []);

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
            <ChallengeCard key={challenge._id} challenge={challenge} />
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
