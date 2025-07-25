import React from "react";
import { MultiSelectWeeklyGrid } from "./calendar/MultiSelectWeeklyGrid";

interface AvailabilityManagerProps {
  teacherId: string;
}

export const AvailabilityManager = ({ teacherId }: AvailabilityManagerProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Enhanced Availability Management</h2>
        <p className="text-gray-600">Click individual slots or use Multi-Select mode for bulk actions. Supports both 25min and 55min lessons.</p>
      </div>
      
      <MultiSelectWeeklyGrid teacherId={teacherId} />
    </div>
  );
};