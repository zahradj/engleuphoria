import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { AvailabilitySlot, DAYS } from './types';
import { v4 as uuidv4 } from 'uuid';
import {
  startOfWeek,
  addDays,
  addWeeks,
  format,
  isBefore,
  setHours,
  setMinutes,
  endOfWeek,
} from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface DbSlotRow {
  id: string;
  start_time: string;
  duration: number | null;
  is_booked: boolean | null;
  is_available: boolean | null;
  student_id: string | null;
  lesson_title: string | null;
}

interface StudentInfo {
  name: string;
  email?: string;
}

const DAY_INDEX_TO_NAME: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday',
};

export const useAvailabilityManager = (
  allowedDurations: (30 | 60)[] = [30, 60],
  teacherId?: string
) => {
  const safeAllowed = useMemo(
    () => (allowedDurations.length > 0 ? allowedDurations : [60 as const]),
    [allowedDurations]
  );

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotDuration, setSlotDurationState] = useState<30 | 60>(safeAllowed[0]);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentInfo, setStudentInfo] = useState<Record<string, StudentInfo>>({});
  const studentInfoRef = useRef(studentInfo);
  studentInfoRef.current = studentInfo;

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
    queueMicrotask(() => setSlotDurationState(safeAllowed[0]));
  }

  const getWeekDates = useCallback(() => {
    const today = new Date();
    const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
    return DAYS.map((day, index) => ({
      day,
      date: addDays(weekStart, index),
      formatted: format(addDays(weekStart, index), 'MMM d'),
    }));
  }, [weekOffset]);

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

  // ─── DB hydration ──────────────────────────────────────────────
  const loadSlotsFromDb = useCallback(
    async (signal?: AbortSignal) => {
      if (!teacherId) return;
      setIsLoading(true);

      const today = new Date();
      const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });

      const { data, error } = await supabase
        .from('teacher_availability')
        .select('id, start_time, duration, is_booked, is_available, student_id, lesson_title')
        .eq('teacher_id', teacherId)
        .gte('start_time', weekStart.toISOString())
        .lte('start_time', weekEnd.toISOString())
        .order('start_time', { ascending: true });

      if (signal?.aborted) return;

      if (error) {
        console.error('[useAvailabilityManager] load failed:', error);
        setIsLoading(false);
        return;
      }

      const rows = (data ?? []) as DbSlotRow[];

      // Lookup student names for booked rows
      const studentIds = Array.from(
        new Set(rows.map((r) => r.student_id).filter(Boolean) as string[])
      );

      const newInfo: Record<string, StudentInfo> = { ...studentInfoRef.current };
      const missing = studentIds.filter((id) => !newInfo[id]);
      if (missing.length > 0) {
        const { data: students } = await supabase
          .from('users')
          .select('id, full_name, email')
          .in('id', missing);
        for (const s of students ?? []) {
          newInfo[(s as any).id] = {
            name: (s as any).full_name || 'Student',
            email: (s as any).email,
          };
        }
        if (!signal?.aborted) setStudentInfo(newInfo);
      }

      const mapped: AvailabilitySlot[] = rows.map((r) => {
        const start = new Date(r.start_time);
        const dayName = DAY_INDEX_TO_NAME[start.getDay()] ?? DAYS[0];
        const time = `${String(start.getHours()).padStart(2, '0')}:${String(
          start.getMinutes()
        ).padStart(2, '0')}`;
        const dur: 30 | 60 = (r.duration ?? 30) >= 55 ? 60 : 30;
        const info = r.student_id ? newInfo[r.student_id] : undefined;
        return {
          id: r.id,
          day: dayName,
          time,
          duration: dur,
          status: r.is_booked ? 'booked' : 'open',
          studentName: r.is_booked ? info?.name : undefined,
          studentEmail: r.is_booked ? info?.email : undefined,
          lessonTitle: r.is_booked ? r.lesson_title || undefined : undefined,
          startTime: r.start_time,
        };
      });

      if (!signal?.aborted) {
        setSlots(mapped);
        setIsLoading(false);
      }
    },
    [teacherId, weekOffset]
  );

  // Initial + week-change hydration
  useEffect(() => {
    if (!teacherId) return;
    const ctrl = new AbortController();
    loadSlotsFromDb(ctrl.signal);
    return () => ctrl.abort();
  }, [teacherId, weekOffset, loadSlotsFromDb]);

  // Realtime: refresh when this teacher's availability changes anywhere
  useEffect(() => {
    if (!teacherId) return;
    const channel = supabase
      .channel(`avail-${teacherId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_availability',
          filter: `teacher_id=eq.${teacherId}`,
        },
        () => {
          loadSlotsFromDb();
        }
      )
      .subscribe();

    const onAvailChanged = () => loadSlotsFromDb();
    window.addEventListener('availability-changed', onAvailChanged);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('availability-changed', onAvailChanged);
    };
  }, [teacherId, loadSlotsFromDb]);

  // ─── Slot interactions ─────────────────────────────────────────
  const toggleSlot = useCallback(
    (day: string, time: string) => {
      if (isSlotInPast(day, time)) return;
      setSlots((prev) => {
        const existing = prev.find((s) => s.day === day && s.time === time);
        if (existing) {
          // Only allow removing slots that aren't booked AND haven't been
          // persisted yet (DB-backed open slots get a non-uuidv4 id from DB).
          if (existing.status === 'open') {
            return prev.filter((s) => s.id !== existing.id);
          }
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

  // ─── Week navigation ───────────────────────────────────────────
  const goToPreviousWeek = useCallback(() => setWeekOffset((w) => w - 1), []);
  const goToNextWeek = useCallback(() => setWeekOffset((w) => w + 1), []);
  const goToThisWeek = useCallback(() => setWeekOffset(0), []);

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
    // New exports
    isLoading,
    weekOffset,
    goToPreviousWeek,
    goToNextWeek,
    goToThisWeek,
    refresh: loadSlotsFromDb,
  };
};
