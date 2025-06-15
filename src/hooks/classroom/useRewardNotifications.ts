
import { useState, useCallback } from "react";

interface RewardNotification {
  id: string;
  points: number;
  reason: string;
  timestamp: Date;
}

export function useRewardNotifications() {
  const [notifications, setNotifications] = useState<RewardNotification[]>([]);

  const showRewardNotification = useCallback((points: number, reason: string) => {
    const notification: RewardNotification = {
      id: Date.now().toString(),
      points,
      reason,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    showRewardNotification,
    removeNotification
  };
}
