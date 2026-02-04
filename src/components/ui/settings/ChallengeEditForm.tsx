import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave } from '@fortawesome/free-solid-svg-icons';
import { ChallengeDoc } from '@/types';
import { updateChallenge } from '@/lib/db';
import { useChallengeDispatch } from '@/context/ChallengeContext';
import { ProtocolRulebook } from './ProtocolRulebook';
import type { NotificationProps } from '../Notification';

interface ChallengeEditFormProps {
  challenge: ChallengeDoc;
  contextChallengeId?: string;
  onClose: () => void;
  showNotification: (notification: Omit<NotificationProps, 'onClose'>) => void;
}

export const ChallengeEditForm = ({
  challenge,
  contextChallengeId,
  onClose,
  showNotification,
}: ChallengeEditFormProps) => {
  const dispatch = useChallengeDispatch();
  const [startDate, setStartDate] = useState('');
  const [originalStartDate, setOriginalStartDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (challenge.startDate) {
      const date = new Date(challenge.startDate);
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
        .getDate()
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
      setStartDate(formattedDate);
      setOriginalStartDate(formattedDate);
    }
  }, [challenge]);

  const isReadOnly = challenge.status !== 'active';
  const hasChanges = startDate !== originalStartDate;

  const handleSave = async () => {
    if (!hasChanges || isReadOnly) return;

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
        if (contextChallengeId === challenge._id) {
          dispatch({ type: 'SET_CHALLENGE', payload: newRev });
        }

        showNotification({
          type: 'success',
          title: 'Settings Saved',
          message: 'Your challenge start date has been updated.',
        });
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update start date:', error);
      alert('Failed to update start date. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className={isReadOnly ? 'opacity-50' : ''}>
        <label htmlFor="start-date" className="block text-sm font-bold mb-2">
          Challenge Start Date
        </label>
        <input
          type="text"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="MM/DD/YYYY"
          disabled={isReadOnly}
          className="w-full p-3 bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-lg border border-gray-600 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] disabled:cursor-not-allowed font-mono"
        />
      </div>

      <div className="mt-4 mb-2 text-right">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges || isReadOnly}
          className="w-full sm:w-auto bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-300 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg">
          {isSaving ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Changes
            </>
          )}
        </button>
      </div>

      <ProtocolRulebook rules={challenge.rules} />
    </>
  );
};
