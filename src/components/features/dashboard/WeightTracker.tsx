'use client';

import React, { useState, useEffect } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faSpinner,
  faWeightScale,
  faCheck,
  faRulerCombined,
} from '@fortawesome/free-solid-svg-icons';
import WeightChangeIndicator from '@/components/ui/WeightChangeIndicator';
import { DailyMeasurements } from '@/types';

interface WeightTrackerProps {
  currentDay: number;
  isReadOnly?: boolean;
}

// Keys for iteration
const MEASUREMENT_KEYS: (keyof DailyMeasurements)[] = [
  'neck',
  'chest',
  'waist',
  'hips',
  'thighs',
  'calves',
  'biceps',
  'forearms',
];

const WeightTracker = ({ currentDay, isReadOnly = false }: WeightTrackerProps) => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();

  // Rules
  const showWeight = challenge?.rules.trackWeight ?? false;
  const showMeasurements = challenge?.rules.trackMeasurements ?? false;

  // State
  const [weight, setWeight] = useState('');
  const [measurements, setMeasurements] = useState<Record<keyof DailyMeasurements, string>>({
    neck: '',
    chest: '',
    waist: '',
    hips: '',
    thighs: '',
    calves: '',
    biceps: '',
    forearms: '',
  });

  // Tracking original state for dirty checking
  const [originalWeight, setOriginalWeight] = useState('');
  const [originalMeasurements, setOriginalMeasurements] = useState<Record<string, string>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const startingWeight = challenge?.days[1]?.weight;

  // --- Load Data on Mount or Day Change ---
  useEffect(() => {
    const dayData = challenge?.days[currentDay];

    // Load Weight
    const weightStr = dayData?.weight != null ? String(dayData.weight) : '';
    setWeight(weightStr);
    setOriginalWeight(weightStr);

    // Load Measurements
    const mData = dayData?.measurements || {};
    const newMState: any = {};
    const newOriginalMState: any = {};

    MEASUREMENT_KEYS.forEach((key) => {
      const val = mData[key] != null ? String(mData[key]) : '';
      newMState[key] = val;
      newOriginalMState[key] = val;
    });

    setMeasurements(newMState);
    setOriginalMeasurements(newOriginalMState);

    setIsSaved(false);
    setError('');
  }, [challenge, currentDay]);

  // --- Handlers ---

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const numValue = parseFloat(value);
    if (numValue > 1000) value = '1000';
    if (numValue < 0) value = '0';
    setWeight(value);
    setIsSaved(false);
  };

  const handleMeasurementChange = (key: keyof DailyMeasurements, value: string) => {
    // Basic validation: allow empty or numbers
    if (value !== '' && isNaN(Number(value))) return;

    setMeasurements((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!challenge) return;
    setError('');
    setIsSaving(true);

    const updatedChallenge = JSON.parse(JSON.stringify(challenge));

    // Init Day if needed
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

    // 1. Save Weight
    if (showWeight) {
      const wVal = parseFloat(weight);
      updatedChallenge.days[currentDay].weight = weight === '' || isNaN(wVal) ? undefined : wVal;
    }

    // 2. Save Measurements
    if (showMeasurements) {
      const mToSave: DailyMeasurements = {};
      MEASUREMENT_KEYS.forEach((key) => {
        const valStr = measurements[key];
        const valNum = parseFloat(valStr);
        if (valStr !== '' && !isNaN(valNum)) {
          mToSave[key] = valNum;
        }
      });
      updatedChallenge.days[currentDay].measurements = mToSave;
    }

    try {
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });

        // Update originals to current to reset "dirty" state
        setOriginalWeight(weight);
        setOriginalMeasurements({ ...measurements });

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save metrics:', err);
      setError('Could not save data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Dirty Checking ---
  const hasWeightChanged = weight !== originalWeight;
  const hasMeasurementsChanged = MEASUREMENT_KEYS.some(
    (key) => measurements[key] !== originalMeasurements[key]
  );
  const hasChanged = hasWeightChanged || hasMeasurementsChanged;

  if (!showWeight && !showMeasurements) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[var(--color-primary)]">
          {showWeight ? (
            <FontAwesomeIcon icon={faWeightScale} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faRulerCombined} size="lg" />
          )}
          <span className="font-bold font-orbitron uppercase text-sm tracking-wider">
            {showWeight && showMeasurements
              ? 'Body Metrics'
              : showWeight
                ? 'Daily Weight'
                : 'Measurements'}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanged || isReadOnly}
          className={`text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
            isSaved
              ? 'bg-green-600'
              : hasChanged && !isSaving
                ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] cursor-pointer'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}>
          {isSaving ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : isSaved ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faSave} />
          )}
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>
      )}

      {/* Weight Input */}
      {showWeight && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase">
            Weight (lbs)
          </label>
          <input
            type="number"
            min={0}
            max={1000}
            value={weight}
            onChange={handleWeightChange}
            disabled={isReadOnly}
            placeholder={isReadOnly ? '-' : '0.0'}
            className="w-full p-3 bg-[var(--color-background)] text-[var(--color-text)] font-bold text-lg rounded-lg border border-[var(--color-surface-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors disabled:opacity-50"
          />
          <WeightChangeIndicator
            startingWeight={startingWeight}
            currentWeight={parseFloat(weight) || null}
          />
        </div>
      )}

      {/* Measurements Grid */}
      {showMeasurements && (
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase block mb-2">
            Measurements (in)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {MEASUREMENT_KEYS.map((key) => (
              <div key={key} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-[var(--color-text-muted)]">
                  {key}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={measurements[key]}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                  disabled={isReadOnly}
                  className="w-full pl-16 pr-2 py-2 bg-[var(--color-background)] text-right text-[var(--color-text)] font-bold text-sm rounded border border-[var(--color-surface-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="-"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;
