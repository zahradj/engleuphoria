export interface AvailabilitySlot {
  id: string;
  teacherId: string;
  startTime: Date;
  endTime: Date;
  duration: 30 | 60;
  isAvailable: boolean;
  isBooked: boolean;
  lessonId?: string;
  lessonTitle?: string;
  studentName?: string;
}

export interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

export interface CalendarDay {
  date: Date;
  dayName: string;
  dateNum: number;
  isToday: boolean;
}
