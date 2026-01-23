import React from 'react';
import { ChallengeRules } from '@/types';

interface PhysicalSectionProps {
  rules: ChallengeRules;
  isCustom: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any; // Theme config object
  onWorkoutCountChange: (count: number) => void;
  onDurationChange: (index: number, minutes: number) => void;
  onOutdoorToggle: (checked: boolean) => void;
  preventNonNumericInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PhysicalSection = ({
  rules,
  isCustom,
  theme,
  onWorkoutCountChange,
  onDurationChange,
  onOutdoorToggle,
  preventNonNumericInput,
}: PhysicalSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--color-background)] pb-2">
        Physical Training
      </h3>

      {/* Number of Workouts Slider */}
      <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
        <label className="block text-sm font-bold mb-1">Workouts per Day</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={rules.workouts}
            onChange={(e) => onWorkoutCountChange(parseInt(e.target.value))}
            className={`flex-grow h-2 bg-[var(--color-background)] rounded-lg appearance-none cursor-pointer ${theme.accent}`}
          />
          <span className={`text-2xl font-bold font-orbitron w-8 text-center ${theme.color}`}>
            {rules.workouts}
          </span>
        </div>
      </div>

      {/* Workout Duration Details Loop */}
      <div className="space-y-3">
        <label className={`block text-sm font-bold ${!isCustom ? 'opacity-70' : ''}`}>
          Target Duration
        </label>

        {Array.from({ length: rules.workouts }).map((_, index) => (
          <div
            key={index}
            className={`bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-surface)] text-sm flex justify-between items-center ${!isCustom ? 'opacity-70 pointer-events-none' : ''}`}>
            <span>
              Workout {index + 1}
              {/* If Balanced, imply Workout 2 is simpler */}
              {/* Note: logic for label could be passed down, but this is fine for now */}
            </span>
            <div className="flex items-center gap-2">
              {isCustom ? (
                <input
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  required
                  onKeyDown={preventNonNumericInput}
                  value={rules.workoutDurations[index]}
                  onChange={(e) => onDurationChange(index, parseInt(e.target.value))}
                  className={`w-16 text-center rounded py-1 font-bold bg-[var(--color-surface)] border ${theme.border.replace('border-', 'focus:border-')} outline-none ${theme.color}`}
                />
              ) : (
                <div className={`w-16 text-center py-1 font-bold ${theme.color}`}>
                  {rules.workoutDurations[index]}
                </div>
              )}
              <span className="text-[var(--color-text-muted)]">min</span>
            </div>
          </div>
        ))}
      </div>

      {/* Outdoor Toggle */}
      <label
        className={`flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[var(--color-background)] transition-colors ${!isCustom ? 'opacity-70 pointer-events-none' : ''}`}>
        <span className="text-sm font-bold">Outdoor Requirement</span>
        <div className="relative">
          <input
            type="checkbox"
            checked={rules.outdoorWorkout}
            onChange={(e) => onOutdoorToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className={`w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${theme.toggle}`}></div>
        </div>
      </label>
    </div>
  );
};

export default PhysicalSection;
