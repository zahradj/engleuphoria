import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilityManager } from './useAvailabilityManager';
import { SchedulerHeader } from './SchedulerHeader';
import { WeeklyCalendarGrid } from './WeeklyCalendarGrid';
import { SlotControlPanel } from './SlotControlPanel';
import { supabase } from '@/integrations/supabase/client';
import { insertAvailabilitySlotsWithFallback } from '@/services/availabilityInsert';
import { addMinutes, setHours, setMinutes } from 'date-fns';
import { useTeacherHubRole } from '@/hooks/useTeacherHubRole';

interface ClassSchedulerProps {
  teacherName: string;
  teacherId: string;
  /** Optional override; otherwise derived from the teacher's hub role. */
  hubSpecialty?: 'Playground' | 'Academy' | 'Professional';
}

export const ClassScheduler: React.FC<ClassSchedulerProps> = ({
  teacherName,
  teacherId,
  hubSpecialty,
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const { hubKind, allowedDurations, loading: hubLoading } = useTeacherHubRole(teacherId);

  const resolvedHubSpecialty = useMemo<'Playground' | 'Academy' | 'Professional'>(() => {
    if (hubSpecialty) return hubSpecialty;
    if (hubKind === 'playground') return 'Playground';
    if (hubKind === 'professional') return 'Professional';
    return 'Academy';
  }, [hubSpecialty, hubKind]);

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
    isSlotInPast,
  } = useAvailabilityManager(allowedDurations);

  const weekDates = getWeekDates();
  const slotsForSelectedDay = getSlotsForDay(selectedDay);

  const handleSaveSchedule = async () => {
    const openSlots = slots.filter((s) => s.status === 'open');
    if (openSlots.length === 0) {
      toast({ title: 'No slots to save', description: 'Please select time slots first.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const dbSlots = openSlots.map((slot) => {
        const dayData = weekDates.find((d) => d.day === slot.day);
        if (!dayData) throw new Error(`Day ${slot.day} not found`);
        const [h, m] = slot.time.split(':').map(Number);
        const startTime = setMinutes(setHours(dayData.date, h), m);
        const endTime = addMinutes(startTime, slot.duration);

        return {
          teacher_id: teacherId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration: slot.duration,
          lesson_type: 'free_slot',
          is_available: true,
          is_booked: false,
          hub_specialty: resolvedHubSpecialty,
        };
      });

      await insertAvailabilitySlotsWithFallback(supabase, dbSlots);

      toast({
        title: 'Schedule Saved! ✅',
        description: `${openSlots.length} time slots are now available for students to book.`,
      });

      window.dispatchEvent(new Event('availability-changed'));
    } catch (err: any) {
      console.error('Error saving schedule:', err);
      toast({
        title: 'Save Failed',
        description: err.message || 'Could not save your availability. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClearSlots = () => {
    clearOpenSlots();
    toast({
      title: 'Slots Cleared',
      description: 'All open availability slots have been removed.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <SchedulerHeader
        teacherName={teacherName}
        openSlotsCount={getOpenSlotsCount()}
        bookedSlotsCount={getBookedSlotsCount()}
        hubSpecialty={resolvedHubSpecialty}
        slotDuration={slotDuration}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <WeeklyCalendarGrid
            weekDates={weekDates}
            getSlotAt={getSlotAt}
            isSlotInPast={isSlotInPast}
            onSlotClick={toggleSlot}
            slotDuration={slotDuration}
          />
        </div>

        <div>
          <SlotControlPanel
            slotDuration={slotDuration}
            setSlotDuration={setSlotDuration}
            allowedDurations={allowedDurations}
            hubSpecialty={resolvedHubSpecialty}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            slotsForDay={slotsForSelectedDay}
            onSaveSchedule={handleSaveSchedule}
            onClearSlots={handleClearSlots}
            isSaving={saving || hubLoading}
          />
        </div>
      </div>
    </div>
  );
};
