export interface AvailabilitySlot {
  id: string;
  day: string;
  time: string;
  duration: 30 | 60;
  status: 'open' | 'booked' | 'past';
  studentName?: string;
}

export interface SchedulerState {
  slots: AvailabilitySlot[];
  slotDuration: 30 | 60;
  selectedDay: string;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type DayType = typeof DAYS[number];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
] as const;

export type TimeSlotType = typeof TIME_SLOTS[number];
