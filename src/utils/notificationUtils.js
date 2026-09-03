/**
 * Phone & Browser Web Notification Helper for Our Love Hub
 * Supports Mobile (Android Chrome/Samsung, iOS 16.4+ PWA) and Desktop browsers
 */

export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'granted' | 'denied' | 'default'
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    alert('Bu tarayıcı veya cihaz bildirim desteği sunmuyor.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const sendCycleNotificationToTahir = (phaseInfo) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = `🌸 Ceren'in Döngü Durumu: ${phaseInfo.name}`;
    const options = {
      body: `${phaseInfo.actionBadge}\n\n${phaseInfo.tahirTip}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'ceren-cycle-status',
      renotify: true,
      vibrate: [200, 100, 200], // vibration on mobile phones
    };

    // Try service worker notification first (better on Android/PWA)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, options);
      });
    } else {
      // Direct Web Notification
      new Notification(title, options);
    }
    return true;
  } catch (e) {
    console.warn('Could not send notification:', e);
    return false;
  }
};
