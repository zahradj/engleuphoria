import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAvailabilityManager } from './useAvailabilityManager';
import { SchedulerHeader } from './SchedulerHeader';
import { WeeklyCalendarGrid } from './WeeklyCalendarGrid';
import { SlotControlPanel } from './SlotControlPanel';
import { supabase } from '@/integrations/supabase/client';
import { insertAvailabilitySlotsWithFallback } from '@/services/availabilityInsert';
import { addMinutes, setHours, setMinutes, format } from 'date-fns';
import { useTeacherHubRole } from '@/hooks/useTeacherHubRole';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, RotateCcw } from 'lucide-react';

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
    isLoading,
    weekOffset,
    goToPreviousWeek,
    goToNextWeek,
    goToThisWeek,
    refresh,
  } = useAvailabilityManager(allowedDurations, teacherId);

  const weekDates = getWeekDates();
  const slotsForSelectedDay = getSlotsForDay(selectedDay);
  const weekRangeLabel = useMemo(() => {
    if (weekDates.length === 0) return '';
    const first = weekDates[0].date;
    const last = weekDates[weekDates.length - 1].date;
    return `${format(first, 'MMM d')} – ${format(last, 'MMM d, yyyy')}`;
  }, [weekDates]);

  const handleSaveSchedule = async () => {
    // Only persist NEWLY-added open slots (those without a DB id yet).
    // DB-backed slots have non-uuid format ids? They DO use uuid; safer:
    // we filter open slots whose start_time isn't already represented in the
    // DB by re-checking in the helper (it already dedupes server-side).
    const openSlots = slots.filter((s) => s.status === 'open');
    if (openSlots.length === 0) {
      toast({
        title: 'No slots to save',
        description: 'Tap a cell on the calendar to open a free slot first.',
        variant: 'destructive',
      });
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
        description: `${openSlots.length} time slot${openSlots.length > 1 ? 's are' : ' is'} now available for students to book.`,
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
