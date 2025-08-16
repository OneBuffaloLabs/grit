'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface PhotoModalProps {
  imageUrl: string;
  day: number;
  onClose: () => void;
}

const PhotoModal = ({ imageUrl, day, onClose }: PhotoModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className="relative bg-[var(--color-secondary)] p-4 rounded-lg max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        <header className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold font-orbitron">Day {day}</h3>
          <button
            onClick={onClose}
            className="text-2xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>
        <div className="relative w-full aspect-[4/3]">
          <img
            src={imageUrl}
            alt={`Enlarged progress for day ${day}`}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
