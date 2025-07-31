import React from "react";
import { SimplifiedTeacherCalendar } from "./calendar/SimplifiedTeacherCalendar";

interface AvailabilityManagerProps {
  teacherId: string;
}

export const AvailabilityManager = ({ teacherId }: AvailabilityManagerProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Availability Management</h2>
        <p className="text-gray-600">Easily manage your teaching schedule. Click slots to add/remove availability.</p>
      </div>
      
      <SimplifiedTeacherCalendar teacherId={teacherId} />
    </div>
  );
};