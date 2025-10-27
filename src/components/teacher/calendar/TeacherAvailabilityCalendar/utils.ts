export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

export const getWeekDates = (currentDate: Date): Date[] => {
  const week: Date[] = [];
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as first day
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    week.push(date);
  }
  return week;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatWeekRange = (weekDates: Date[]): string => {
  if (weekDates.length === 0) return '';
  const start = weekDates[0];
  const end = weekDates[6];
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
};

export const isPastSlot = (date: Date, time: string): boolean => {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const slotDateTime = new Date(date);
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime < now;
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
