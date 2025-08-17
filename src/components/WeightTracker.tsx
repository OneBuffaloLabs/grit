'use client';

import React, { useState, useEffect } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner, faWeightScale, faCheck } from '@fortawesome/free-solid-svg-icons';

interface WeightTrackerProps {
  currentDay: number;
}

const WeightTracker = ({ currentDay }: WeightTrackerProps) => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const [weight, setWeight] = useState('');
  const [originalWeight, setOriginalWeight] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  // Syncs component state with context data when challenge or day changes.
  useEffect(() => {
    const dailyWeight = challenge?.days[currentDay]?.weight;
    const weightStr = dailyWeight != null ? String(dailyWeight) : '';
    setWeight(weightStr);
    setOriginalWeight(weightStr);
  }, [challenge, currentDay]);

  // Resets UI state (like "Saved!" confirmation) when the day changes.
  useEffect(() => {
    setIsSaved(false);
    setError('');
  }, [currentDay]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const numValue = parseFloat(value);

    // Prevent user from typing a number outside the allowed range.
    if (numValue > 1000) value = '1000';
    if (numValue < 0) value = '0';

    setWeight(value);
    if (error) setError('');
    if (isSaved) setIsSaved(false);
  };

  const handleSaveWeight = async () => {
    if (!challenge || weight === originalWeight) return;

    setError('');
    const weightValue = parseFloat(weight);

    if (weight !== '' && isNaN(weightValue)) {
      setError('Please enter a valid number.');
      return;
    }

    setIsSaving(true);
    const updatedChallenge = JSON.parse(JSON.stringify(challenge));

    if (!updatedChallenge.days[currentDay]) {
      updatedChallenge.days[currentDay] = {
        completed: false,
        photoAttached: false,
        tasks: {
          diet: false,
          workout1: false,
          workout2: false,
          water: false,
          reading: false,
          progressPhoto: false,
        },
      };
    }

    // Use undefined to remove the property if the weight is cleared.
    updatedChallenge.days[currentDay].weight = weight === '' ? undefined : weightValue;

    try {
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
        setOriginalWeight(weight); // Update original weight to disable save until next change
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000); // Show checkmark for 2 seconds
      }
    } catch (err) {
      console.error('Failed to save weight:', err);
      setError('Could not save weight. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanged = weight !== originalWeight;

  return (
    <div className="bg-[var(--color-background)] rounded-lg shadow-lg p-6 sm:p-8 mt-8">
      <h2 className="text-3xl font-bold font-orbitron text-center mb-6">Daily Weight</h2>
      <div className="flex items-center gap-4">
        <FontAwesomeIcon icon={faWeightScale} className="text-[var(--color-primary)]" size="2x" />
        <div className="w-full">
          <input
            type="number"
            min={0}
            max={1000}
            value={weight}
            onChange={handleWeightChange}
            placeholder="Enter weight..."
            className={`w-full p-2 bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-md border ${
              error ? 'border-red-500' : 'border-gray-600'
            } focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]`}
          />
        </div>
        <button
          onClick={handleSaveWeight}
          disabled={isSaving || !hasChanged}
          className={`text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
            isSaved
              ? 'bg-green-600'
              : hasChanged && !isSaving
              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] cursor-pointer'
              : 'bg-gray-600 cursor-not-allowed'
          }`}>
          {isSaving ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : isSaved ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faSave} />
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
};

export default WeightTracker;
