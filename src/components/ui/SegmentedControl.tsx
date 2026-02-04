import React from 'react';

interface Option<T extends string> {
  id: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  theme: {
    badge: string;
    // We accept a string for color/border but specifically use badge for active state
  };
  disabled?: boolean;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  theme,
  disabled = false,
}: SegmentedControlProps<T>) => {
  return (
    <div
      className={`flex bg-[var(--color-background)] p-1 rounded-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`cursor-pointer flex-1 py-1 text-xs font-bold rounded transition-all ${
            value === opt.id
              ? `${theme.badge} shadow-sm`
              : 'text-[var(--color-text-muted)] hover:text-white'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
};
