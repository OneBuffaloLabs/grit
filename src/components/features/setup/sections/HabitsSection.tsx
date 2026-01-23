import React from 'react';
import {
  ChallengeRules,
  ReadingRuleType,
  DietRuleType,
  AlcoholRuleType,
  PhotoRuleType,
} from '@/types';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

interface HabitsSectionProps {
  rules: ChallengeRules;
  isCustom: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any; // Theme config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRuleChange: (field: keyof ChallengeRules, value: any) => void;
  preventNonNumericInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const HabitsSection = ({
  rules,
  isCustom,
  theme,
  onRuleChange,
  preventNonNumericInput,
}: HabitsSectionProps) => {
  // Calculations
  const waterLiters = Math.round(rules.water * 0.0295735);
  const waterGallons = Math.round(rules.water / 128);

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--color-background)] pb-2">
        Nutrition & Habits
      </h3>

      {/* Water */}
      <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
        <label className="block text-sm font-bold mb-1">Water Intake</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            step="1"
            required
            onKeyDown={preventNonNumericInput}
            value={rules.water}
            onChange={(e) => onRuleChange('water', e.target.value)}
            className={`w-24 bg-[var(--color-background)] border border-[var(--color-surface)] rounded p-2 focus:border-current outline-none font-bold ${theme.color} ${theme.border.replace('border-', 'focus:border-')}`}
          />
          <span className="text-sm text-[var(--color-text-muted)]">oz / day</span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {rules.water}oz ≈ {waterLiters}L • {waterGallons} Gallon{waterGallons !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Reading */}
      <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
        <label className="block text-sm font-bold mb-2">Reading</label>
        <div className="flex items-center gap-3 mb-2">
          <input
            type="number"
            min="1"
            step="1"
            required
            onKeyDown={preventNonNumericInput}
            value={rules.reading}
            onChange={(e) => onRuleChange('reading', e.target.value)}
            className={`w-20 bg-[var(--color-background)] border border-[var(--color-surface)] rounded p-2 focus:border-current outline-none font-bold ${theme.color} ${theme.border.replace('border-', 'focus:border-')}`}
          />
          <span className="text-sm text-[var(--color-text-muted)]">pages</span>
        </div>

        <div className="mb-2">
          <SegmentedControl<ReadingRuleType>
            options={[
              { id: 'non_fiction', label: 'Non-Fiction' },
              { id: 'any_book', label: 'Any Book' },
              { id: 'book_or_audio', label: 'Audio/Book' },
            ]}
            value={rules.readingType}
            onChange={(val) => onRuleChange('readingType', val)}
            theme={theme}
          />
        </div>

        <p className="text-xs text-[var(--color-text-muted)] italic min-h-[1.5em]">
          {rules.readingType === 'non_fiction' && 'Strict. Must be non-fiction educational.'}
          {rules.readingType === 'any_book' && 'Fiction, Comics, or Non-Fiction allowed.'}
          {rules.readingType === 'book_or_audio' &&
            `${rules.reading} pages or ${rules.reading * 2} minutes of an audiobook.`}
        </p>
      </div>

      {/* Diet */}
      <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
        <label className="block text-sm font-bold mb-2">Diet</label>
        <SegmentedControl<DietRuleType>
          options={[
            { id: 'cut_vice', label: 'Cut 1 Vice' },
            { id: 'one_cheat_week', label: '1 Cheat/Wk' },
            { id: 'strict', label: 'Strict' },
          ]}
          value={rules.dietRule}
          onChange={(val) => onRuleChange('dietRule', val)}
          theme={theme}
        />
      </div>

      {/* Alcohol */}
      <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
        <label className="block text-sm font-bold mb-2">Alcohol</label>
        <SegmentedControl<AlcoholRuleType>
          options={[
            { id: 'no_limit', label: 'No Limit' },
            { id: 'one_cheat_week', label: '1 Cheat/Wk' },
            { id: 'none', label: 'None' },
          ]}
          value={rules.alcoholRule}
          onChange={(val) => onRuleChange('alcoholRule', val)}
          theme={theme}
        />
      </div>

      {/* Progress Photo */}
      <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
        <label className="block text-sm font-bold mb-2">Progress Photo</label>
        <div className="mb-2">
          <SegmentedControl<PhotoRuleType>
            options={[
              { id: 'none', label: 'None' },
              { id: 'first_last', label: 'First/Last' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'daily', label: 'Daily' },
            ]}
            value={rules.photoRule}
            onChange={(val) => onRuleChange('photoRule', val)}
            theme={theme}
          />
        </div>
        <p className="text-xs text-[var(--color-text-muted)] italic min-h-[1.5em]">
          {rules.photoRule === 'daily' && 'Take a photo every single day.'}
          {rules.photoRule === 'weekly' && 'Take a photo once a week.'}
          {rules.photoRule === 'first_last' && 'Only on Day 1 and the final day.'}
          {rules.photoRule === 'none' && 'No photos required.'}
        </p>
      </div>
    </div>
  );
};

export default HabitsSection;
