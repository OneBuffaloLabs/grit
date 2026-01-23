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
  details?: string[];
}

export interface YearLog {
  year: string;
  entries: ChangelogEntry[];
}

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
        date: 'Jan 23',
        title: 'Unified Dashboard & Global Control',
        version: 'v1.6.0',
        type: 'feature',
        description:
          "We've cleaned up the experience by unifying your challenge history and giving you total control over your local data.",
        details: [
          'Redesigned the Dashboard to show all active, failed, and completed challenges in one place with dynamic thematic styling.',
          'Added a "Danger Zone" to Global Settings, allowing you to completely reset the app and delete all local data.',
          'Simplified navigation by removing the redundant History page in favor of a single, powerful journey view.',
          'Fixed a UI bug where card borders were not correctly reflecting the challenge tier color.',
        ],
      },
      {
        date: 'Jan 16',
        title: 'A New Foundation',
        version: 'v1.5.0',
        type: 'update',
        description:
          "We've completely reimagined the platform to support your journey, no matter which level of difficulty you choose. This update lays the groundwork for the future of Grit.",
        details: [
          'Overhauled the Challenge Setup experience, allowing you to choose between 75 Hard, 75 Soft, 75 Balanced, or a fully Custom protocol.',
          'Launched this Product Timeline page to keep you in the loop on our development journey.',
          'Added comprehensive pages for Privacy Policy and Terms of Service to detail exactly how our Local-First architecture protects you.',
          'Redesigned the Footer for better navigation, transparency, and easier access to legal/support resources.',
        ],
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
