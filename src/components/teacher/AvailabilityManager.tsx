import React from "react";
import { EnhancedHourlyCalendar } from "./calendar/EnhancedHourlyCalendar";
import { BulkAvailabilityActions } from "./calendar/BulkAvailabilityActions";

interface AvailabilityManagerProps {
  teacherId: string;
}

export const AvailabilityManager = ({ teacherId }: AvailabilityManagerProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Enhanced Schedule Management</h2>
        <p className="text-gray-600">Click time slots to open for booking (25/55 min), Ctrl+Click for direct scheduling</p>
      </div>
      
      <EnhancedHourlyCalendar teacherId={teacherId} />
    </div>
  );
};