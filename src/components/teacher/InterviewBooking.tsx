
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, User, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface InterviewBookingProps {
  applicationId: string;
  onInterviewBooked: (interviewId: string) => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const InterviewBooking: React.FC<InterviewBookingProps> = ({ 
  applicationId, 
  onInterviewBooked 
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [existingInterview, setExistingInterview] = useState<any>(null);

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: false },
  ];

  useEffect(() => {
    checkExistingInterview();
  }, [applicationId]);

  const checkExistingInterview = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_interviews')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (data) {
        setExistingInterview(data);
      }
    } catch (error) {
      // No existing interview found
    }
  };

  const bookInterview = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);

    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

      const { data, error } = await supabase
        .from('teacher_interviews')
        .insert([{
          application_id: applicationId,
          scheduled_at: scheduledAt.toISOString(),
          duration: 20,
          interview_type: 'video_call',
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update application stage
      await supabase
        .from('teacher_applications')
        .update({ current_stage: 'interview_scheduled' })
        .eq('id', applicationId);

      toast({ title: "Interview booked successfully!" });
      onInterviewBooked(data.id);
      setExistingInterview(data);

    } catch (error) {
      console.error('Error booking interview:', error);
      toast({
        title: "Failed to book interview",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (existingInterview) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">Interview Scheduled!</CardTitle>
          <CardDescription>
            Your interview has been successfully booked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Interview Details</h3>
                <p className="text-gray-600">Professional assessment with our team</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Date</div>
                  <div className="text-gray-600">
                    {format(new Date(existingInterview.scheduled_at), 'EEEE, MMMM d, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Time</div>
                  <div className="text-gray-600">
                    {format(new Date(existingInterview.scheduled_at), 'HH:mm')} 
                    ({existingInterview.duration} minutes)
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Format</div>
                  <div className="text-gray-600">Video Call</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Status</div>
                  <Badge variant="secondary">
                    {existingInterview.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Professional discussion about your teaching experience</li>
              <li>• Brief demonstration of your teaching abilities</li>
              <li>• Questions about your availability and goals</li>
              <li>• Technical setup and platform overview</li>
            </ul>
          </div>

          <div className="text-center text-gray-600">
            <p>You'll receive an email with the video call link 24 hours before your interview.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Schedule Your Interview</CardTitle>
        <CardDescription>
          Choose a convenient time for your 20-minute professional interview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div>
            <h3 className="font-semibold mb-4">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => 
                date < new Date() || 
                date > addDays(new Date(), 14) ||
                date.getDay() === 0 || 
                date.getDay() === 6
              }
              className="rounded-md border"
            />
            <p className="text-sm text-gray-600 mt-2">
              Interviews available Monday-Friday, next 2 weeks
            </p>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="font-semibold mb-4">Select Time</h3>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className="justify-center"
                >
                  {slot.time}
                  {!slot.available && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Booked
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            
            {selectedDate && selectedTime && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Interview Summary:</h4>
                <div className="text-blue-800 text-sm space-y-1">
                  <div>📅 {format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
                  <div>🕐 {selectedTime} (20 minutes)</div>
                  <div>💻 Video call via our platform</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-6 border-t">
          <Button 
            onClick={bookInterview}
            disabled={!selectedDate || !selectedTime || isBooking}
            size="lg"
            className="px-8"
          >
            {isBooking ? 'Booking Interview...' : 'Confirm Interview Booking'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
