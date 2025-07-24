import React from "react";
import { WeeklyScheduleGrid } from "./calendar/WeeklyScheduleGrid";

interface AvailabilityManagerProps {
  teacherId: string;
}

export const AvailabilityManager = ({ teacherId }: AvailabilityManagerProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Weekly Schedule Management</h2>
        <p className="text-gray-600">Professional calendar view - Click slots to open/close, Ctrl+Click for direct booking</p>
      </div>
      
      <WeeklyScheduleGrid teacherId={teacherId} />
    </div>
  );
};