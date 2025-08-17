'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface CompletionAlertProps {
  day: number;
  onClose: () => void;
  onGoToNextDay: () => void;
}

const CompletionAlert = ({ day, onClose, onGoToNextDay }: CompletionAlertProps) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4">
      <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-2xl" />
          <div>
            <p className="font-bold">Day {day} Complete!</p>
            <p className="text-sm">Great job, keep up the momentum.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onGoToNextDay}
            className="bg-white text-green-600 font-bold py-1 px-3 rounded-md text-sm hover:bg-green-100 transition-colors cursor-pointer">
            Next Day <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <button
            onClick={onClose}
            className="text-xl hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
            aria-label="Close alert">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionAlert;
