'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChallengeState } from '@/context/ChallengeContext';
import { getChallengeById } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import packageJson from '../../../package.json';
import { ChallengeDoc } from '@/types';
import type { NotificationProps } from './Notification';

// Import refactored sub-components
import { ChallengeEditForm } from './settings/ChallengeEditForm';
import { DangerZone } from './settings/DangerZone';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showNotification: (notification: Omit<NotificationProps, 'onClose'>) => void;
  challengeOverride?: ChallengeDoc | null;
}

const SettingsModal = ({
  isOpen,
  onClose,
  showNotification,
  challengeOverride,
}: SettingsModalProps) => {
  const { challenge: contextChallenge } = useChallengeState();
  const searchParams = useSearchParams();
  const [activeChallenge, setActiveChallenge] = useState<ChallengeDoc | null>(null);

  // Load the correct challenge based on ID or Context
  useEffect(() => {
    const loadChallenge = async () => {
      const urlId = searchParams.get('id');

      if (urlId) {
        const doc = await getChallengeById(urlId);
        setActiveChallenge(doc);
      } else if (challengeOverride !== undefined) {
        setActiveChallenge(challengeOverride);
      } else {
        setActiveChallenge(contextChallenge);
      }
    };

    if (isOpen) {
      loadChallenge();
    }
  }, [isOpen, searchParams, challengeOverride, contextChallenge]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      {/* Fixed Scrolling: Added max-h-[90vh] and overflow-y-auto to allow internal scrolling
         if content exceeds viewport height.
      */}
      <div
        className="relative bg-[var(--color-secondary)] p-6 rounded-lg max-w-md w-full flex flex-col gap-4 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center">
          <h3 className="text-2xl font-bold font-orbitron">
            {activeChallenge ? 'Settings' : 'Global Settings'}
          </h3>
          <button
            onClick={onClose}
            className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer"
            aria-label="Close settings">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        <a
          href="https://github.com/OneBuffaloLabs/grit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-lg hover:bg-gray-700 transition-colors border border-[var(--color-surface-border)]">
          <FontAwesomeIcon icon={faGithub} className="text-[var(--color-text-muted)]" size="2x" />
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">View on GitHub</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Help improve Grit or report an issue.
            </p>
          </div>
        </a>

        <div className="text-center text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          App Version: {packageJson.version}
        </div>

        {activeChallenge ? (
          <ChallengeEditForm
            challenge={activeChallenge}
            contextChallengeId={contextChallenge?._id}
            onClose={onClose}
            showNotification={showNotification}
          />
        ) : null}

        <div className="border-t border-gray-700 my-2"></div>

        <DangerZone
          challenge={activeChallenge || undefined}
          contextChallengeId={contextChallenge?._id}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default SettingsModal;
