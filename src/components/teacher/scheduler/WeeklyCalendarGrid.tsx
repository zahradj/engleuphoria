import React from 'react';
import { AvailabilitySlot, DAYS, TIME_SLOTS } from './types';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeeklyCalendarGridProps {
  weekDates: Array<{ day: string; date: Date; formatted: string }>;
  getSlotAt: (day: string, time: string) => AvailabilitySlot | undefined;
  isSlotInPast: (day: string, time: string) => boolean;
  onSlotClick: (day: string, time: string) => void;
  slotDuration: 30 | 60;
}

export const WeeklyCalendarGrid: React.FC<WeeklyCalendarGridProps> = ({
  weekDates,
  getSlotAt,
  isSlotInPast,
  onSlotClick,
  slotDuration
}) => {
  const getSlotStyle = (day: string, time: string) => {
    const slot = getSlotAt(day, time);
    const isPast = isSlotInPast(day, time);

    if (isPast) {
      return 'bg-muted/50 cursor-not-allowed opacity-50';
    }

    if (!slot) {
      return 'bg-background hover:bg-muted/50 cursor-pointer border border-border/50 hover:border-primary/30 transition-all';
    }

    if (slot.status === 'booked') {
      return 'bg-blue-500 text-white cursor-default shadow-md';
    }

    // Open slot
    return 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-md transition-all';
  };

  const renderSlotContent = (day: string, time: string) => {
    const slot = getSlotAt(day, time);
    const isPast = isSlotInPast(day, time);

    if (isPast) {
      return null;
    }

    if (!slot) {
      return (
        <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          +
        </span>
      );
    }

    if (slot.status === 'booked' && slot.studentName) {
      return (
        <span className="text-[10px] font-medium truncate">
          {slot.studentName}
        </span>
      );
    }

    return (
      <span className="text-[10px] font-medium">
        {slot.duration}m
      </span>
    );
  };

  // Filter to show only hourly times for the row headers
  const hourlyTimes = TIME_SLOTS.filter(t => t.endsWith(':00'));

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header row with days */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-muted/30">
        <div className="p-2 text-center text-xs font-medium text-muted-foreground">
          Time
        </div>
        {weekDates.map(({ day, date, formatted }) => (
          <div
            key={day}
            className={cn(
              "p-2 text-center border-l border-border",
              isToday(date) && "bg-primary/10"
            )}
          >
            <p className="text-xs font-semibold text-foreground">{day.slice(0, 3)}</p>
            <p className={cn(
              "text-[10px]",
              isToday(date) ? "text-primary font-medium" : "text-muted-foreground"
            )}>
              {formatted}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {hourlyTimes.map((time, rowIndex) => {
          const halfHourTime = time.replace(':00', ':30');
          
          return (
            <React.Fragment key={time}>
              {/* Hour row */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/50">
                <div className="p-1 text-center text-xs text-muted-foreground flex items-center justify-center bg-muted/20">
                  {time}
                </div>
                {weekDates.map(({ day }) => (
                  <button
                    key={`${day}-${time}`}
                    onClick={() => onSlotClick(day, time)}
                    className={cn(
                      "group h-10 border-l border-border/50 flex items-center justify-center",
                      getSlotStyle(day, time)
                    )}
                    disabled={isSlotInPast(day, time)}
                  >
                    {renderSlotContent(day, time)}
                  </button>
                ))}
              </div>

              {/* Half-hour row */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/30">
                <div className="p-1 text-center text-[10px] text-muted-foreground/70 flex items-center justify-center bg-muted/10">
                  {halfHourTime}
                </div>
                {weekDates.map(({ day }) => (
                  <button
                    key={`${day}-${halfHourTime}`}
                    onClick={() => onSlotClick(day, halfHourTime)}
                    className={cn(
                      "group h-8 border-l border-border/30 flex items-center justify-center",
                      getSlotStyle(day, halfHourTime)
                    )}
                    disabled={isSlotInPast(day, halfHourTime)}
                  >
                    {renderSlotContent(day, halfHourTime)}
                  </button>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
