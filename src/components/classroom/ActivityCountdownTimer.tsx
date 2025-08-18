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
    if (percentage <= 0.1) return "text-error";
    if (percentage <= 0.2) return "text-warning";
    return "text-primary-600";
  };

  if (isSettingTime) {
    return (
      <div className={`flex items-center gap-2 bg-surface border border-muted rounded-lg px-3 py-2 shadow-sm ${className}`}>
        <Timer size={16} className="text-primary-500" />
        <Input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 h-6 text-sm border-muted focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
          min="1"
          max="60"
        />
        <span className="text-sm text-muted-foreground">min</span>
        <Button size="sm" variant="outline" onClick={setNewTime} className="h-6 px-2 text-xs border-muted hover:bg-surface-2">
          Set
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setIsSettingTime(false)} className="h-6 px-2 text-xs hover:bg-surface-2">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-surface border border-muted rounded-lg px-3 py-2 shadow-sm ${className}`}>
      <Timer size={16} className="text-primary-500" />
      <span 
        className={`font-mono text-base font-medium cursor-pointer ${getTimerColor()}`}
        onClick={() => setIsSettingTime(true)}
        title="Click to set time"
      >
        {formatTime(remainingSeconds)}
      </span>
      <div className="flex gap-1">
        {!isRunning ? (
          <Button variant="ghost" size="sm" onClick={startTimer} className="h-6 w-6 p-0 hover:bg-surface-2">
            <Play size={12} />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={pauseTimer} className="h-6 w-6 p-0 hover:bg-surface-2">
            <Pause size={12} />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={resetTimer} className="h-6 w-6 p-0 hover:bg-surface-2">
          <RotateCcw size={12} />
        </Button>
      </div>
    </div>
  );
}