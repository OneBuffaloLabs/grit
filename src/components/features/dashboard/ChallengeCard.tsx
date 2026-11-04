'use client';

// --- React ---
import React from 'react';

// --- Next / Framework ---
import Link from 'next/link';

// --- Icons ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faRunning, faTrashCan } from '@fortawesome/free-solid-svg-icons';

// --- Types ---
import type { ChallengeDoc } from '@/types';

// --- Data ---
import { THEME } from '@/data/theme';

export interface ChallengeCardProps {
  challenge: ChallengeDoc;
  onDelete?: (id: string) => Promise<void> | void;
}

export const ChallengeCard = ({ challenge, onDelete }: ChallengeCardProps) => {
  const { duration, type, name } = challenge;
  const theme = THEME[type] || THEME.hard;
  const completedDays = Object.values(challenge.days).filter((day) => day.completed).length;

  const progressPercentage =
    challenge.status === 'completed' ? 100 : (completedDays / duration) * 100;

  const getStatusInfo = () => {
    switch (challenge.status) {
      case 'active':
        return {
          label: 'Active',
          icon: (
            <FontAwesomeIcon icon={faRunning} size="lg" className={theme.color} title="Active" />
          ),
          details: `Day ${completedDays + 1} of ${duration}`,
          statusColor: theme.color,
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: (
            <FontAwesomeIcon icon={faCheck} size="lg" className={theme.color} title="Completed" />
          ),
          details: challenge.completionDate
            ? new Date(challenge.completionDate).toLocaleDateString()
            : 'Mission Accomplished',
          statusColor: theme.color,
        };
      case 'failed':
        return {
          label: 'Failed',
          icon: <FontAwesomeIcon icon={faTimes} size="lg" className={theme.color} title="Failed" />,
          details: `Failed after ${completedDays} days`,
          statusColor: theme.color,
        };
      default:
        return {
          label: 'Unknown',
          icon: null,
          details: '',
          statusColor: 'text-gray-500',
        };
    }
  };

  const getButtonText = () => {
    switch (challenge.status) {
      case 'completed':
        return 'View Journey';
      case 'failed':
        return 'View Attempt';
      default:
        return 'Track Progress';
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      'Are you sure you want to delete this challenge? This action is permanent and will remove all progress.'
    );

    if (confirmed && onDelete) {
      void onDelete(challenge._id);
    }
  };

  const { label, icon, details, statusColor } = getStatusInfo();

  return (
    <div
      className={`relative group bg-secondary rounded-lg shadow-lg p-6 h-full flex flex-col justify-between transform transition-all hover:scale-105 border-t-4 ${theme.border}`}>
      <Link
        href={`/app/challenge/?id=${challenge._id}`}
        className="absolute inset-0 z-0 rounded-lg"
        aria-label={`Open ${name || type} challenge`}
      />

      <div className="relative z-10 pointer-events-none">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={theme.icon} className={`text-xl ${theme.color}`} />
            <div>
              <h3 className="text-xl font-bold font-orbitron text-foreground capitalize">
                {name || type.replace('-', ' ')}
              </h3>
              <div
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 mt-1 ${statusColor}`}>
                {icon}
                <span>{label}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="pointer-events-auto text-[var(--color-text-muted)] hover:text-red-500 p-2 -mr-2 -mt-2 transition-colors cursor-pointer rounded-lg hover:bg-neutral-800"
            aria-label={`Delete ${name || type} challenge`}
            title="Delete Challenge">
            <FontAwesomeIcon icon={faTrashCan} className="text-base" />
          </button>
        </div>

        <div className="w-full bg-neutral-700 rounded-full h-4 mb-2">
          <div
            className={`${theme.button.split(' ')[0]} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={completedDays}
            aria-valuemin={0}
            aria-valuemax={duration}
          />
        </div>
        <p className="text-sm text-neutral-400 mb-2">{details}</p>
        <p className="text-xs text-text-muted">
          Started: {new Date(challenge.startDate).toLocaleDateString()}
        </p>
      </div>

      <div
        className={`mt-4 ${theme.button} text-white font-bold py-2 px-4 rounded-lg transition-colors w-full text-center relative z-0 pointer-events-none`}>
        {getButtonText()}
      </div>
    </div>
  );
};

export default ChallengeCard;
