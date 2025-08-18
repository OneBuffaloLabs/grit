'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface FailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FailModal = ({ isOpen, onClose, onConfirm }: FailModalProps) => {
  const [isFailing, setIsFailing] = useState(false);

  const handleConfirm = async () => {
    setIsFailing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Failed to reset challenge:', error);
    } finally {
      setIsFailing(false);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="relative bg-[var(--color-secondary)] p-6 rounded-lg max-w-sm w-full flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center">
          <h3 className="text-2xl font-bold font-orbitron text-[var(--color-danger)]">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            Start Over?
          </h3>
          <button
            onClick={onClose}
            className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        <p className="text-[var(--color-text-muted)]">
          Are you sure you want to start over? This action will archive your current progress and
          reset you to Day 1. This cannot be undone.
        </p>

        <div className="mt-2 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isFailing}
            className="bg-[var(--color-danger)] text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed">
            {isFailing ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              'Confirm & Start Over'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailModal;
