import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

interface ActivityCountdownTimerProps {
  className?: string;
}

export function ActivityCountdownTimer({ className = "" }: ActivityCountdownTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(300); // Default 5 minutes
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingTime, setIsSettingTime] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Activity time finished notification could be added here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsSettingTime(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const setNewTime = () => {
    const newSeconds = inputMinutes * 60;
    setTotalSeconds(newSeconds);
    setRemainingSeconds(newSeconds);
    setIsRunning(false);
    setIsSettingTime(false);
  };

  const getTimerColor = () => {
    const percentage = remainingSeconds / totalSeconds;
    if (percentage <= 0.1) return "text-red-600";
    if (percentage <= 0.2) return "text-orange-500";
    return "text-primary";
  };

  if (isSettingTime) {
    return (
      <div className={`flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg border ${className}`}>
        <Timer size={16} className="text-primary" />
        <Input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 h-6 text-sm"
          min="1"
          max="60"
        />
        <span className="text-sm text-muted-foreground">min</span>
        <Button size="sm" variant="outline" onClick={setNewTime} className="h-6 px-2 text-xs">
          Set
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setIsSettingTime(false)} className="h-6 px-2 text-xs">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg border ${className}`}>
      <Timer size={16} className="text-primary" />
      <span 
        className={`font-mono text-lg font-semibold cursor-pointer ${getTimerColor()}`}
        onClick={() => setIsSettingTime(true)}
        title="Click to set time"
      >
        {formatTime(remainingSeconds)}
      </span>
      <div className="flex gap-1">
        {!isRunning ? (
          <Button variant="ghost" size="sm" onClick={startTimer} className="h-6 w-6 p-0">
            <Play size={12} />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={pauseTimer} className="h-6 w-6 p-0">
            <Pause size={12} />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={resetTimer} className="h-6 w-6 p-0">
          <RotateCcw size={12} />
        </Button>
      </div>
    </div>
  );
}