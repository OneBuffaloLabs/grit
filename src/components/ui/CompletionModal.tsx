'use client';

import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTrophy,
  faWeight,
  faBook,
  faImage,
  faRunning,
  faTint,
  faPenFancy,
  faUtensils,
  faRulerCombined,
  faArrowRight,
  faCloudSun,
} from '@fortawesome/free-solid-svg-icons';
import { ChallengeDoc, DailyMeasurements } from '@/types';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeDoc | null;
}

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

const CompletionModal = ({ isOpen, onClose, challenge }: CompletionModalProps) => {
  // --- Derived Stats Calculation ---
  const stats = useMemo(() => {
    if (!challenge) return null;

    const { days, rules, startDate, duration } = challenge;
    const dayValues = Object.values(days);

    // Count fully completed days for the "Perfect Days" stat
    const perfectDaysCount = dayValues.filter((d) => d.completed).length;

    // --- Task-Based Calculators ---

    // 1. Reading Pages
    const totalPages = dayValues.reduce((acc, day) => {
      return acc + (day.tasks.reading ? rules.reading : 0);
    }, 0);

    // 2. Water Volume
    const totalOz = dayValues.reduce((acc, day) => {
      return acc + (day.tasks.water ? rules.water : 0);
    }, 0);
    const totalGallons = (totalOz / 128).toFixed(1);

    // 3. Workouts (Total & Outdoor)
    let totalWorkouts = 0;
    let outdoorSessions = 0;

    dayValues.forEach((day) => {
      // Count Total
      if (day.tasks.workout1) totalWorkouts++;
      if (day.tasks.workout2) totalWorkouts++;
      if (day.tasks.workout3) totalWorkouts++;

      // Count Outdoor Specifics
      if (rules.outdoorWorkout) {
        // If single workout & outdoor rule = Workout 1 is outdoor
        if (rules.workouts === 1 && day.tasks.workout1) {
          outdoorSessions++;
        }
        // If multiple workouts = Workout 2 is usually the designated outdoor one
        else if (rules.workouts >= 2 && day.tasks.workout2) {
          outdoorSessions++;
        }
      }
    });

    // 4. Diet Consistency
    const dietDays = dayValues.filter((d) => d.tasks.diet).length;

    // 5. Weight Change
    let weightChangeLabel = 'N/A';
    if (rules.trackWeight) {
      const recordedWeights = Object.keys(days)
        .map(Number)
        .sort((a, b) => a - b)
        .map((day) => days[day].weight)
        .filter((w): w is number => w !== undefined && w > 0);

      if (recordedWeights.length >= 2) {
        const start = recordedWeights[0];
        const end = recordedWeights[recordedWeights.length - 1];
        const diff = end - start;
        weightChangeLabel = `${diff > 0 ? '+' : ''}${diff.toFixed(1)} lbs`;
      } else {
        weightChangeLabel = '--';
      }
    }

    // 6. Measurement Deltas
    const measurementChanges: { key: string; diff: string; start: number; end: number }[] = [];
    if (rules.trackMeasurements) {
      const sortedDayKeys = Object.keys(days)
        .map(Number)
        .sort((a, b) => a - b);

      MEASUREMENT_KEYS.forEach((key) => {
        const startDay = sortedDayKeys.find((d) => days[d].measurements?.[key]);
        const endDay = [...sortedDayKeys].reverse().find((d) => days[d].measurements?.[key]);

        if (startDay && endDay && startDay !== endDay) {
          const startVal = days[startDay].measurements![key];
          const endVal = days[endDay].measurements![key];

          if (startVal !== undefined && endVal !== undefined) {
            const diff = endVal - startVal;
            measurementChanges.push({
              key,
              diff: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}"`,
              start: startVal,
              end: endVal,
            });
          }
        }
      });
    }

    const measurementLogs = dayValues.filter(
      (d) => d.measurements && Object.keys(d.measurements).length > 0
    ).length;

    const journalEntries = dayValues.filter((d) => d.journal && d.journal.length > 0).length;

    // 7. Photos
    let calculatedTotalPhotos = 0;
    switch (rules.photoRule) {
      case 'daily':
        calculatedTotalPhotos = duration;
        break;
      case 'first_last':
        calculatedTotalPhotos = duration > 1 ? 2 : 1;
        break;
      case 'weekly':
        calculatedTotalPhotos = Math.ceil(duration / 7);
        break;
      case 'none':
      default:
        calculatedTotalPhotos = 0;
        break;
    }

    const startObj = new Date(startDate);
    const endObj = new Date(startObj);
    endObj.setDate(startObj.getDate() + duration - 1);

    return {
      weightChangeLabel,
      measurementLogs,
      measurementChanges,
      totalGallons,
      totalPages,
      totalWorkouts,
      outdoorSessions, // New Stat
      dietDays,
      journalEntries,
      totalPhotos: calculatedTotalPhotos,
      perfectDaysCount,
      formattedStartDate: startObj.toLocaleDateString(),
      formattedEndDate: endObj.toLocaleDateString(),
      activeDayCount: Object.keys(days).length,
    };
  }, [challenge]);

  if (!isOpen || !challenge || !stats) {
    return null;
  }

  const getDietSummary = () => {
    switch (challenge.rules.dietRule) {
      case 'strict':
        return `You maintained a strict diet for ${stats.dietDays} days.`;
      case 'cut_vice':
        return `You went ${stats.dietDays} days without ${challenge.rules.vice || 'your vice'}.`;
      case 'one_cheat_week':
        return `You stuck to your diet plan for ${stats.dietDays} days.`;
      default:
        return 'You disciplined your nutrition.';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}>
      <div
        className="relative bg-[var(--color-secondary)] border border-[var(--color-surface-border)] p-6 rounded-2xl max-w-2xl w-full flex flex-col gap-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="flex justify-between items-start">
          <div>
            <h3 className="text-3xl font-bold font-orbitron text-[var(--color-primary)] flex items-center gap-3">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
              Challenge Complete!
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              {stats.formattedStartDate} — {stats.formattedEndDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors p-2 cursor-pointer"
            aria-label="Close modal">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        {/* Hero Summary */}
        <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-surface-border)] text-center space-y-3">
          <p className="text-xl font-medium text-[var(--color-foreground)]">
            Congratulations on conquering{' '}
            <span className="text-[var(--color-primary)] font-bold">{challenge.name}</span>.
          </p>
          <div className="text-sm text-[var(--color-text-muted)] italic space-y-1">
            <p>"{getDietSummary()}"</p>
            {challenge.rules.outdoorWorkout && stats.outdoorSessions > 0 && (
              <p>"You braved the elements for {stats.outdoorSessions} outdoor sessions."</p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faRunning} className="text-2xl text-blue-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.totalWorkouts}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Workouts Crushed
            </p>
          </div>

          {/* New Outdoor Card */}
          {challenge.rules.outdoorWorkout && (
            <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
              <FontAwesomeIcon icon={faCloudSun} className="text-2xl text-yellow-500 mb-2" />
              <p className="text-2xl font-bold font-orbitron">{stats.outdoorSessions}</p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Outdoor Sessions
              </p>
            </div>
          )}

          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faTint} className="text-2xl text-cyan-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.totalGallons}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Gallons Drank
            </p>
          </div>

          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faBook} className="text-2xl text-purple-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.totalPages}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Pages Read
            </p>
          </div>

          {challenge.rules.trackWeight && (
            <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
              <FontAwesomeIcon icon={faWeight} className="text-2xl text-green-400 mb-2" />
              <p className="text-2xl font-bold font-orbitron">{stats.weightChangeLabel}</p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Weight Change
              </p>
            </div>
          )}

          {challenge.rules.photoRule !== 'none' && (
            <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
              <FontAwesomeIcon icon={faImage} className="text-2xl text-pink-400 mb-2" />
              <p className="text-2xl font-bold font-orbitron">{stats.totalPhotos}</p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Photos Required
              </p>
            </div>
          )}

          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faUtensils} className="text-2xl text-red-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.perfectDaysCount}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Perfect Days
            </p>
          </div>
        </div>

        {/* Physical Transformation Sub-Section */}
        {stats.measurementChanges.length > 0 && (
          <div className="animate-fadeIn">
            <h4 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[var(--color-surface-border)] pb-2">
              <FontAwesomeIcon icon={faRulerCombined} /> Physical Transformation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.measurementChanges.map((m) => (
                <div
                  key={m.key}
                  className="bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-surface-border)] flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">
                    {m.key}
                  </span>
                  <span
                    className={`text-lg font-bold font-orbitron ${m.diff.startsWith('-') ? 'text-green-400' : 'text-[var(--color-foreground)]'}`}>
                    {m.diff}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] opacity-60">
                    <span>{m.start}</span>
                    <FontAwesomeIcon icon={faArrowRight} size="xs" />
                    <span>{m.end}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            This challenge is now archived. You can view it anytime in your history.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-full hover:bg-[var(--color-primary-hover)] transition-transform duration-300 hover:scale-105 shadow-lg cursor-pointer">
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
