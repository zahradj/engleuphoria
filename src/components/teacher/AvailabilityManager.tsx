import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus, Trash2, CalendarIcon, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TimeSlot {
  id: string;
  teacher_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  is_available: boolean;
  created_at: string;
}

interface AvailabilityManagerProps {
  teacherId: string;
}

export const AvailabilityManager = ({ teacherId }: AvailabilityManagerProps) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState("09:00");
  const [selectedEndTime, setSelectedEndTime] = useState("10:00");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableSlots();
  }, [teacherId]);

  const loadAvailableSlots = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('teacher_id', teacherId)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast({
        title: "Error",
        description: "Failed to load availability slots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTimeSlot = async () => {
    if (!selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a date.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const startTime24 = convertTo24Hour(selectedStartTime);
      const endTime24 = convertTo24Hour(selectedEndTime);
      
      if (startTime24 >= endTime24) {
        toast({
          title: "Invalid Time Range",
          description: "End time must be after start time.",
          variant: "destructive"
        });
        return;
      }

      const duration = calculateDuration(startTime24, endTime24);
      
      const { data, error } = await supabase
        .from('teacher_availability')
        .insert({
          teacher_id: teacherId,
          date: selectedDate.toISOString().split('T')[0],
          start_time: startTime24,
          end_time: endTime24,
          duration,
          is_available: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Time Slot Created!",
        description: `Available slot created for ${selectedDate.toLocaleDateString()} from ${selectedStartTime} to ${selectedEndTime}.`
      });

      loadAvailableSlots();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating slot:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create time slot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTimeSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Slot Deleted",
        description: "Time slot has been removed from your availability."
      });

      loadAvailableSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete time slot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const convertTo24Hour = (time12: string): string => {
    return time12;
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    return slots.reduce((groups, slot) => {
      const date = slot.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    }, {} as Record<string, TimeSlot[]>);
  };

  const groupedSlots = groupSlotsByDate(slots);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Your Availability</h2>
          <p className="text-gray-600">Create time slots that students can book for lessons</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      {/* Available Slots Display */}
      <div className="grid gap-4">
        {Object.keys(groupedSlots).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Available Slots</h3>
              <p className="text-gray-500 mb-4">Create your first time slot to allow students to book lessons</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Slot
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {dateSlots.map((slot) => (
                    <div 
                      key={slot.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {slot.start_time} - {slot.end_time}
                        </span>
                        <Badge variant={slot.is_available ? "default" : "secondary"}>
                          {slot.is_available ? "Available" : "Booked"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          ({slot.duration} min)
                        </span>
                      </div>
                      {slot.is_available && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTimeSlot(slot.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Slot Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Available Time Slot
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="border rounded-lg p-3"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={selectedStartTime} onValueChange={setSelectedStartTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select value={selectedEndTime} onValueChange={setSelectedEndTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDate && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Slot Preview</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>📅 {selectedDate.toLocaleDateString()}</div>
                      <div>🕒 {selectedStartTime} - {selectedEndTime}</div>
                      <div>⏱️ {calculateDuration(selectedStartTime, selectedEndTime)} minutes</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={createTimeSlot} 
                disabled={isCreating || !selectedDate}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Plus className="h-4 w-4 mr-2 animate-pulse" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Slot
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};