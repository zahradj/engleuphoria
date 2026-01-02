import { useState, useEffect, useMemo } from 'react';

interface CountdownResult {
  timeRemaining: number;
  minutes: number;
  seconds: number;
  formattedTime: string;
  isStartingSoon: boolean;
  canEnter: boolean;
  hasStarted: boolean;
}

export const useNextClassCountdown = (scheduledAt: Date | null): CountdownResult => {
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    if (!scheduledAt) return 0;
    return Math.max(0, Math.floor((scheduledAt.getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!scheduledAt) return;

    const calculateRemaining = () => {
      return Math.max(0, Math.floor((scheduledAt.getTime() - Date.now()) / 1000));
    };

    setTimeRemaining(calculateRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledAt]);

  const result = useMemo<CountdownResult>(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const canEnter = timeRemaining <= 5 * 60; // 5 minutes or less
    const isStartingSoon = timeRemaining <= 5 * 60 && timeRemaining > 0;
    const hasStarted = timeRemaining <= 0;

    return {
      timeRemaining,
      minutes,
      seconds,
      formattedTime,
      isStartingSoon,
      canEnter,
      hasStarted
    };
  }, [timeRemaining]);

  return result;
};
