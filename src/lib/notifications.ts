'use client';

export const registerServiceWorker = () => {
  // This function is kept for PWA functionality but is no longer needed for push.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => console.log('Service Worker registered:', registration.scope))
      .catch((error) => console.error('Service Worker registration failed:', error));
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // You can now schedule a notification here or store the permission state.
    new Notification('Grit Reminders Enabled!', {
      body: "You're all set up to receive daily reminders.",
      icon: '/icon.png',
    });
  }
};
