import { SimplifiedMultiSelectCalendar } from "../calendar/SimplifiedMultiSelectCalendar";
import { useAuth } from "@/contexts/AuthContext";

interface ScheduleTabProps {
  onScheduleClass: () => void;
  onStartScheduledClass: (className: string) => void;
}

export const ScheduleTab = ({ onScheduleClass, onStartScheduledClass }: ScheduleTabProps) => {
  const { user } = useAuth();
  const teacherId = user?.id || "";
  
  if (!teacherId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please log in to access your calendar</p>
      </div>
    );
  }
  
  return <SimplifiedMultiSelectCalendar teacherId={teacherId} />;
};
