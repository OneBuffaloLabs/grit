import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge, deleteAllChallenges } from '@/lib/db';
import { ChallengeDoc } from '@/types';
import FailModal from '../FailModal';

interface DangerZoneProps {
  challenge?: ChallengeDoc;
  contextChallengeId?: string;
  onClose: () => void;
}

export const DangerZone = ({ challenge, contextChallengeId, onClose }: DangerZoneProps) => {
  const dispatch = useChallengeDispatch();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  const isReadOnly = challenge?.status !== 'active';

  const handleFailConfirm = async () => {
    if (!challenge || isReadOnly) return;

    dispatch({ type: 'START_LOADING' });
    try {
      const failedChallenge = { ...challenge, status: 'failed' as const };
      await updateChallenge(failedChallenge);

      if (contextChallengeId === challenge._id) {
        dispatch({ type: 'SET_CHALLENGE', payload: null });
      }

      router.push('/app');
    } catch (error) {
      console.error('Failed to update challenge status:', error);
      dispatch({ type: 'STOP_LOADING' });
    }
    setIsFailModalOpen(false);
    onClose();
  };

  const handleDeleteAll = async () => {
    if (
      confirm(
        'ARE YOU SURE? This will permanently delete ALL challenges and history. This cannot be undone.'
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteAllChallenges();
        dispatch({ type: 'SET_CHALLENGE', payload: null });
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete all data:', error);
        alert('Failed to reset app.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      {challenge ? (
        <div className={isReadOnly ? 'opacity-50' : ''}>
          <h4 className="text-lg font-bold text-[var(--color-danger)] mb-2">Danger Zone</h4>
          <button
            onClick={() => setIsFailModalOpen(true)}
            disabled={isReadOnly}
            className="w-full bg-transparent border-2 border-[var(--color-danger)] text-[var(--color-danger)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--color-danger)] hover:text-white transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed disabled:border-gray-600 disabled:text-gray-600 disabled:hover:bg-transparent flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            Mark as Failed (Start Over)
          </button>
          <p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
            This will mark your current challenge as failed and archive it.
          </p>
        </div>
      ) : (
        <div>
          <h4 className="text-lg font-bold text-[var(--color-danger)] mb-2">Danger Zone</h4>
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-lg">
            <FontAwesomeIcon icon={faTrash} />
            {isDeleting ? 'Deleting...' : 'Delete All Data'}
          </button>
          <p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
            Permanently delete all challenges and history. Cannot be undone.
          </p>
        </div>
      )}

      <FailModal
        isOpen={isFailModalOpen}
        onClose={() => setIsFailModalOpen(false)}
        onConfirm={handleFailConfirm}
      />
    </>
  );
};
