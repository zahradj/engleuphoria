import React from "react";
import { TeacherAvailabilityCalendar } from "./calendar/TeacherAvailabilityCalendar";
import { SyncStatusBadge } from "./calendar/SyncStatusBadge";

interface EnhancedCalendarTabProps {
  teacherId: string;
}

export const EnhancedCalendarTab = ({ teacherId }: EnhancedCalendarTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Availability</h2>
        <SyncStatusBadge teacherId={teacherId} />
      </div>
      <TeacherAvailabilityCalendar teacherId={teacherId} />
    </div>
  );
};
