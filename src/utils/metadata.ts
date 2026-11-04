// --- Next ---
import type { Metadata } from 'next';

// --- Config ---
import { siteConfig } from '@/config/site';

interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  urlPath?: string;
  imageUrl?: string;
  robots?: Metadata['robots'];
}

/**
 * Generates page metadata merged against base boilerplate siteConfig.
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  urlPath = '/',
  imageUrl,
  robots,
}: PageMetadata = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
  const pageDescription = description || siteConfig.description;
  const cleanPath = urlPath === '/' ? '/' : `${urlPath.replace(/\/$/, '')}/`;
  const pageUrl = `${siteConfig.url}${cleanPath}`;
  const allKeywords = [...new Set([...siteConfig.keywords, ...keywords])];
  const ogImageUrl = imageUrl
    ? `${siteConfig.url}${imageUrl}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    title: {
      template: siteConfig.titleTemplate,
      default: siteConfig.defaultTitle,
    },
    ...(title && { title: { absolute: pageTitle } }),
    description: pageDescription,
    keywords: allKeywords,
    ...(robots && { robots }),
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
      title: siteConfig.name,
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title || siteConfig.name} Preview`,
          type: 'image/png',
        },
      ],
      locale: siteConfig.locale,
      type: 'website',
    },
  };

  if (siteConfig.creator?.twitter) {
    metadata.twitter = {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      creator: siteConfig.creator.twitter,
      images: [ogImageUrl],
    };
  }

  return metadata;
}
