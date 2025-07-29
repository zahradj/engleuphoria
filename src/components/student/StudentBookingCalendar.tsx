import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  teacherId: string;
  teacherName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isAvailable: boolean;
}

interface StudentBookingCalendarProps {
  availableSlots: TimeSlot[];
  onBookLesson: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

export const StudentBookingCalendar = ({ 
  availableSlots, 
  onBookLesson, 
  isLoading = false 
}: StudentBookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  // Get slots for selected date
  const getSlotsForDate = (date: Date) => {
    return availableSlots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return slotDate.toDateString() === date.toDateString();
    });
  };

  // Get dates that have available slots
  const getDatesWithSlots = () => {
    const dates = new Set<string>();
    availableSlots.forEach(slot => {
      dates.add(new Date(slot.startTime).toDateString());
    });
    return Array.from(dates).map(dateStr => new Date(dateStr));
  };

  const handleBooking = (slot: TimeSlot) => {
    onBookLesson(slot);
    toast({
      title: "Lesson Booked!",
      description: `Your lesson with ${slot.teacherName} is confirmed for ${slot.startTime.toLocaleString()}`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const availableDates = getDatesWithSlots();
  const selectedDateSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select a Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isBeforeToday = date < today;
              const hasSlots = availableDates.some(availableDate => 
                availableDate.toDateString() === date.toDateString()
              );
              return isBeforeToday || !hasSlots;
            }}
            modifiers={{
              available: availableDates
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
                fontWeight: 'bold'
              }
            }}
            className="rounded-md border"
          />
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
              Dates with available lessons
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Available Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Available Times
            {selectedDate && (
              <Badge variant="outline" className="ml-2">
                {selectedDate.toLocaleDateString()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a date to see available times</p>
            </div>
          ) : selectedDateSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No available lessons for this date</p>
              <p className="text-sm mt-2">Try selecting another date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateSlots.map((slot) => (
                <Card key={slot.id} className="border border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{slot.teacherName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {slot.duration}min
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleBooking(slot)}
                        disabled={isLoading || !slot.isAvailable}
                        className="ml-4"
                      >
                        {slot.isAvailable ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Book Now
                          </>
                        ) : (
                          "Unavailable"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};