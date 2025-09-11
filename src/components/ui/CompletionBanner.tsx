'use client';

import React from 'react';

interface CompletionBannerProps {
  completionDate: string;
  onOpenSummary: () => void;
}

const CompletionBanner = ({ completionDate, onOpenSummary }: CompletionBannerProps) => {
  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-[var(--color-success)] text-white p-6 rounded-lg text-center my-6 shadow-lg">
      <h2 className="text-3xl font-bold font-orbitron">Challenge Completed!</h2>
      <p className="mt-2 text-lg">
        Congratulations! You crushed your goal on {formattedDate}.
      </p>
      <button
        onClick={onOpenSummary}
        className="mt-4 bg-white text-[var(--color-success)] font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
      >
        View Your Summary
      </button>
    </div>
  );
};

export default CompletionBanner;
