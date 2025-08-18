'use client';

import type { ChallengeDoc } from '@/types';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChallengeStatusBannerProps {
  status: ChallengeDoc['status'];
}

const ChallengeStatusBanner = ({ status }: ChallengeStatusBannerProps) => {
  if (status === 'active') {
    return null;
  }

  const isCompleted = status === 'completed';

  const config = {
    bgColor: isCompleted ? 'bg-green-900/50' : 'bg-red-900/50',
    borderColor: isCompleted ? 'border-green-500' : 'border-red-500',
    textColor: isCompleted ? 'text-green-400' : 'text-red-400',
    icon: isCompleted ? faCheckCircle : faTimesCircle,
    title: isCompleted ? 'Challenge Completed' : 'Challenge Failed',
    message: isCompleted
      ? 'Congratulations! You can review your progress below.'
      : 'This challenge was not completed. You can review your progress or start a new one from the dashboard.',
  };

  return (
    <div
      className={`border-l-4 ${config.borderColor} ${config.bgColor} p-4 rounded-md mb-8`}
      role="alert">
      <div className="flex items-center">
        <FontAwesomeIcon icon={config.icon} className={`text-2xl ${config.textColor} mr-4`} />
        <div>
          <p className={`font-bold text-lg ${config.textColor}`}>{config.title}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{config.message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeStatusBanner;
