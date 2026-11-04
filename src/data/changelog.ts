// --- FontAwesome ---
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faRocket,
  faTrophy,
  faPaintRoller,
  faBug,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';

// --- Types ---
import type { ChangeType, ChangelogEntry, YearLog } from '@/types';

// --- Data ---
import changelog2026 from './changelog/2026.json';
import changelog2025 from './changelog/2025.json';

export type { ChangeType, ChangelogEntry, YearLog };

export const getIconForType = (type: ChangeType): IconDefinition => {
  switch (type) {
    case 'launch':
      return faRocket;
    case 'feature':
      return faTrophy;
    case 'update':
      return faPaintRoller;
    case 'fix':
      return faBug;
    default:
      return faCodeBranch;
  }
};

export const CHANGELOG_DATA: YearLog[] = [
  {
    year: '2026',
    entries: changelog2026 as ChangelogEntry[],
  },
  {
    year: '2025',
    entries: changelog2025 as ChangelogEntry[],
  },
];
