import { useState, useEffect } from "react";

export const useClassStartTiming = (scheduledAt: string, duration: number) => {
  const [canStart, setCanStart] = useState(false);
  const [minutesUntil, setMinutesUntil] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const lessonTime = new Date(scheduledAt);
      const diff = (lessonTime.getTime() - now.getTime()) / (1000 * 60);
      
      setMinutesUntil(Math.round(diff));
      
      // Can start 10 minutes before, until lesson ends
      const canStartNow = diff <= 10 && diff >= -duration;
      setCanStart(canStartNow);
      
      if (diff > 10) {
        setStatusMessage(`Opens in ${Math.round(diff)} minutes`);
      } else if (diff > 0 && diff <= 10) {
        setStatusMessage("Ready to start");
      } else if (diff <= 0 && diff >= -duration) {
        setStatusMessage("Live now");
      } else {
        setStatusMessage("Class ended");
      }
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [scheduledAt, duration]);

  return { canStart, minutesUntil, statusMessage };
};
