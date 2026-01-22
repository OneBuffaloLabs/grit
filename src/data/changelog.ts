import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faRocket,
  faTrophy,
  faPaintRoller,
  faBug,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';

export type ChangeType = 'launch' | 'feature' | 'update' | 'fix';

export interface ChangelogEntry {
  date: string;
  title: string;
  version: string;
  type: ChangeType;
  description: string;
}

export interface YearLog {
  year: string;
  entries: ChangelogEntry[];
}

// Helper to map string types to Icons (used in the UI component)
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
    entries: [
      {
        date: 'Jan 16',
        title: 'A New Foundation',
        version: 'v1.5.0',
        type: 'update',
        description:
          "We've completely reimagined the homepage to help you find your path with the 'Choose Your Hard' tiers. Plus, we launched this brand-new Product Timeline page so you can see exactly how Grit is evolving with every update!",
      },
    ],
  },
  {
    year: '2025',
    entries: [
      {
        date: 'Sep 19',
        title: 'Celebrate Your Wins',
        version: 'v1.1.0',
        type: 'feature',
        description:
          "Crossing the finish line is a massive achievement. We overhauled the Completion Modal to show more detailed stats and introduced a 'View Summary' feature.",
      },
      {
        date: 'Aug 18',
        title: 'Grit is Born',
        version: 'v1.0.0',
        type: 'launch',
        description:
          'The day it all started. We launched Grit with a simple mission: a privacy-first, offline-capable tracker for the 75 Hard challenge.',
      },
    ],
  },
];
