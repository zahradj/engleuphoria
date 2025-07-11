import { useState, useEffect } from 'react';

interface PWACapabilities {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  supportsNotifications: boolean;
  supportsPush: boolean;
  hasMediaCapabilities: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    supportsNotifications: 'Notification' in window,
    supportsPush: 'serviceWorker' in navigator && 'PushManager' in window,
    hasMediaCapabilities: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
  });

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if app is installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    
    setCapabilities(prev => ({ ...prev, isInstalled }));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setCapabilities(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for online/offline
    const handleOnline = () => setCapabilities(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setCapabilities(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
        setCapabilities(prev => ({ ...prev, isInstallable: false, isInstalled: true }));
        return true;
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
    
    return false;
  };

  const requestNotificationPermission = async () => {
    if (!capabilities.supportsNotifications) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!capabilities.supportsNotifications || Notification.permission !== 'granted') {
      return;
    }

    return new Notification(title, {
      icon: '/placeholder.svg',
      badge: '/placeholder.svg',
      ...options
    });
  };

  return {
    capabilities,
    installApp,
    requestNotificationPermission,
    sendNotification
  };
};