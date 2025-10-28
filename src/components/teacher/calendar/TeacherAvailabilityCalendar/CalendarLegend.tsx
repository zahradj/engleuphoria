import React from "react";
import { Circle } from "lucide-react";

export const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500" />
        <span className="text-xs font-medium">Weekly slot</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
        <span className="text-xs font-medium">Single slot</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-amber-500 text-amber-500" />
        <span className="text-xs font-medium">Just in time</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-pink-500 text-pink-500" />
        <span className="text-xs font-medium">Priority time</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-cyan-500 text-cyan-500" />
        <span className="text-xs font-medium">Half-priority time</span>
      </div>
    </div>
  );
};
