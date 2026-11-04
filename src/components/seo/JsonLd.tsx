// --- React ---
import React from 'react';

// --- Config & Data ---
import { siteConfig } from '@/config/site';
import socialsData from '@/data/socials.json';

interface BusinessConfig {
  type: string;
  priceRange?: string;
  city: string;
  region: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface JsonLdProps {
  includeLocalBusiness?: boolean;
}

export default function JsonLd({ includeLocalBusiness = false }: JsonLdProps): React.JSX.Element {
  const sameAsUrls = Array.isArray(socialsData)
    ? socialsData.map((s: { url: string }) => s.url).filter(Boolean)
    : [];

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
      },
      inLanguage: siteConfig.locale,
    },
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/images/logos/logo.png`,
      sameAs: sameAsUrls,
      parentOrganization: siteConfig.creator
        ? {
            '@type': 'Organization',
            name: siteConfig.creator.name,
            url: siteConfig.creator.url,
          }
        : undefined,
    },
  ];

  const business = siteConfig.business as unknown as BusinessConfig | null | undefined;

  if (includeLocalBusiness && business) {
    graph.push({
      '@type': business.type,
      '@id': `${siteConfig.url}/#business`,
      name: siteConfig.name,
      url: siteConfig.url,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      description: siteConfig.description,
      priceRange: business.priceRange,
      address: {
        '@type': 'PostalAddress',
        addressLocality: business.city,
        addressRegion: business.region,
        addressCountry: business.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude,
      },
      sameAs: sameAsUrls,
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}
