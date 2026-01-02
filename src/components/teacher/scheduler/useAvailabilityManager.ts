import { useState, useCallback } from 'react';
import { AvailabilitySlot, DAYS, TIME_SLOTS } from './types';
import { v4 as uuidv4 } from 'uuid';
import { startOfWeek, addDays, format, isBefore, isToday, setHours, setMinutes } from 'date-fns';

export const useAvailabilityManager = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotDuration, setSlotDuration] = useState<30 | 60>(60);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);

  // Get current week dates
  const getWeekDates = useCallback(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    return DAYS.map((day, index) => ({
      day,
      date: addDays(weekStart, index),
      formatted: format(addDays(weekStart, index), 'MMM d')
    }));
  }, []);

  // Check if a time slot is in the past
  const isSlotInPast = useCallback((day: string, time: string) => {
    const weekDates = getWeekDates();
    const dayData = weekDates.find(d => d.day === day);
    if (!dayData) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const slotDateTime = setMinutes(setHours(dayData.date, hours), minutes);
    
    return isBefore(slotDateTime, new Date());
  }, [getWeekDates]);

  // Toggle slot availability
  const toggleSlot = useCallback((day: string, time: string) => {
    // Don't allow toggling past slots
    if (isSlotInPast(day, time)) return;

    setSlots(prevSlots => {
      const existingSlot = prevSlots.find(
        s => s.day === day && s.time === time
      );

      if (existingSlot) {
        // If slot exists and is open, remove it
        if (existingSlot.status === 'open') {
          return prevSlots.filter(s => s.id !== existingSlot.id);
        }
        // Don't modify booked slots
        return prevSlots;
      }

      // Create new slot
      const newSlot: AvailabilitySlot = {
        id: uuidv4(),
        day,
        time,
        duration: slotDuration,
        status: 'open'
      };

      return [...prevSlots, newSlot];
    });
  }, [slotDuration, isSlotInPast]);

  // Get slot at specific position
  const getSlotAt = useCallback((day: string, time: string): AvailabilitySlot | undefined => {
    return slots.find(s => s.day === day && s.time === time);
  }, [slots]);

  // Get slots for a specific day
  const getSlotsForDay = useCallback((day: string): AvailabilitySlot[] => {
    return slots
      .filter(s => s.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [slots]);

  // Get open slots count
  const getOpenSlotsCount = useCallback(() => {
    return slots.filter(s => s.status === 'open').length;
  }, [slots]);

  // Get booked slots count
  const getBookedSlotsCount = useCallback(() => {
    return slots.filter(s => s.status === 'booked').length;
  }, [slots]);

  // Clear all open slots
  const clearOpenSlots = useCallback(() => {
    setSlots(prevSlots => prevSlots.filter(s => s.status !== 'open'));
  }, []);

  return {
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
  };
};
