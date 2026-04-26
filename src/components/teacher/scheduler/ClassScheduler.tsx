import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilityManager } from './useAvailabilityManager';
import { SchedulerHeader } from './SchedulerHeader';
import { WeeklyCalendarGrid } from './WeeklyCalendarGrid';
import { SlotControlPanel } from './SlotControlPanel';
import { supabase } from '@/integrations/supabase/client';
import { insertAvailabilitySlotsWithFallback } from '@/services/availabilityInsert';
import { openWeeklyRecurringSelections } from '@/services/recurringSlotsService';
import { addMinutes, setHours, setMinutes, format } from 'date-fns';
import { useTeacherHubRole } from '@/hooks/useTeacherHubRole';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, RotateCcw } from 'lucide-react';
import { BookedSlotManager } from './BookedSlotManager';
import type { AvailabilitySlot } from './types';

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
  const [bookedSlot, setBookedSlot] = useState<AvailabilitySlot | null>(null);

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
    isLoading,
    weekOffset,
    goToPreviousWeek,
    goToNextWeek,
    goToThisWeek,
    refresh,
  } = useAvailabilityManager(allowedDurations, teacherId);

  const weekDates = getWeekDates();
  const slotsForSelectedDay = getSlotsForDay(selectedDay);
  const selectedSlots = slots.filter((s) => s.status === 'selected');
  const hubForSlots = resolvedHubSpecialty === 'Playground'
    ? 'playground'
    : resolvedHubSpecialty === 'Professional'
      ? 'success'
      : 'academy';
  const weekRangeLabel = useMemo(() => {
    if (weekDates.length === 0) return '';
    const first = weekDates[0].date;
    const last = weekDates[weekDates.length - 1].date;
    return `${format(first, 'MMM d')} – ${format(last, 'MMM d, yyyy')}`;
  }, [weekDates]);

  const handleSaveSchedule = async () => {
    if (selectedSlots.length === 0) {
      toast({
        title: 'No slots selected',
        description: 'Tap one or more empty calendar cells first.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const dbSlots = selectedSlots.map((slot) => {
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
        title: 'Slots opened ✅',
        description: `${selectedSlots.length} slot${selectedSlots.length > 1 ? 's are' : ' is'} now available for students to book.`,
      });

      window.dispatchEvent(new Event('availability-changed'));
      // Reload from DB so we see persisted ids and stay in sync after refresh
      await refresh();
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

  const handleOpenWeeklySlots = async () => {
    if (selectedSlots.length === 0) {
      toast({
        title: 'No slots selected',
        description: 'Tap one or more empty calendar cells first.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const selections = selectedSlots.map((slot) => {
        const dayData = weekDates.find((d) => d.day === slot.day);
        if (!dayData) throw new Error(`Day ${slot.day} not found`);
        return { weekday: dayData.date.getDay(), time: slot.time };
      });

      const created = await openWeeklyRecurringSelections({
        teacherId,
        selections,
        duration: slotDuration,
        weeksAhead: 12,
        startFrom: weekDates[0]?.date ?? new Date(),
        hub: hubForSlots,
      });

      toast({
        title: 'Weekly slots opened ✅',
        description: `Created ${created} recurring slot${created === 1 ? '' : 's'} across the next 12 weeks.`,
      });

      window.dispatchEvent(new Event('availability-changed'));
      await refresh();
    } catch (err: any) {
      console.error('Error opening weekly slots:', err);
      toast({
        title: 'Weekly opening failed',
        description: err.message || 'Could not open recurring availability. Please try again.',
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
      description: 'Unsaved open slots have been removed from the canvas. Saved slots remain in the database.',
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

      {/* Week navigator */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={weekOffset === 0 ? 'default' : 'outline'}
            size="sm"
            onClick={goToThisWeek}
          >
            This week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {weekRangeLabel}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refresh()}
            disabled={isLoading}
            aria-label="Refresh schedule"
            title="Refresh schedule"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <WeeklyCalendarGrid
            weekDates={weekDates}
            getSlotAt={getSlotAt}
            isSlotInPast={isSlotInPast}
            onSlotClick={toggleSlot}
            onBookedSlotClick={setBookedSlot}
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
            onOpenWeeklySlots={handleOpenWeeklySlots}
            onClearSlots={handleClearSlots}
            isSaving={saving || hubLoading}
          />
        </div>
      </div>

      <BookedSlotManager
        open={!!bookedSlot}
        onOpenChange={(open) => { if (!open) setBookedSlot(null); }}
        slot={bookedSlot ? {
          slotId: bookedSlot.id,
          studentName: bookedSlot.studentName,
          studentShortId: bookedSlot.studentShortId,
          hub: bookedSlot.hub ?? null,
          startTime: bookedSlot.startTime ? new Date(bookedSlot.startTime) : new Date(),
          duration: bookedSlot.duration,
          isRecurring: !!bookedSlot.recurringPattern,
        } : null}
        onCancelled={() => {
          setBookedSlot(null);
          refresh();
        }}
      />
    </div>
  );
};
