import React, { useState } from "react";
import { CalendarCore } from "./calendar/modern/CalendarCore";
import { SlotManager } from "./calendar/modern/SlotManager";
import { SyncStatusBadge } from "./calendar/SyncStatusBadge";
import { useTeacherAvailability } from "@/hooks/useTeacherAvailability";
import { getWeekDays } from "@/utils/timezoneUtils";

interface EnhancedCalendarTabProps {
  teacherId: string;
}

export const EnhancedCalendarTab = ({ teacherId }: EnhancedCalendarTabProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showSlotManager, setShowSlotManager] = useState(false);

  const weekDays = getWeekDays(currentWeek);
  const { slots, isLoading, createSlot, deleteSlot } = useTeacherAvailability(teacherId, weekDays);

  const handleNavigateWeek = (direction: -1 | 1) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const handleGoToToday = () => {
    setCurrentWeek(new Date());
  };

  const handleSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowSlotManager(true);
  };

  const handleCreateSlot = async (duration: 30 | 60) => {
    if (!selectedDate || !selectedTime) return;
    await createSlot(selectedDate, selectedTime, duration);
  };

  const getExistingSlot = () => {
    if (!selectedDate || !selectedTime) return null;
    
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const targetTime = new Date(selectedDate);
    targetTime.setHours(hours, minutes, 0, 0);

    return slots.find(slot => {
      const slotStart = new Date(slot.startTime);
      return slotStart.getTime() === targetTime.getTime();
    });
  };

  const handleDeleteSlot = async () => {
    const slot = getExistingSlot();
    if (slot && !slot.isBooked) {
      await deleteSlot(slot.id);
    }
  };

  const existingSlot = getExistingSlot();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Availability</h2>
        <SyncStatusBadge teacherId={teacherId} />
      </div>

      <CalendarCore
        teacherId={teacherId}
        slots={slots}
        weekDays={weekDays}
        currentWeek={currentWeek}
        isLoading={isLoading}
        onNavigateWeek={handleNavigateWeek}
        onGoToToday={handleGoToToday}
        onSlotClick={handleSlotClick}
      />

      <SlotManager
        open={showSlotManager}
        onClose={() => setShowSlotManager(false)}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onCreateSlot={handleCreateSlot}
        onDeleteSlot={existingSlot && !existingSlot.isBooked ? handleDeleteSlot : undefined}
        existingSlot={!!existingSlot}
      />
    </div>
  );
};
