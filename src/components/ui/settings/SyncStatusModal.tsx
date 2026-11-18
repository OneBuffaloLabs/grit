'use client';

import React, { useEffect, useState } from 'react';
import { useHerdSync } from '@onebuffalolabs/herd-sync';
import { WebRTCAdapter, SyncModal } from '@onebuffalolabs/adapter-webrtc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';

interface WebRTCAdapterExtended extends WebRTCAdapter {
  isConnected?: boolean;
  peers?: Map<string, unknown>;
}

export const SyncStatusModal = () => {
  const { db } = useHerdSync();
  const [open, setOpen] = useState(false);
  const [adapter, setAdapter] = useState<WebRTCAdapterExtended | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!db) return;
    const webrtcAdapter = new WebRTCAdapter(db) as WebRTCAdapterExtended;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdapter(webrtcAdapter);

    const interval = setInterval(() => {
      setIsConnected(Boolean(webrtcAdapter.isConnected || webrtcAdapter.peers?.size));
    }, 1000);

    return () => {
      clearInterval(interval);
      void webrtcAdapter.stop();
    };
  }, [db]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('pair=')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, []);

  return (
    <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-surface-border)] mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold font-orbitron flex items-center gap-2">
          <FontAwesomeIcon icon={faNetworkWired} className="text-[var(--color-primary)]" />
          Direct Device-to-Device Sync
        </h4>
        <div>
          {isConnected ? (
            <span className="text-green-400 flex items-center gap-1.5 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Connected
            </span>
          ) : (
            <span className="text-gray-400 flex items-center gap-1.5 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-gray-500" /> Ready to Sync
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Connect directly with another device using HerdSync and WebRTC QR-code signaling. No cloud servers required.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm">
        <FontAwesomeIcon icon={faNetworkWired} />
        Sync Nearby Devices (QR Pairing)
      </button>

      {open && adapter && (
        <SyncModal
          adapter={adapter}
          onClose={() => setOpen(false)}
          colors={{
            background: '#1a1a1a',
            text: '#f5f5f5',
            primary: '#e53e3e',
            primaryText: '#ffffff',
            border: '#333333',
            inputBackground: '#2c2c2c',
          }}
          classNames={{
            dialog: 'shadow-2xl border border-[var(--color-surface-border)] rounded-xl bg-[var(--color-secondary)]',
            primaryButton: 'rounded-lg font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white',
            secondaryButton: 'rounded-lg border border-[var(--color-surface-border)] text-sm text-[var(--color-text-muted)] hover:text-white',
          }}
        />
      )}
    </div>
  );
};

export default SyncStatusModal;
