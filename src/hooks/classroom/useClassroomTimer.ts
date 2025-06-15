
import { useState, useEffect, useRef } from "react";

export function useClassroomTimer() {
  const [classTime, setClassTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized class timer with proper cleanup
  useEffect(() => {
    console.log("Setting up class timer");
    
    timerRef.current = setInterval(() => {
      setClassTime(prev => prev + 1);
    }, 1000);

    return () => {
      console.log("Cleaning up class timer");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []); // Empty dependency array - timer should only be set up once

  return { classTime };
}
