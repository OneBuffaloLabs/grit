'use client';

// --- React ---
import React, { useMemo } from 'react';

// --- Icons ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBottleWater, faCheck, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

interface WaterTrackerProps {
  currentWater: number;
  waterGoal: number;
  isCompleted: boolean;
  disabled?: boolean;
  onUpdateWater: (amount: number) => Promise<void> | void;
}

export const WaterTracker = ({
  currentWater,
  waterGoal,
  isCompleted,
  disabled = false,
  onUpdateWater,
}: WaterTrackerProps) => {
  const remaining = Math.max(0, waterGoal - currentWater);
  const progressPercentage = Math.min(100, (currentWater / Math.max(1, waterGoal)) * 100);

  // Quick-add presets dynamically adjusted so they never overshoot the goal
  const quickAddAmounts = useMemo(() => {
    if (remaining <= 0) return [];
    const basePresets = [8, 16, 24, 32];
    const adjusted = basePresets.map((amt) => Math.min(amt, remaining));
    return Array.from(new Set(adjusted));
  }, [remaining]);

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 ${
        disabled
          ? 'border-transparent bg-[var(--color-background)] opacity-60 cursor-not-allowed'
          : 'border-[var(--color-background)] bg-[var(--color-background)]'
      }`}>
      {/* Header Info */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBottleWater} className="text-blue-400 text-lg" />
          <span className="font-semibold text-[var(--color-foreground)]">Water Intake</span>
          {isCompleted && (
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <FontAwesomeIcon icon={faCheck} className="text-xs" />
              Goal Met
            </span>
          )}
        </div>
        <div className="text-sm font-orbitron font-medium text-[var(--color-foreground)]">
          <span className="text-blue-400 font-bold">{currentWater}</span>
          <span className="text-[var(--color-text-muted)]"> / {waterGoal} oz</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden border border-neutral-700/80 mb-3">
        <div
          className="bg-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentWater}
          aria-valuemin={0}
          aria-valuemax={waterGoal}
          aria-label="Water intake progress"
        />
      </div>

      {/* Controls & Quick-Add Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {quickAddAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={disabled}
              onClick={() => void onUpdateWater(currentWater + amt)}
              className="bg-blue-950/40 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:border-blue-400 font-semibold px-3 py-1.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              +{amt} oz
            </button>
          ))}
          {remaining === 0 && !disabled && (
            <span className="text-xs text-green-400 font-medium">Daily goal accomplished!</span>
          )}
        </div>

        {/* Stepper Reset / Undo */}
        {!disabled && currentWater > 0 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => void onUpdateWater(Math.max(0, currentWater - 8))}
              className="text-xs text-[var(--color-text-muted)] hover:text-red-400 border border-neutral-700 hover:border-red-500/30 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Decrease by 8 oz">
              -8 oz
            </button>
            <button
              type="button"
              onClick={() => void onUpdateWater(0)}
              className="text-xs text-[var(--color-text-muted)] hover:text-red-400 border border-neutral-700 hover:border-red-500/30 px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Reset water intake">
              <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterTracker;
