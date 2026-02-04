import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faListCheck,
  faDumbbell,
  faUtensils,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import {
  ChallengeDoc,
  ReadingRuleType,
  DietRuleType,
  AlcoholRuleType,
  PhotoRuleType,
} from '@/types';

interface ProtocolRulebookProps {
  rules: ChallengeDoc['rules'];
}

// Strictly typed maps to prevent "Element implicitly has an 'any' type" errors
const READING_LABELS: Record<ReadingRuleType, string> = {
  non_fiction: 'Non-Fiction',
  any_book: 'Any Book',
  book_or_audio: 'Audio or Book',
};

const DIET_LABELS: Record<DietRuleType, string> = {
  cut_vice: 'Cut 1 Vice',
  one_cheat_week: '1 Cheat/Week',
  strict: 'Strict',
};

const ALCOHOL_LABELS: Record<AlcoholRuleType, string> = {
  no_limit: 'No Limit',
  one_cheat_week: '1 Cheat/Week',
  none: 'None',
};

const PHOTO_LABELS: Record<PhotoRuleType, string> = {
  none: 'None',
  first_last: 'First & Last Day',
  weekly: 'Weekly',
  daily: 'Daily',
};

export const ProtocolRulebook = ({ rules }: ProtocolRulebookProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2 border border-gray-700 rounded-lg w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-[var(--color-surface)] text-sm font-bold hover:bg-gray-700 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faListCheck} className="text-[var(--color-primary)] text-lg" />
          <span>Protocol Rulebook</span>
        </div>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-xs text-[var(--color-text-muted)]"
        />
      </button>

      {isOpen && (
        <div className="p-4 bg-[var(--color-background)] text-xs space-y-6 animate-fadeIn border-t border-gray-700">
          {/* Training Section */}
          <div>
            <h5 className="flex items-center gap-2 font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3 border-b border-gray-800 pb-2">
              <FontAwesomeIcon icon={faDumbbell} /> Training
            </h5>
            <div className="grid grid-cols-2 gap-y-2 text-[var(--color-text-muted)]">
              <span>Daily Workouts</span>
              <span className="text-right font-bold text-[var(--color-foreground)]">
                {rules.workouts}
              </span>

              {rules.workoutDurations.map((dur, idx) => (
                <React.Fragment key={idx}>
                  <span className="pl-2 border-l-2 border-gray-800">Workout {idx + 1}</span>
                  <span className="text-right font-bold text-[var(--color-foreground)]">
                    {dur} min
                  </span>
                </React.Fragment>
              ))}

              <span>Outdoor Rule</span>
              <span
                className={`text-right font-bold ${
                  rules.outdoorWorkout ? 'text-yellow-500' : 'text-gray-500'
                }`}>
                {rules.outdoorWorkout ? 'Required' : 'None'}
              </span>
            </div>
          </div>

          {/* Nutrition & Habits */}
          <div>
            <h5 className="flex items-center gap-2 font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3 border-b border-gray-800 pb-2">
              <FontAwesomeIcon icon={faUtensils} /> Nutrition & Habits
            </h5>
            <div className="grid grid-cols-2 gap-y-2 text-[var(--color-text-muted)]">
              <span>Water Intake</span>
              <span className="text-right font-bold text-[var(--color-foreground)]">
                {rules.water} oz
              </span>

              <span>Reading</span>
              <div className="text-right">
                <span className="font-bold text-[var(--color-foreground)]">
                  {rules.reading} pages
                </span>
                <div className="text-[10px] opacity-70">
                  {READING_LABELS[rules.readingType] || rules.readingType}
                </div>
              </div>

              <span>Diet Rule</span>
              <span className="text-right font-bold text-[var(--color-foreground)]">
                {DIET_LABELS[rules.dietRule] || rules.dietRule}
              </span>

              <span>Alcohol</span>
              <span className="text-right font-bold text-[var(--color-foreground)]">
                {ALCOHOL_LABELS[rules.alcoholRule] || rules.alcoholRule}
              </span>

              <span>Photos</span>
              <span className="text-right font-bold text-[var(--color-foreground)]">
                {PHOTO_LABELS[rules.photoRule] || rules.photoRule}
              </span>
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h5 className="flex items-center gap-2 font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3 border-b border-gray-800 pb-2">
              <FontAwesomeIcon icon={faChartBar} /> Tracking Config
            </h5>
            <div className="flex flex-wrap gap-2">
              {rules.trackWeight && (
                <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-900 font-bold">
                  Weight
                </span>
              )}
              {rules.trackMeasurements && (
                <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-900 font-bold">
                  Measurements
                </span>
              )}
              {rules.useDailyJournal && (
                <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-900 font-bold">
                  Journal
                </span>
              )}

              {!rules.trackWeight && !rules.trackMeasurements && !rules.useDailyJournal && (
                <span className="text-gray-500 italic">No extra tracking enabled.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
