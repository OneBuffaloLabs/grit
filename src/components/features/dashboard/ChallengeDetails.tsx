'use client';

import React from 'react';
import { useChallengeState } from '@/context/ChallengeContext';

const ChallengeDetails = () => {
  const { challenge } = useChallengeState();

  if (!challenge) {
    return null;
  }

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 74);

  const formatDate = (date: Date) => {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="text-center my-4 text-sm md:text-base text-[var(--color-text-muted)] md:flex md:items-center md:justify-center md:gap-4">
      <p>
        <span className="font-bold">Start:</span> {formatDate(startDate)}
      </p>
      <p>
        <span className="font-bold">End:</span> {formatDate(endDate)}
      </p>
    </div>
  );
};

export default ChallengeDetails;
