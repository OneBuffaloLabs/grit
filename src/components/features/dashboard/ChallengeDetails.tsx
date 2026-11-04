'use client';

// --- React ---
import React from 'react';

// --- Context / Hooks ---
import { useChallengeState } from '@/context/ChallengeContext';

// --- Utils ---
import { formatDisplayDate, calculateEndDate } from '@/utils/date';

const ChallengeDetails = () => {
  const { challenge } = useChallengeState();

  if (!challenge) {
    return null;
  }

  const startDateFormatted = formatDisplayDate(challenge.startDate);
  const endDateFormatted = formatDisplayDate(
    calculateEndDate(challenge.startDate, challenge.duration)
  );

  return (
    <div className="text-center my-4 text-sm md:text-base text-[var(--color-text-muted)] md:flex md:items-center md:justify-center md:gap-4">
      <p>
        <span className="font-bold">Start:</span> {startDateFormatted}
      </p>
      <p>
        <span className="font-bold">End:</span> {endDateFormatted}
      </p>
    </div>
  );
};

export default ChallengeDetails;
