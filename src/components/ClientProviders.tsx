'use client';

import React from 'react';
import { HerdSyncProvider } from '@onebuffalolabs/herd-sync';
import { ChallengeProvider } from '@/context/ChallengeContext';
import AnalyticsInitializer from '@/components/AnalyticsInitializer';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <HerdSyncProvider live={true} name="grit_challenges" retry={true}>
      <ChallengeProvider>
        {children}
        <AnalyticsInitializer />
      </ChallengeProvider>
    </HerdSyncProvider>
  );
}
