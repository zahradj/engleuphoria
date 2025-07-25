
import React from "react";
import { UnifiedTeacherCalendar } from "./calendar/UnifiedTeacherCalendar";

interface EnhancedCalendarTabProps {
  teacherId: string;
}

export const EnhancedCalendarTab = ({ teacherId }: EnhancedCalendarTabProps) => {
  return <UnifiedTeacherCalendar teacherId={teacherId} />;
};
