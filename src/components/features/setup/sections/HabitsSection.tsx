import React from 'react';
import {
  ChallengeRules,
  ReadingRuleType,
  DietRuleType,
  AlcoholRuleType,
  PhotoRuleType,
} from '@/types';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faLock } from '@fortawesome/free-solid-svg-icons';

interface HabitsSectionProps {
  rules: ChallengeRules;
  isCustom: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
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
  const waterLiters = Number((rules.water * 0.0295735).toFixed(2));
  const waterGallons = Number((rules.water / 128).toFixed(2));

  // Handler to enforce Alcohol = None when Diet = Strict
  const handleDietChange = (val: DietRuleType) => {
    onRuleChange('dietRule', val);
    if (val === 'strict') {
      onRuleChange('alcoholRule', 'none');
    }
  };

  const isDietStrict = rules.dietRule === 'strict';

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
      <div>
        <label className="block text-sm font-bold mb-2">Diet</label>

        {/* Only the Selector is disabled on non-custom */}
        <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
          <SegmentedControl<DietRuleType>
            options={[
              { id: 'cut_vice', label: 'Cut 1 Vice' },
              { id: 'one_cheat_week', label: '1 Cheat/Wk' },
              { id: 'strict', label: 'Strict' },
            ]}
            value={rules.dietRule}
            onChange={handleDietChange}
            theme={theme}
          />
        </div>

        {/* Vice Input */}
        {rules.dietRule === 'cut_vice' && (
          <div className="mt-3 animate-fadeIn">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-1 block">
              Name your Vice
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <FontAwesomeIcon icon={faBan} />
              </span>
              <input
                type="text"
                placeholder="e.g. Soda, Candy, Social Media"
                value={rules.vice || ''}
                onChange={(e) => onRuleChange('vice', e.target.value)}
                className={`w-full pl-9 pr-3 py-2 bg-[var(--color-background)] border border-[var(--color-surface)] rounded focus:border-current outline-none text-sm ${theme.color} ${theme.border.replace('border-', 'focus:border-')}`}
              />
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1 ml-1">
              Be specific. This will appear on your daily checklist.
            </p>
          </div>
        )}
      </div>

      {/* Alcohol */}
      <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold">Alcohol</label>
          {isDietStrict && (
            <span className="text-[10px] uppercase font-bold text-[var(--color-primary)] flex items-center gap-1">
              <FontAwesomeIcon icon={faLock} /> Enforced by Strict Diet
            </span>
          )}
        </div>

        <div className={isDietStrict ? 'opacity-50 pointer-events-none' : ''}>
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
