import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus } from "lucide-react";
import { InstructionPrompt } from "@/components/shared/InstructionPrompt";
import { useCalendarData } from "./hooks/useCalendarData";
import { useSlotActions } from "./hooks/useSlotActions";
import { SimpleTimeGrid } from "./components/SimpleTimeGrid";
import { QuickSlotCreator } from "./components/QuickSlotCreator";

interface SimplifiedTeacherCalendarProps {
  teacherId: string;
}

export const SimplifiedTeacherCalendar = ({ teacherId }: SimplifiedTeacherCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [showQuickCreator, setShowQuickCreator] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Generate time slots from 6 AM to 10 PM
  const timeSlots = Array.from({ length: 32 }, (_, i) => {
    const totalMinutes = 6 * 60 + i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  // Get week days starting from Monday
  const getWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);
  const { weeklySlots, isLoading, reloadSlots } = useCalendarData(teacherId, weekDays);
  const { createSlot, deleteSlot, createBulkSlots, isLoading: isActionsLoading } = useSlotActions(teacherId, reloadSlots);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const formatWeekRange = () => {
    const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = weekDays[6].toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${start} - ${end}`;
  };

  const handleSlotClick = (time: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingSlot = weeklySlots[dateStr]?.find(slot => slot.time === time);

    if (existingSlot?.isAvailable) {
      // Delete existing slot
      deleteSlot(existingSlot);
    } else {
      // Create new slot
      setSelectedDate(date);
      setSelectedTime(time);
      setShowSlotModal(true);
    }
  };

  const handleQuickSlotCreation = (times: string[], duration: 30 | 60) => {
    createBulkSlots([selectedDate], times, duration);
    setShowQuickCreator(false);
  };

  const handleCreateSingleSlot = () => {
    createSlot(selectedDate, selectedTime, selectedDuration);
    setShowSlotModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <InstructionPrompt
        title="Easy Availability Management"
        description="Click empty slots to create availability, click existing slots to remove them. Use Quick Creator for bulk actions."
        icon="💡"
      />

      <Card>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Availability Calendar</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <Select
                value={selectedDuration.toString()}
                onValueChange={(value) => setSelectedDuration(Number(value) as 30 | 60)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDate(new Date());
                  setShowQuickCreator(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Quick Creator
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-center min-w-[200px]">
                  <span className="text-sm font-medium">{formatWeekRange()}</span>
                </div>
                
                <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={goToToday}>
                <Calendar className="h-3 w-3 mr-1" />
                Today
              </Button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <SimpleTimeGrid
            weekDays={weekDays}
            timeSlots={timeSlots}
            weeklySlots={weeklySlots}
            onSlotClick={handleSlotClick}
            isLoading={isLoading || isActionsLoading}
          />
        </CardContent>
      </Card>

      {/* Quick Creator Modal */}
      <Dialog open={showQuickCreator} onOpenChange={setShowQuickCreator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Slot Creator</DialogTitle>
          </DialogHeader>
          <QuickSlotCreator
            selectedDate={selectedDate}
            onCreateSlots={handleQuickSlotCreation}
            isLoading={isActionsLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Single Slot Creation Modal */}
      <Dialog open={showSlotModal} onOpenChange={setShowSlotModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Availability Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
            </div>
            
            <Select
              value={selectedDuration.toString()}
              onValueChange={(value) => setSelectedDuration(Number(value) as 30 | 60)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleCreateSingleSlot} disabled={isActionsLoading} className="flex-1">
                Create Slot
              </Button>
              <Button variant="outline" onClick={() => setShowSlotModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};