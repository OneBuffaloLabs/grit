// --- Next ---
import type { Metadata } from 'next';

// Define the structure for page-specific metadata
interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  urlPath?: string;
  imageUrl?: string;
  robots?: Metadata['robots'];
}

// --- Base Metadata ---
const BASE_URL = 'https://grit.onebuffalolabs.com';
const SITE_NAME = 'Grit';
const TWITTER_CREATOR = '@onebuffalolabs';
const GOOGLE_ADSENSE_ACCOUNT = '';
const DEFAULT_TITLE = 'Grit: The Privacy-First Discipline Tracker';
const DEFAULT_DESCRIPTION =
  'The ultimate privacy-first tracker for 75 Hard, 75 Soft, and 75 Balanced. Grit is an offline-ready PWA that keeps your transformation data 100% on your device. No accounts, no cloud, no compromises.';
const DEFAULT_OG_IMAGE = ``;
const DEFAULT_KEYWORDS = [
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
];

/**
 * Generates metadata for a page, merging with site-wide defaults.
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  urlPath = '',
  imageUrl,
  robots,
}: PageMetadata = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageUrl = `${BASE_URL}${urlPath}`;
  const allKeywords = [...new Set([...DEFAULT_KEYWORDS, ...keywords])];
  const ogImageUrl = imageUrl ? `${BASE_URL}${imageUrl}` : DEFAULT_OG_IMAGE;
  const otherMetadata: Metadata['other'] = {};
  if (GOOGLE_ADSENSE_ACCOUNT) {
    otherMetadata['google-adsense-account'] = GOOGLE_ADSENSE_ACCOUNT;
  }

  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: pageUrl,
    },
    title: {
      template: `%s | ${SITE_NAME}`,
      default: DEFAULT_TITLE,
    },
    ...(title && { title: title }),
    description: pageDescription,
    keywords: allKeywords,
    ...(robots && { robots: robots }),
    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: '/apple-icon.png',
    },
    appleWebApp: {
      title: SITE_NAME,
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title || 'Grit Discipline Tracker'}`,
          type: 'image/png',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    ...(Object.keys(otherMetadata).length > 0 && { other: otherMetadata }),
  };

  if (TWITTER_CREATOR) {
    metadata.twitter = {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      creator: TWITTER_CREATOR,
      images: [ogImageUrl],
    };
  }

  return metadata;
}
