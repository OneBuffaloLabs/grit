'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSpinner,
  faSave,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { version } from '../../../package.json';
import FailModal from './FailModal';
import type { NotificationProps } from './Notification';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showNotification: (notification: Omit<NotificationProps, 'onClose'>) => void;
}

const SettingsModal = ({ isOpen, onClose, showNotification }: SettingsModalProps) => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const router = useRouter();

  const isReadOnly = challenge?.status !== 'active';

  const [startDate, setStartDate] = useState('');
  const [originalStartDate, setOriginalStartDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  React.useEffect(() => {
    if (challenge?.startDate) {
      const date = new Date(challenge.startDate);
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
        .getDate()
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
      setStartDate(formattedDate);
      setOriginalStartDate(formattedDate);
    }
  }, [challenge?.startDate, isOpen]);

  const handleSave = async () => {
    if (!challenge || startDate === originalStartDate || isReadOnly) return;

    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(20)\d{2}$/;
    if (!dateRegex.test(startDate)) {
      alert('Invalid date format. Please use MM/DD/YYYY.');
      return;
    }

    const [month, day, year] = startDate.split('/').map(Number);
    const newStartDate = new Date(year, month - 1, day);

    setIsSaving(true);
    try {
      const updatedChallenge = { ...challenge, startDate: newStartDate.toISOString() };
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
        showNotification({
          type: 'success',
          title: 'Settings Saved',
          message: 'Your challenge start date has been updated.',
        });
        onClose();
      }
    } catch (error) {
      console.error('Failed to update start date:', error);
      alert('Failed to update start date. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFailConfirm = async () => {
    if (!challenge || isReadOnly) return;

    dispatch({ type: 'START_LOADING' });
    try {
      const failedChallenge = { ...challenge, status: 'failed' as const };
      await updateChallenge(failedChallenge);

      dispatch({ type: 'SET_CHALLENGE', payload: null });
      router.push('/app');
    } catch (error) {
      console.error('Failed to update challenge status:', error);
      dispatch({ type: 'STOP_LOADING' });
    }
    setIsFailModalOpen(false);
    onClose();
  };

  const hasChanges = startDate !== originalStartDate;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={onClose}>
        <div
          className="relative bg-[var(--color-secondary)] p-6 rounded-lg max-w-sm w-full flex flex-col gap-4"
          onClick={(e) => e.stopPropagation()}>
          <header className="flex justify-between items-center">
            <h3 className="text-2xl font-bold font-orbitron">Settings</h3>
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
            className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-lg hover:bg-gray-700 transition-colors">
            <FontAwesomeIcon icon={faGithub} className="text-[var(--color-text-muted)]" size="2x" />
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">View on GitHub</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Help improve Grit or report an issue.
              </p>
            </div>
          </a>

          <div className="text-center text-sm text-[var(--color-text-muted)]">
            App Version: {version}
          </div>

          <div className={isReadOnly ? 'opacity-50' : ''}>
            <label htmlFor="start-date" className="block text-sm font-medium mb-2">
              Challenge Start Date
            </label>
            <input
              type="text"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              disabled={isReadOnly}
              className="w-full p-2 bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-md border border-gray-600 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-2 text-right">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges || isReadOnly}
              className="w-full sm:w-auto bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed">
              {isSaving ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
                </>
              )}
            </button>
          </div>

          <div className="border-t border-gray-700 my-2"></div>

          <div className={isReadOnly ? 'opacity-50' : ''}>
            <h4 className="text-lg font-bold text-[var(--color-danger)] mb-2">Danger Zone</h4>
            <button
              onClick={() => setIsFailModalOpen(true)}
              disabled={isReadOnly}
              className="w-full bg-transparent border-2 border-[var(--color-danger)] text-[var(--color-danger)] font-bold py-2 px-4 rounded-lg hover:bg-[var(--color-danger)] hover:text-white transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed disabled:border-gray-600 disabled:text-gray-600 disabled:hover:bg-transparent">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Start Over
            </button>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              If you&apos;ve failed a day, you must start over. This will mark your current
              challenge as failed and return you to the challenge list.
            </p>
          </div>
        </div>
      </div>

      <FailModal
        isOpen={isFailModalOpen}
        onClose={() => setIsFailModalOpen(false)}
        onConfirm={handleFailConfirm}
      />
    </>
  );
};

export default SettingsModal;
