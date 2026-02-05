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
} from '@fortawesome/free-solid-svg-icons';
import { ChallengeDoc } from '@/types';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeDoc | null;
}

const CompletionModal = ({ isOpen, onClose, challenge }: CompletionModalProps) => {
  // --- Derived Stats Calculation ---
  const stats = useMemo(() => {
    if (!challenge) return null;

    const { days, rules, startDate, duration } = challenge;
    const dayValues = Object.values(days);

    // Count fully completed days for the "Perfect Days" stat
    const perfectDaysCount = dayValues.filter((d) => d.completed).length;

    // --- Task-Based Calculators (Give credit for partial days) ---

    // 1. Reading Pages
    const totalPages = dayValues.reduce((acc, day) => {
      return acc + (day.tasks.reading ? rules.reading : 0);
    }, 0);

    // 2. Water Volume
    const totalOz = dayValues.reduce((acc, day) => {
      return acc + (day.tasks.water ? rules.water : 0);
    }, 0);
    const totalGallons = (totalOz / 128).toFixed(1);

    // 3. Workouts
    const totalWorkouts = dayValues.reduce((acc, day) => {
      let dailyCount = 0;
      if (day.tasks.workout1) dailyCount++;
      if (day.tasks.workout2) dailyCount++;
      if (day.tasks.workout3) dailyCount++;
      return acc + dailyCount;
    }, 0);

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

    // 6. Other Logs
    const measurementLogs = dayValues.filter(
      (d) => d.measurements && Object.keys(d.measurements).length > 0
    ).length;

    const journalEntries = dayValues.filter((d) => d.journal && d.journal.length > 0).length;

    // 7. Photos: Calculate required photos based on the rule, not actual uploads.
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

    // --- Date Calculation ---
    // Calculate expected end date based on start date + duration
    const startObj = new Date(startDate);
    const endObj = new Date(startObj);
    endObj.setDate(startObj.getDate() + duration - 1); // -1 to be inclusive of the last day

    return {
      weightChangeLabel,
      measurementLogs,
      totalGallons,
      totalPages,
      totalWorkouts,
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

  // --- Dynamic Message Generation ---
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
            <p>&quot;{getDietSummary()}&quot;</p>
            <p>&quot;You showed up and logged progress for {stats.activeDayCount} days.&quot;</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Workouts */}
          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faRunning} className="text-2xl text-blue-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.totalWorkouts}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Workouts Crushed
            </p>
          </div>

          {/* Water */}
          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faTint} className="text-2xl text-cyan-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.totalGallons}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Gallons Drank
            </p>
          </div>

          {/* Reading */}
          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faBook} className="text-2xl text-purple-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.totalPages}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Pages Read
            </p>
          </div>

          {/* Dynamic: Weight */}
          {challenge.rules.trackWeight && (
            <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
              <FontAwesomeIcon icon={faWeight} className="text-2xl text-green-400 mb-2" />
              <p className="text-2xl font-bold font-orbitron">{stats.weightChangeLabel}</p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Weight Change
              </p>
            </div>
          )}

          {/* Dynamic: Photos */}
          {challenge.rules.photoRule !== 'none' && (
            <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
              <FontAwesomeIcon icon={faImage} className="text-2xl text-pink-400 mb-2" />
              <p className="text-2xl font-bold font-orbitron">{stats.totalPhotos}</p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Photos Taken
              </p>
            </div>
          )}

          {/* Dynamic: Journal */}
          {challenge.rules.useDailyJournal && (
            <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
              <FontAwesomeIcon icon={faPenFancy} className="text-2xl text-yellow-400 mb-2" />
              <p className="text-2xl font-bold font-orbitron">{stats.journalEntries}</p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Entries Written
              </p>
            </div>
          )}

          {/* Dynamic: Measurements */}
          {challenge.rules.trackMeasurements && stats.measurementLogs > 0 && (
            <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
              <FontAwesomeIcon icon={faRulerCombined} className="text-2xl text-orange-400 mb-2" />
              <p className="text-2xl font-bold font-orbitron">{stats.measurementLogs}</p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Body Checks
              </p>
            </div>
          )}

          {/* Generic: Perfect Days */}
          <div className="bg-[var(--color-background)] p-4 rounded-xl text-center border border-[var(--color-surface-border)] hover:border-[var(--color-primary)] transition-colors">
            <FontAwesomeIcon icon={faUtensils} className="text-2xl text-red-400 mb-2" />
            <p className="text-2xl font-bold font-orbitron">{stats.perfectDaysCount}</p>
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
              Perfect Days
            </p>
          </div>
        </div>

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
