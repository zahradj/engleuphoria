import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Star, Clock, Globe, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { lessonService } from '@/services/lessonService';

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  video_url: string;
  profile_image_url?: string;
  specializations: string[];
  accent?: string;
  languages_spoken: string[];
  years_experience: number;
  rating: number;
  total_reviews: number;
  hourly_rate_dzd: number;
  hourly_rate_eur: number;
  timezone: string;
}

export const BookLesson = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const teacherId = searchParams.get('teacherId');
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

  const availableTimeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    } else {
      toast({
        title: "Error",
        description: "No teacher selected",
        variant: "destructive",
      });
      navigate('/discover-teachers');
    }
  }, [teacherId]);

  const fetchTeacher = async () => {
    try {
      const { data, error } = await supabase.rpc('get_approved_teachers');
      
      if (error) throw error;
      
      const teacherData = data.find((t: Teacher) => t.user_id === teacherId);
      if (teacherData) {
        setTeacher(teacherData);
      } else {
        throw new Error('Teacher not found');
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
      toast({
        title: "Error loading teacher",
        description: "Please try again later",
        variant: "destructive",
      });
      navigate('/discover-teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleBookLesson = async () => {
    if (!user || !teacher || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    try {
      // Create the lesson booking
      const scheduledAt = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Use the lesson service to create the lesson for better consistency
      const lessonData = {
        title: `English Lesson with ${teacher.full_name}`,
        teacher_id: teacher.user_id,
        student_id: user.id,
        scheduled_at: scheduledAt.toISOString(),
        duration: 60,
        cost: teacher.hourly_rate_eur
      };

      const newLesson = await lessonService.createLesson(lessonData);

      toast({
        title: "Lesson Booked Successfully!",
        description: `Your lesson with ${teacher.full_name} is scheduled for ${selectedDate.toDateString()} at ${selectedTime}`,
      });

      // Navigate to student dashboard
      navigate('/student');
      
    } catch (error) {
      console.error('Error booking lesson:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading teacher details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Teacher Not Found</h1>
          <Button onClick={() => navigate('/discover-teachers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/discover-teachers')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teachers
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Teacher Info - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center text-center gap-4">
                  <Avatar className="w-24 h-24 border-4 border-primary/10">
                    <AvatarImage src={teacher.profile_image_url} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {teacher.full_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <CardTitle className="text-xl mb-1">{teacher.full_name}</CardTitle>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{teacher.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">({teacher.total_reviews})</span>
                    </div>
                    {teacher.accent && (
                      <Badge variant="secondary" className="mb-2">
                        <Globe className="w-3 h-3 mr-1" />
                        {teacher.accent}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {teacher.bio}
                </p>

                {teacher.specializations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Specializations</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {teacher.years_experience} years
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <div className="font-semibold text-primary">
                      {teacher.hourly_rate_dzd} DZD/hr
                    </div>
                  </div>
                </div>

                {teacher.languages_spoken.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Languages:</span>
                    <div className="text-sm font-medium mt-1">
                      {teacher.languages_spoken.join(', ')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form - Main Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl">Schedule Your Lesson</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a convenient date and time for your lesson
                </p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Select Date
                    </h4>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-lg border border-border"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Available Times
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="h-11"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="p-5 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Lesson Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teacher</span>
                        <span className="font-medium">{teacher.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">60 minutes</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground font-semibold">Total Cost</span>
                        <span className="font-bold text-lg text-primary">{teacher.hourly_rate_dzd} DZD</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full h-12 text-base"
                  onClick={handleBookLesson}
                  disabled={!selectedDate || !selectedTime || isBooking}
                  size="lg"
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Processing Booking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Confirm Booking
                    </div>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By booking, you agree to our terms of service and cancellation policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};