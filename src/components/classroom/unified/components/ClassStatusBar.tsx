import React from "react";
import { Progress } from "@/components/ui/progress";

interface ClassStatusBarProps {
  elapsedSec: number;
  totalSec?: number;
  participantsCount?: number;
}

export function ClassStatusBar({ elapsedSec, totalSec = 1800, participantsCount = 0 }: ClassStatusBarProps) {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const pct = clamp((elapsedSec / totalSec) * 100);
  const remaining = Math.max(0, totalSec - elapsedSec);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <footer className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2 flex items-center gap-4">
        <div className="flex-1">
          <Progress value={pct} className="h-2" />
        </div>
        <div className="text-xs text-muted-foreground">
          Elapsed: <span className="font-mono text-foreground">{fmt(elapsedSec)}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Time left: <span className="font-mono text-foreground">{fmt(remaining)}</span>
        </div>
        <div className="text-xs text-muted-foreground">Participants: <span className="text-foreground">{participantsCount}</span></div>
      </div>
    </footer>
  );
}
