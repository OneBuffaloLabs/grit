'use client';

import React from 'react';
import { useChallengeState } from '@/context/ChallengeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface GritGridProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const GritGrid = ({ selectedDay, onDaySelect }: GritGridProps) => {
  const { challenge } = useChallengeState();

  return (
    <div className="bg-[var(--color-background)] rounded-lg shadow-lg p-6 sm:p-8 mt-8">
      <h2 className="text-3xl font-bold font-orbitron text-center mb-6">Grit Grid</h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 75 }, (_, i) => {
          const dayNumber = i + 1;
          const dayData = challenge?.days[dayNumber];
          const isCompleted = dayData?.completed || false;
          const isSelected = dayNumber === selectedDay;

          // A day is selectable if it's the first day, already completed,
          // or the day before it is completed.
          const isSelectable =
            dayNumber === 1 || isCompleted || challenge?.days[dayNumber - 1]?.completed || false;

          const cellColor = isCompleted ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]';
          const borderStyle = isSelected
            ? 'border-2 border-[var(--color-primary-hover)]'
            : 'border-2 border-transparent';

          const cursorStyle = isSelectable ? 'cursor-pointer' : 'cursor-not-allowed';
          const opacityStyle = isSelectable ? 'opacity-100' : 'opacity-50';

          return (
            <div
              key={dayNumber}
              onClick={() => isSelectable && onDaySelect(dayNumber)}
              className={`w-full aspect-square flex items-center justify-center rounded-md transition-all duration-200 ${cellColor} ${borderStyle} ${cursorStyle} ${opacityStyle}`}>
              {isCompleted ? (
                <FontAwesomeIcon icon={faTimes} className="text-white text-lg" />
              ) : (
                <span className="text-sm font-mono">{dayNumber}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GritGrid;
