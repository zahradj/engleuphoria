
import { EnhancedCalendarTab } from "../EnhancedCalendarTab";

interface ScheduleTabProps {
  onScheduleClass: () => void;
  onStartScheduledClass: (className: string) => void;
}

export const ScheduleTab = ({ onScheduleClass, onStartScheduledClass }: ScheduleTabProps) => {
  // Get teacher ID from localStorage or context
  const teacherId = "teacher-1"; // In real app, this would come from auth context
  
  return <EnhancedCalendarTab teacherId={teacherId} />;
};
