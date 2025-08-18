'use client';

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface NotificationProps {
  type: 'success' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

const notificationStyles = {
  success: {
    bg: 'bg-green-600',
    icon: faCheckCircle,
  },
  info: {
    bg: 'bg-blue-600',
    icon: faInfoCircle,
  },
};

const Notification = ({ type, title, message, onClose }: NotificationProps) => {
  const styles = notificationStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4">
      <div
        className={`${styles.bg} text-white p-4 rounded-lg shadow-lg flex items-center justify-between`}>
        <div className="flex items-center">
          <FontAwesomeIcon icon={styles.icon} className="mr-3 text-2xl" />
          <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-xl hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
          aria-label="Close notification">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
