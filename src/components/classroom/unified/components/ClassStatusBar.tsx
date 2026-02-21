import React from "react";
import { Progress } from "@/components/ui/progress";

interface ClassStatusBarProps {
  elapsedSec: number;
  totalSec?: number;
  participantsCount?: number;
  sessionDuration?: 25 | 55;
}

export function ClassStatusBar({ elapsedSec, totalSec, participantsCount = 0, sessionDuration = 25 }: ClassStatusBarProps) {
  // Use teaching time as total if totalSec not explicitly provided
  const effectiveTotal = totalSec ?? sessionDuration * 60;
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const pct = clamp((elapsedSec / effectiveTotal) * 100);
  const remaining = Math.max(0, effectiveTotal - elapsedSec);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <footer className="backdrop-blur supports-[backdrop-filter]:backdrop-blur" style={{ 
      borderTop: '1px solid rgba(196, 217, 255, 0.4)', 
      backgroundColor: 'rgba(251, 251, 251, 0.9)'
    }}>
      <div className="container mx-auto px-4 py-2 flex items-center gap-4">
        <div className="flex-1">
          <Progress value={pct} className="h-2" />
        </div>
        <div className="text-xs" style={{ color: '#6B7280' }}>
          Elapsed: <span className="font-mono" style={{ color: '#374151' }}>{fmt(elapsedSec)}</span>
        </div>
        <div className="text-xs" style={{ color: '#6B7280' }}>
          Time left: <span className="font-mono" style={{ color: '#374151' }}>{fmt(remaining)}</span>
        </div>
        <div className="text-xs" style={{ color: '#6B7280' }}>Participants: <span style={{ color: '#374151' }}>{participantsCount}</span></div>
      </div>
    </footer>
  );
}
