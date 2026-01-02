import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilityManager } from './useAvailabilityManager';
import { SchedulerHeader } from './SchedulerHeader';
import { WeeklyCalendarGrid } from './WeeklyCalendarGrid';
import { SlotControlPanel } from './SlotControlPanel';

interface ClassSchedulerProps {
  teacherName: string;
  teacherId: string;
}

export const ClassScheduler: React.FC<ClassSchedulerProps> = ({
  teacherName,
  teacherId
}) => {
  const { toast } = useToast();
  
  const {
    slots,
    slotDuration,
    setSlotDuration,
    selectedDay,
    setSelectedDay,
    toggleSlot,
    getSlotAt,
    getSlotsForDay,
    getOpenSlotsCount,
    getBookedSlotsCount,
    clearOpenSlots,
    getWeekDates,
    isSlotInPast
  } = useAvailabilityManager();

  const weekDates = getWeekDates();
  const slotsForSelectedDay = getSlotsForDay(selectedDay);

  const handleSaveSchedule = () => {
    const openSlots = getOpenSlotsCount();
    toast({
      title: "Availability Updated!",
      description: `${openSlots} time slots are now available for students to book.`,
    });
  };

  const handleClearSlots = () => {
    clearOpenSlots();
    toast({
      title: "Slots Cleared",
      description: "All open availability slots have been removed.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <SchedulerHeader
        teacherName={teacherName}
        openSlotsCount={getOpenSlotsCount()}
        bookedSlotsCount={getBookedSlotsCount()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Calendar Grid - 70% */}
        <div>
          <WeeklyCalendarGrid
            weekDates={weekDates}
            getSlotAt={getSlotAt}
            isSlotInPast={isSlotInPast}
            onSlotClick={toggleSlot}
            slotDuration={slotDuration}
          />
        </div>

        {/* Right Sidebar - 30% */}
        <div>
          <SlotControlPanel
            slotDuration={slotDuration}
            setSlotDuration={setSlotDuration}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            slotsForDay={slotsForSelectedDay}
            onSaveSchedule={handleSaveSchedule}
            onClearSlots={handleClearSlots}
          />
        </div>
      </div>
    </div>
  );
};
