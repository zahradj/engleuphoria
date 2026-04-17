import { useState, useCallback, useMemo } from 'react';
import { AvailabilitySlot, DAYS } from './types';
import { v4 as uuidv4 } from 'uuid';
import { startOfWeek, addDays, format, isBefore, setHours, setMinutes } from 'date-fns';

export const useAvailabilityManager = (allowedDurations: (30 | 60)[] = [30, 60]) => {
  const safeAllowed = useMemo(
    () => (allowedDurations.length > 0 ? allowedDurations : [60 as const]),
    [allowedDurations]
  );

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotDuration, setSlotDurationState] = useState<30 | 60>(safeAllowed[0]);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);

  // Clamp setter so callers can never pick a disallowed duration
  const setSlotDuration = useCallback(
    (duration: 30 | 60) => {
      if (safeAllowed.includes(duration)) setSlotDurationState(duration);
      else setSlotDurationState(safeAllowed[0]);
    },
    [safeAllowed]
  );

  // If allowed list changes (e.g. hub role loads), reconcile current value
  if (!safeAllowed.includes(slotDuration)) {
    // Defer state update to next tick via microtask to avoid render warnings
    queueMicrotask(() => setSlotDurationState(safeAllowed[0]));
  }

  const getWeekDates = useCallback(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    return DAYS.map((day, index) => ({
      day,
      date: addDays(weekStart, index),
      formatted: format(addDays(weekStart, index), 'MMM d'),
    }));
  }, []);

  const isSlotInPast = useCallback(
    (day: string, time: string) => {
      const weekDates = getWeekDates();
      const dayData = weekDates.find((d) => d.day === day);
      if (!dayData) return false;
      const [hours, minutes] = time.split(':').map(Number);
      const slotDateTime = setMinutes(setHours(dayData.date, hours), minutes);
      return isBefore(slotDateTime, new Date());
    },
    [getWeekDates]
  );

  const toggleSlot = useCallback(
    (day: string, time: string) => {
      if (isSlotInPast(day, time)) return;
      setSlots((prev) => {
        const existing = prev.find((s) => s.day === day && s.time === time);
        if (existing) {
          if (existing.status === 'open') return prev.filter((s) => s.id !== existing.id);
          return prev;
        }
        const newSlot: AvailabilitySlot = {
          id: uuidv4(),
          day,
          time,
          duration: slotDuration,
          status: 'open',
        };
        return [...prev, newSlot];
      });
    },
    [slotDuration, isSlotInPast]
  );

  const getSlotAt = useCallback(
    (day: string, time: string) => slots.find((s) => s.day === day && s.time === time),
    [slots]
  );

  const getSlotsForDay = useCallback(
    (day: string) =>
      slots.filter((s) => s.day === day).sort((a, b) => a.time.localeCompare(b.time)),
    [slots]
  );

  const getOpenSlotsCount = useCallback(
    () => slots.filter((s) => s.status === 'open').length,
    [slots]
  );
  const getBookedSlotsCount = useCallback(
    () => slots.filter((s) => s.status === 'booked').length,
    [slots]
  );
  const clearOpenSlots = useCallback(
    () => setSlots((prev) => prev.filter((s) => s.status !== 'open')),
    []
  );

  return {
    slots,
    slotDuration,
    setSlotDuration,
    allowedDurations: safeAllowed,
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
  };
};
