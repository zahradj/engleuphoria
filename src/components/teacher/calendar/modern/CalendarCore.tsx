import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Check, Lock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AvailabilitySlot, TimeSlot } from './types';
import { formatTime, isSameDay, isPast, generateTimeSlots } from '@/utils/timezoneUtils';

interface CalendarCoreProps {
  teacherId: string;
  slots: AvailabilitySlot[];
  weekDays: Date[];
  currentWeek: Date;
  isLoading: boolean;
  onNavigateWeek: (direction: -1 | 1) => void;
  onGoToToday: () => void;
  onSlotClick: (date: Date, time: string) => void;
}

export const CalendarCore: React.FC<CalendarCoreProps> = ({
  slots,
  weekDays,
  currentWeek,
  isLoading,
  onNavigateWeek,
  onGoToToday,
  onSlotClick,
}) => {
  const timeSlots = generateTimeSlots();

  const getSlotForTimeAndDate = (time: string, date: Date): AvailabilitySlot | null => {
    const [hours, minutes] = time.split(':').map(Number);
    const targetTime = new Date(date);
    targetTime.setHours(hours, minutes, 0, 0);

    return slots.find(slot => {
      const slotStart = new Date(slot.startTime);
      return isSameDay(slotStart, targetTime) && 
             slotStart.getHours() === hours && 
             slotStart.getMinutes() === minutes;
    }) || null;
  };

  const renderSlot = (date: Date, time: string) => {
    const slot = getSlotForTimeAndDate(time, date);
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    const isPastSlot = isPast(slotDate);

    if (slot?.isBooked) {
      return (
        <div
          className={cn(
            'h-12 border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/20 rounded-md p-1',
            'flex flex-col items-center justify-center text-xs cursor-not-allowed'
          )}
        >
          <Lock className="w-3 h-3 text-purple-600 mb-0.5" />
          <span className="text-purple-700 dark:text-purple-400 font-medium truncate w-full text-center">
            {slot.studentName || 'Booked'}
          </span>
        </div>
      );
    }

    if (slot?.isAvailable) {
      return (
        <button
          onClick={() => onSlotClick(date, time)}
          className={cn(
            'h-12 border-2 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-md',
            'hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors',
            'flex items-center justify-center relative group animate-pulse'
          )}
        >
          <Check className="w-4 h-4 text-green-600" />
          <span className="ml-1 text-xs font-bold text-green-700 dark:text-green-400">
            OPEN
          </span>
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1 rounded">
            {slot.duration}m
          </span>
        </button>
      );
    }

    if (isPastSlot) {
      return (
        <div className="h-12 bg-muted/30 rounded-md border border-border/50 cursor-not-allowed" />
      );
    }

    return (
      <button
        onClick={() => onSlotClick(date, time)}
        className={cn(
          'h-12 border border-dashed border-border rounded-md',
          'hover:border-primary hover:bg-primary/5 transition-colors',
          'flex items-center justify-center group'
        )}
      >
        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Weekly Schedule</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigateWeek(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onGoToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigateWeek(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 border-2 border-green-500 bg-green-50 dark:bg-green-950/20 rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/20 rounded" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-muted/30 border border-border/50 rounded" />
          <span>Past</span>
        </div>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[80px_repeat(7,minmax(100px,1fr))] gap-2 min-w-[800px]">
            {/* Header Row */}
            <div className="sticky left-0 bg-background z-10" />
            {weekDays.map((day, idx) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={idx}
                  className={cn(
                    'text-center p-2 font-semibold rounded-t-lg',
                    isToday && 'bg-primary/10 border-2 border-primary'
                  )}
                >
                  <div className="text-xs text-muted-foreground">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg">
                    {day.getDate()}
                  </div>
                </div>
              );
            })}

            {/* Time Slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="sticky left-0 bg-background z-10 flex items-center justify-end pr-2 text-xs text-muted-foreground font-medium">
                  {time}
                </div>
                {weekDays.map((day, dayIdx) => (
                  <div key={`${time}-${dayIdx}`}>
                    {renderSlot(day, time)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
