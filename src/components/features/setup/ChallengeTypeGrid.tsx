import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChallengeType } from '@/types';
import { THEME } from '@/data/theme';

interface ChallengeTypeGridProps {
  selectedType: ChallengeType;
  onSelect: (type: ChallengeType) => void;
}

const ChallengeTypeGrid = ({ selectedType, onSelect }: ChallengeTypeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {(['soft', 'balanced', 'hard', 'custom'] as const).map((type) => {
        const theme = THEME[type];
        const isSelected = selectedType === type;

        return (
          <div
            key={type}
            onClick={() => onSelect(type)}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 relative ${
              isSelected
                ? `${theme.border} ${theme.bgLight} ${theme.shadow}`
                : 'border-[var(--color-surface)] bg-[var(--color-surface)] hover:border-gray-500/50'
            }`}>
            <FontAwesomeIcon
              icon={theme.icon}
              className={`text-3xl ${isSelected ? theme.color : 'text-gray-500'}`}
            />
            <h3 className="font-bold text-lg font-orbitron capitalize">
              {type === 'custom' ? 'Custom' : `75 ${type}`}
            </h3>

            {/* Descriptive Text for each card */}
            <div className="text-xs text-[var(--color-text-muted)] text-center space-y-1">
              {type === 'soft' && (
                <>
                  <p>64oz Water • 1 Workout</p>
                  <p>No restart penalty</p>
                </>
              )}
              {type === 'balanced' && (
                <>
                  <p>100oz Water • 1 Workout + Recovery</p>
                  <p>Weekly cheats allowed</p>
                </>
              )}
              {type === 'hard' && (
                <>
                  <p>1 Gal Water • 2 Workouts</p>
                  <p>Zero compromises</p>
                </>
              )}
              {type === 'custom' && (
                <>
                  <p>Your Rules.</p>
                  <p>Your Pace.</p>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChallengeTypeGrid;
