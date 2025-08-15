import type { Metadata } from 'next';
import { generateMetadata } from '@/utils/metadata';

// Generate metadata for the 404 page
export const metadata: Metadata = generateMetadata({
  title: '404 - Page Not Found',
  description:
    "Oops! The page you're looking for doesn't exist. Return to the homepage to find our games and hubs.",
  // Good practice to prevent search engines from indexing the 404 page
  robots: {
    index: false,
    follow: true,
  },
});

export default function NotFound() {
  return <>Not Found</>;
}
