import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Check, Lock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AvailabilitySlot, TimeSlot } from './types';
import { formatTime, isSameDay, isPast, generateTimeSlots } from '@/utils/timezoneUtils';
import '@/styles/calendar-theme.css';

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
  const today = useMemo(() => new Date(), []);

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

    // Helper function to get gradient based on CEFR level
    const getGradientByLevel = (level?: string) => {
      if (!level) return 'from-purple-500 to-pink-500';
      const firstChar = level.charAt(0).toUpperCase();
      if (firstChar === 'A') return 'from-blue-500 to-cyan-500';
      if (firstChar === 'B') return 'from-purple-500 to-pink-500';
      if (firstChar === 'C') return 'from-orange-500 to-red-500';
      return 'from-purple-500 to-pink-500';
    };

    if (slot?.isBooked) {
      const avatarLetter = slot.studentEmail?.charAt(0).toUpperCase() || 'S';
      const gradientClasses = getGradientByLevel(slot.studentCefrLevel);
      
      return (
        <div
          className={cn(
            'relative group h-20 rounded-xl overflow-hidden transition-all duration-500',
            'cal-glass-card hover:scale-[1.02] cursor-pointer',
            'shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.3)]'
          )}
        >
          {/* Animated gradient background */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity cal-gradient-animate',
            gradientClasses
          )} style={{ opacity: 0.1 }} />
          
          {/* Content */}
          <div className="relative p-2.5 space-y-0.5">
            {/* Header with avatar */}
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg',
                `bg-gradient-to-br ${gradientClasses}`
              )}>
                {avatarLetter}
              </div>
              <span className="text-xs font-bold text-foreground truncate flex-1">
                {slot.studentEmail ? slot.studentEmail.split('@')[0] : 'Student'}
              </span>
              <Lock className="w-3 h-3 text-muted-foreground" />
            </div>
            
            {/* Level badges */}
            {slot.studentCefrLevel && (
              <div className="flex items-center gap-1 text-[10px]">
                <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                  📚 {slot.studentCefrLevel}
                </span>
                {slot.studentFinalCefrLevel && slot.studentFinalCefrLevel !== slot.studentCefrLevel && (
                  <>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-success/20 text-success font-semibold">
                      {slot.studentFinalCefrLevel}
                    </span>
                  </>
                )}
              </div>
            )}
            
            {/* Additional info */}
            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
              {slot.studentGradeLevel && (
                <span>🎓 Grade {slot.studentGradeLevel}</span>
              )}
              <span>⏱️ {slot.duration}m</span>
            </div>
            
            {/* Lesson title if exists */}
            {slot.lessonTitle && (
              <div className="text-[9px] text-muted-foreground truncate w-full">
                🎯 {slot.lessonTitle}
              </div>
            )}
          </div>
          
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
               style={{
                 background: 'linear-gradient(90deg, hsl(187, 94%, 43%), hsl(258, 90%, 66%), hsl(330, 81%, 60%))',
                 backgroundSize: '200% 200%',
                 WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                 WebkitMaskComposite: 'xor',
                 maskComposite: 'exclude',
                 padding: '2px'
               }} />
        </div>
      );
    }

    if (slot?.isAvailable) {
      return (
        <button
          onClick={() => onSlotClick(date, time)}
          className={cn(
            'h-20 rounded-xl transition-all duration-500 cal-glass-card relative group overflow-hidden',
            'border-2 border-success/30 hover:border-success hover:scale-[1.02]',
            'cal-pulse-glow'
          )}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                          opacity-50 group-hover:opacity-100 transition-opacity" />
          
          {/* Content */}
          <div className="relative flex flex-col items-center justify-center h-full">
            <div className="flex items-center gap-1">
              <Check className="w-5 h-5 text-success" />
              <span className="text-sm font-bold text-success">OPEN</span>
            </div>
            <span className="absolute top-1.5 right-1.5 bg-success/20 text-success text-xs px-1.5 py-0.5 rounded-full font-semibold">
              {slot.duration}m
            </span>
          </div>
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 cal-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      );
    }

    if (isPastSlot) {
      return (
        <div className="h-20 bg-muted/20 rounded-xl border border-border/30 cursor-not-allowed 
                        opacity-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)]" />
        </div>
      );
    }

    return (
      <button
        onClick={() => onSlotClick(date, time)}
        className={cn(
          'h-20 border-2 border-dashed border-border/40 rounded-xl',
          'hover:border-primary hover:bg-primary/5 hover:scale-[1.01] transition-all duration-300',
          'flex items-center justify-center group relative overflow-hidden'
        )}
      >
        {/* Gradient fill on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 
                        opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Plus icon */}
        <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary 
                        opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110 relative z-10" />
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-xl bg-primary/20 scale-0 group-active:scale-100 
                        transition-transform duration-300" />
      </button>
    );
  };

  return (
    <Card className="p-6 cal-glass-card">
      {/* Header with gradient background */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Weekly Schedule
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigateWeek(-1)}
            className="cal-glass-card hover:shadow-lg transition-all hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGoToToday}
            className="cal-glass-card hover:shadow-lg transition-all hover:scale-105 font-semibold"
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigateWeek(1)}
            className="cal-glass-card hover:shadow-lg transition-all hover:scale-105"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modern Legend with 3D pills */}
      <div className="flex items-center gap-4 mb-6 p-3 rounded-xl cal-glass-card">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
          <div className="w-3 h-3 rounded-full bg-success shadow-lg" />
          <span className="text-sm font-medium text-success">Available</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg" />
          <span className="text-sm font-medium text-accent">Booked</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/10 border border-muted/30">
          <div className="w-3 h-3 rounded-full bg-muted shadow-lg" />
          <span className="text-sm font-medium text-muted-foreground">Past</span>
        </div>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary" />
            <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <div className="grid grid-cols-[100px_repeat(7,minmax(140px,1fr))] gap-4 min-w-[900px]">
            {/* Header Row */}
            <div className="sticky left-0 bg-background z-10" />
            {weekDays.map((day, idx) => {
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={idx}
                  className={cn(
                    'text-center p-3 font-bold rounded-xl transition-all duration-300',
                    'cal-glass-card hover:scale-105',
                    isToday && 'bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary shadow-lg'
                  )}
                >
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={cn(
                    "text-2xl mt-1",
                    isToday && "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                  )}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}

            {/* Time Slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="sticky left-0 bg-background z-10 flex items-center justify-end pr-3 py-1 
                                text-sm text-muted-foreground font-bold">
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
