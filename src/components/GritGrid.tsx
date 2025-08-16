// src/components/GritGrid.tsx
'use client';

import React from 'react';
import { useChallengeState } from '@/context/ChallengeContext';

const GritGrid = () => {
  const { challenge } = useChallengeState();

  return (
    <div className="bg-[var(--color-background)] rounded-lg shadow-lg p-6 sm:p-8 mt-8">
      <h2 className="text-3xl font-bold font-orbitron text-center mb-6">Grit Grid</h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 75 }, (_, i) => {
          const dayNumber = i + 1;
          const dayData = challenge?.days[dayNumber];
          const isCompleted = dayData?.completed || false;
          // You can add another state for 'failed' days if needed
          const cellColor = isCompleted ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]';

          return (
            <div
              key={dayNumber}
              className={`w-full aspect-square flex items-center justify-center rounded-md ${cellColor}`}>
              <span className="text-sm font-mono">{dayNumber}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GritGrid;
