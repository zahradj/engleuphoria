import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";

interface CalendarHeaderProps {
  weekDays: Date[];
  selectedDuration: 30 | 60;
  onDurationChange: (duration: 30 | 60) => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
}

export const CalendarHeader = ({ 
  weekDays, 
  selectedDuration, 
  onDurationChange, 
  onNavigateWeek,
  onTodayClick 
}: CalendarHeaderProps) => {
  const formatWeekRange = () => {
    const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = weekDays[6].toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${start} - ${end}`;
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = weekDays[0];
    const endOfWeek = weekDays[6];
    return today >= startOfWeek && today <= endOfWeek;
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Weekly Schedule</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Select
          value={selectedDuration.toString()}
          onValueChange={(value) => onDurationChange(Number(value) as 30 | 60)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 min</SelectItem>
            <SelectItem value="60">60 min</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium min-w-[200px] text-center">
              {formatWeekRange()}
            </span>
            {!isCurrentWeek() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onTodayClick}
                className="text-xs"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Today
              </Button>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={() => onNavigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};