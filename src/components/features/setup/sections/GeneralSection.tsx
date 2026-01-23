import React from 'react';

interface GeneralSectionProps {
  name: string;
  setName: (name: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isCustom: boolean;
  themeAccent: string; // e.g. 'accent-red-500'
}

const GeneralSection = ({
  name,
  setName,
  duration,
  setDuration,
  isCustom,
  themeAccent,
}: GeneralSectionProps) => {
  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
      <div>
        <label className="block text-sm font-bold mb-2">Challenge Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full bg-[var(--color-background)] border border-[var(--color-surface)] rounded-lg p-3 font-bold focus:outline-none focus:border-[var(--color-primary)] ${
            !isCustom ? 'opacity-70 pointer-events-none' : ''
          }`}
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Duration (Days)</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="3"
            max="150"
            step="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className={`flex-grow h-2 bg-[var(--color-background)] rounded-lg appearance-none cursor-pointer ${
              !isCustom ? 'opacity-70 pointer-events-none' : ''
            } ${themeAccent}`}
          />
          <div className={`w-12 text-center font-bold text-xl ${!isCustom ? 'opacity-70' : ''}`}>
            {duration}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSection;
