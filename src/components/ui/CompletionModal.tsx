'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrophy, faWeight, faBook, faImage } from '@fortawesome/free-solid-svg-icons';
import { ChallengeDoc } from '@/types';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeDoc | null;
}

const CompletionModal = ({ isOpen, onClose, challenge }: CompletionModalProps) => {
  if (!isOpen || !challenge) {
    return null;
  }

  const { startDate, completionDate, days } = challenge;
  const completedDays = Object.values(days).filter((day) => day.completed).length;
  const startWeight = days[1]?.weight;
  const endWeight = days[challenge.duration]?.weight;

  let weightChange = 0;
  if (startWeight && endWeight) {
    weightChange = endWeight - startWeight;
  }

  const totalPhotos = Object.values(days).filter((day) => day.photoAttached).length;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="relative bg-secondary p-6 rounded-lg max-w-lg w-full flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center">
          <h3 className="text-3xl font-bold font-orbitron text-primary">
            <FontAwesomeIcon icon={faTrophy} className="mr-2" />
            Challenge Complete!
          </h3>
          <button
            onClick={onClose}
            className="text-xl text-text-muted hover:text-foreground cursor-pointer"
            aria-label="Close modal">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        <div className="text-center space-y-2">
          <p className="text-lg text-foreground">
            Congratulations on completing the {challenge.type} challenge!
          </p>
          <p className="text-sm text-text-muted">
            From {new Date(startDate).toLocaleDateString()} to{' '}
            {completionDate ? new Date(completionDate).toLocaleDateString() : ''}
          </p>

          <p className="text-md font-medium text-foreground pt-2">
            You showed up and executed for{' '}
            <span className="text-primary font-bold">{completedDays} days</span>. That is true grit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-surface p-4 rounded-lg">
            <FontAwesomeIcon icon={faWeight} className="text-2xl text-accent mb-2" />
            <p className="text-xl font-bold">{weightChange.toFixed(1)} lbs</p>
            <p className="text-sm text-text-muted">Weight Change</p>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <FontAwesomeIcon icon={faBook} className="text-2xl text-accent mb-2" />
            <p className="text-xl font-bold">{challenge.duration * 10}</p>
            <p className="text-sm text-text-muted">Pages Read</p>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <FontAwesomeIcon icon={faImage} className="text-2xl text-accent mb-2" />
            <p className="text-xl font-bold">{totalPhotos}</p>
            <p className="text-sm text-text-muted">Photos Taken</p>
          </div>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
