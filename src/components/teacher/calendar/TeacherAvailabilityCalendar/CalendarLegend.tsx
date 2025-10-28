import React from "react";
import { Circle } from "lucide-react";

export const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
        <span className="text-xs font-medium">Open slots</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-purple-500 text-purple-500" />
        <span className="text-xs font-medium">Booked slots</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-violet-500 text-violet-500" />
        <span className="text-xs font-medium">Selected slots</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-sky-500 text-sky-500" />
        <span className="text-xs font-medium">Available time</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="h-3 w-3 fill-muted text-muted" />
        <span className="text-xs font-medium">Past slots</span>
      </div>
    </div>
  );
};
