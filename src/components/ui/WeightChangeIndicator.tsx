'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';

interface WeightChangeIndicatorProps {
  startingWeight: number | null | undefined;
  currentWeight: number | null | undefined;
}

const WeightChangeIndicator = ({ startingWeight, currentWeight }: WeightChangeIndicatorProps) => {
  if (startingWeight == null || currentWeight == null) {
    return null; // Don't display if we don't have both weights
  }

  const difference = currentWeight - startingWeight;
  const absDifference = Math.abs(difference).toFixed(1);

  let icon = faArrowsLeftRight;
  let color = 'text-gray-500'; // Neutral color
  let text = `Same as starting weight`;

  if (difference > 0) {
    icon = faArrowUp;
    color = 'text-red-500'; // Gained weight
    text = `${absDifference} lbs above start`;
  } else if (difference < 0) {
    icon = faArrowDown;
    color = 'text-green-500'; // Lost weight
    text = `${absDifference} lbs below start`;
  }

  return (
    <div className={`flex items-center justify-center gap-2 mt-4 text-sm ${color}`}>
      <FontAwesomeIcon icon={icon} />
      <span>{text}</span>
    </div>
  );
};

export default WeightChangeIndicator;
