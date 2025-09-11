'use client';

import React, { useMemo } from 'react';
import type { ChallengeDoc } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWeight, faCalendarCheck, faCamera } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeDoc | null;
}

interface StatCardProps {
  icon: IconDefinition;
  title: string;
  value: string | number;
  unit: string;
  description: string;
}

const StatCard = ({ icon, title, value, unit, description }: StatCardProps) => (
  <div className="bg-[var(--color-background)] p-4 rounded-lg flex items-center">
    <FontAwesomeIcon icon={icon} className="text-[var(--color-primary)] text-3xl mr-4" />
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-2xl font-orbitron">
        {value}
        <span className="text-lg ml-1">{unit}</span>
      </p>
      <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  </div>
);

const CompletionModal = ({ isOpen, onClose, challenge }: CompletionModalProps) => {
  const stats = useMemo(() => {
    if (!challenge) {
      return {
        weightChange: 0,
        consistency: 0,
        totalPhotos: 0,
        startWeight: null,
        endWeight: null,
      };
    }

    const days = Object.values(challenge.days);
    const completedDays = days.filter((day) => day.completed).length;
    const consistency =
      challenge.duration > 0 ? Math.round((completedDays / challenge.duration) * 100) : 0;

    const weights = days
      .map((day) => day.weight)
      .filter((w): w is number => w !== undefined && w > 0)
      .sort((a, b) => a - b); // Assuming days are somewhat in order, this is a simplification

    const startWeight = weights.length > 0 ? weights[0] : null;
    const endWeight = weights.length > 0 ? weights[weights.length - 1] : null;
    const weightChange =
      startWeight && endWeight ? parseFloat((endWeight - startWeight).toFixed(1)) : 0;

    const totalPhotos = days.filter((day) => day.photoAttached).length;

    return { weightChange, consistency, totalPhotos, startWeight, endWeight };
  }, [challenge]);

  if (!isOpen || !challenge) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}>
      <div
        className="bg-[var(--color-secondary)] text-[var(--color-foreground)] rounded-xl shadow-2xl p-8 max-w-2xl w-full m-4 relative transform transition-all duration-300 scale-95"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-white transition-colors"
          aria-label="Close modal">
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold font-orbitron text-[var(--color-primary)]">
            Challenge Complete!
          </h2>
          <p className="text-lg text-[var(--color-text-muted)]">Here is your final summary.</p>
        </div>

        <div className="space-y-4">
          <StatCard
            icon={faCalendarCheck}
            title="Consistency"
            value={stats.consistency}
            unit="%"
            description={`You completed ${
              (stats.consistency / 100) * challenge.duration
            } of ${challenge.duration} days.`}
          />
          <StatCard
            icon={faWeight}
            title="Weight Change"
            value={stats.weightChange}
            unit="lbs"
            description={`From ${stats.startWeight ?? 'N/A'} to ${stats.endWeight ?? 'N/A'} lbs.`}
          />
          <StatCard
            icon={faCamera}
            title="Progress Photos"
            value={stats.totalPhotos}
            unit="photos"
            description="A visual record of your journey."
          />
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="bg-[var(--color-primary)] text-white font-bold py-3 px-10 rounded-lg hover:bg-[var(--color-primary-hover)] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]">
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
