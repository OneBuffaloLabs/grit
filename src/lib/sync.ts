'use client';

// Sync is handled by @onebuffalolabs/adapter-webrtc and @onebuffalolabs/herd-sync directly in SyncStatusModal.tsx
export interface P2PSyncManager {
  startSync: () => void;
  stopSync: () => void;
  createOffer: () => Promise<string>;
  acceptOffer: (offerJson: string) => Promise<string>;
  acceptAnswer: (answerJson: string) => Promise<void>;
  getStatus: () => 'disconnected' | 'connecting' | 'connected' | 'syncing';
}

export const createWebRTCSyncClient = () => {
  return {
    startSync: () => {},
    stopSync: () => {},
    createOffer: async () => '',
    acceptOffer: async () => '',
    acceptAnswer: async () => {},
    getStatus: () => 'disconnected' as const,
  };
};
