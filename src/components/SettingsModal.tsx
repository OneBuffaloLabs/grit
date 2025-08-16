'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { requestNotificationPermission } from '@/lib/notifications';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
    setPermission(Notification.permission); // Re-check permission after request
  };

  const isEnabled = permission === 'granted';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="relative bg-[var(--color-secondary)] p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-orbitron">Settings</h2>
          <button
            onClick={onClose}
            className="text-2xl text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] cursor-pointer">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>
        <div>
          <h3 className="text-xl font-bold mb-2">Daily Reminders</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Get a daily push notification to remind you to complete your tasks.
          </p>
          <button
            onClick={handleEnableNotifications}
            disabled={isEnabled}
            className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 cursor-pointer ${
              isEnabled
                ? 'bg-green-600 cursor-not-allowed'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
            }`}>
            {isEnabled ? 'Reminders Enabled' : 'Enable Daily Reminders'}
          </button>
          {permission === 'denied' && (
            <p className="text-xs text-red-400 mt-2">
              You have blocked notifications. To enable them, you'll need to update your browser
              settings for this site.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
