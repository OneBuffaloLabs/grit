import { ChallengeType } from '@/types';

interface ThemeConfig {
  color: string;
  border: string;
  bgLight: string;
  accent: string;
  button: string;
  shadow: string;
  badge: string;
  toggle: string; // <--- NEW PROPERTY
}

export const THEME: Record<ChallengeType, ThemeConfig> = {
  soft: {
    color: 'text-green-500',
    border: 'border-green-500',
    bgLight: 'bg-green-500/10',
    accent: 'accent-green-500',
    button: 'bg-green-600 hover:bg-green-500 shadow-green-900/20',
    shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]',
    badge: 'bg-green-500/20 text-green-500',
    toggle: 'peer-checked:bg-green-500',
  },
  balanced: {
    color: 'text-orange-400',
    border: 'border-orange-400',
    bgLight: 'bg-orange-400/10',
    accent: 'accent-orange-400',
    button: 'bg-orange-500 hover:bg-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.4)]',
    shadow: 'shadow-[0_0_20px_rgba(251,146,60,0.2)]',
    badge: 'bg-orange-400/20 text-orange-400',
    toggle: 'peer-checked:bg-orange-400',
  },
  hard: {
    color: 'text-red-500',
    border: 'border-red-500',
    bgLight: 'bg-red-500/10',
    accent: 'accent-red-500',
    button: 'bg-red-600 hover:bg-red-500 shadow-red-900/20',
    shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    badge: 'bg-red-500/20 text-red-500',
    toggle: 'peer-checked:bg-red-500',
  },
  custom: {
    color: 'text-blue-500',
    border: 'border-blue-500',
    bgLight: 'bg-blue-500/10',
    accent: 'accent-blue-500',
    button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    badge: 'bg-blue-500/20 text-blue-500',
    toggle: 'peer-checked:bg-blue-500',
  },
};
