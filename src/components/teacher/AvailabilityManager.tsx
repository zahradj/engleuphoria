import React from "react";
import { IntegratedAvailabilityCalendar } from "./calendar/IntegratedAvailabilityCalendar";

interface AvailabilityManagerProps {
  teacherId: string;
}

export const AvailabilityManager = ({ teacherId }: AvailabilityManagerProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Manage Your Availability</h2>
        <p className="text-gray-600">Click on time slots to open or close availability for student bookings</p>
      </div>
      
      <IntegratedAvailabilityCalendar teacherId={teacherId} />
    </div>
  );
};