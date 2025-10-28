export interface TimeSlot {
  id?: string;
  time: string;
  date: Date;
  dateKey: string;
  slotKey: string;
  isAvailable: boolean;
  isBooked: boolean;
  isPast: boolean;
  duration?: number;
  studentName?: string;
  studentId?: string;
  studentLevel?: string;
  lessonTitle?: string;
}

export interface SelectedSlot {
  dateKey: string;
  time: string;
  slotKey: string;
}

export interface WeeklySlots {
  [dateKey: string]: TimeSlot[];
}
