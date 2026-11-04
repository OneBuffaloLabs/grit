/**
 * Global site configuration for Grit.
 */
export const siteConfig = {
  name: 'Grit',
  shortName: 'Grit',
  titleTemplate: '%s | Grit',
  defaultTitle: 'Grit: The Privacy-First Discipline Tracker',
  description:
    'The ultimate privacy-first tracker for 75 Hard, 75 Soft, and 75 Balanced. Grit is an offline-ready PWA that keeps your transformation data 100% on your device. No accounts, no cloud, no compromises.',
  url: 'https://grit.onebuffalolabs.com',
  ogImage: '',
  locale: 'en_US',
  creator: {
    name: 'One Buffalo Labs',
    url: 'https://onebuffalolabs.com',
    twitter: '@onebuffalolabs',
  },
  // Optional: Set to null or remove if project is purely digital/SaaS/open-source
  business: null,
  keywords: [
    '75 Hard',
    '75 Soft',
    '75 Balanced',
    '75 Hard Tracker',
    '75 Soft Tracker',
    '75 Balanced Tracker',
    'Discipline Tracker',
    'Mental Toughness',
    'Habit Tracker',
    'Privacy First App',
    'PouchDB',
    'Offline First',
    'PWA',
    'One Buffalo Labs',
  ],
};

export type SiteConfig = typeof siteConfig;
