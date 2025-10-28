import React from "react";
import { Plus } from "lucide-react";

interface ScheduleSlot {
  id?: string;
  time: string;
  duration: 30 | 60;
  lessonType: 'free_slot' | 'direct_booking';
  isAvailable: boolean;
  studentId?: string;
  lessonTitle?: string;
  studentName?: string;
  lessonCode?: string;
}

interface TimeSlotProps {
  time: string;
  date: Date;
  slot?: ScheduleSlot;
  selectedDuration: 30 | 60;
  onSlotClick: (time: string, date: Date, event: React.MouseEvent) => void;
}

export const TimeSlot = ({ time, date, slot, selectedDuration, onSlotClick }: TimeSlotProps) => {
  const getSlotClassName = () => {
    const baseClasses = "h-6 border border-border hover:bg-accent/50 cursor-pointer transition-all duration-200 rounded-sm relative overflow-hidden";
    
    if (!slot || !slot.isAvailable) {
      return `${baseClasses} bg-background`;
    }
    
    if (slot.studentId) {
      return `${baseClasses} bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20`;
    }
    
    if (slot.lessonType === 'direct_booking') {
      return `${baseClasses} bg-warning/10 border-warning/20 text-warning hover:bg-warning/20`;
    }
    
    return `${baseClasses} bg-success/10 border-success/20 text-success hover:bg-success/20`;
  };

  const renderSlotContent = () => {
    if (!slot || !slot.isAvailable) {
      return (
        <div className="flex items-center justify-center h-full opacity-40">
          <Plus className="h-3 w-3" />
        </div>
      );
    }

    if (slot.studentId && slot.studentName) {
      return (
        <div className="px-2 py-1 text-xs h-full flex flex-col justify-center">
          <div className="font-semibold truncate">
            {slot.lessonCode || `#${slot.id?.slice(-6).toUpperCase()}`}
          </div>
          <div className="text-xs opacity-80 truncate">{slot.studentName}</div>
          <div className="absolute top-1 right-1 text-xs opacity-60">
            {slot.duration}m
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full relative">
        <Plus className="h-3 w-3 opacity-60" />
        <div className="absolute top-1 right-1 text-xs opacity-60">
          {slot.duration}m
        </div>
      </div>
    );
  };

  const formatTime12Hour = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div
      className={getSlotClassName()}
      onClick={(e) => onSlotClick(time, date, e)}
      title={
        slot?.isAvailable 
          ? `${formatTime12Hour(time)} - ${slot.duration}min slot` 
          : `Click to open ${selectedDuration}min slot at ${formatTime12Hour(time)}`
      }
    >
      {renderSlotContent()}
    </div>
  );
};