import React from "react";

interface MinimalTopBarProps {
  currentUser: any;
  studentXP?: number;
}

export function MinimalTopBar({ currentUser, studentXP }: MinimalTopBarProps) {
  const roleLabel = currentUser?.role === "teacher" ? "Teacher" : "Student";

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
            {currentUser?.role === "teacher" ? "T" : "S"}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm sm:text-base font-medium text-foreground">Live Lesson</span>
            <span className="text-xs text-muted-foreground">{roleLabel}</span>
          </div>
        </div>

        {typeof studentXP === "number" && (
          <div className="text-xs sm:text-sm text-muted-foreground">
            XP: <span className="font-semibold text-foreground">{studentXP}</span>
          </div>
        )}
      </div>
    </header>
  );
}
