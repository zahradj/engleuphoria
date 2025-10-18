import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Star, Clock, Globe, ArrowLeft, CheckCircle, Video, Award, BookOpen, AlertCircle, CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { lessonService } from '@/services/lessonService';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Enhanced time slots based on common teaching hours
  const allTimeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    } else {
      toast({
        title: "No Teacher Selected",
        description: "Please select a teacher from the browse teachers page.",
        variant: "destructive",
      });
      navigate('/discover-teachers');
    }
  }, [teacherId]);

  useEffect(() => {
    if (selectedDate && teacher) {
      loadAvailableSlots();
    }
  }, [selectedDate, teacher]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
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
        title: "Teacher Not Available",
        description: "Unable to load teacher details. Please try again later.",
        variant: "destructive",
      });
      navigate('/discover-teachers');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !teacher) return;

    try {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Get teacher availability for the selected date
      const { data: availabilityData, error } = await supabase
        .from('teacher_availability')
        .select('start_time, end_time, is_booked')
        .eq('teacher_id', teacher.user_id)
        .gte('start_time', `${dateStr}T00:00:00`)
        .lt('start_time', `${dateStr}T23:59:59`)
        .eq('is_available', true)
        .eq('is_booked', false);

      if (error) throw error;

      // Extract available time slots from the availability data
      const slots = availabilityData?.map(slot => {
        const time = new Date(slot.start_time);
        return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
      }) || [];

      // If no specific availability, show all slots
      setAvailableSlots(slots.length > 0 ? slots : allTimeSlots);
    } catch (error) {
      console.error('Error loading availability:', error);
      // Fallback to default slots
      setAvailableSlots(allTimeSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookLesson = async () => {
    if (!user || !teacher || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for your lesson.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!user.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a lesson.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsBooking(true);
    
    try {
      // Create the scheduled datetime
      const scheduledAt = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Validate the date is in the future
      if (scheduledAt <= new Date()) {
        toast({
          title: "Invalid Time",
          description: "Please select a future date and time.",
          variant: "destructive",
        });
        return;
      }

      // Create the lesson
      const lessonData = {
        title: `English Lesson with ${teacher.full_name}`,
        teacher_id: teacher.user_id,
        student_id: user.id,
        scheduled_at: scheduledAt.toISOString(),
        duration: 60,
        cost: teacher.hourly_rate_eur,
        status: 'scheduled'
      };

      const newLesson = await lessonService.createLesson(lessonData);

      toast({
        title: "✅ Lesson Booked Successfully!",
        description: `Your lesson with ${teacher.full_name} is scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
      });

      // Navigate to student schedule
      setTimeout(() => {
        navigate('/student/schedule');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error booking lesson:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error booking your lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const openTeacherVideo = () => {
    if (teacher?.video_url) {
      window.open(teacher.video_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading teacher information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Teacher Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The teacher you're looking for is not available.
            </p>
            <Button onClick={() => navigate('/discover-teachers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Teachers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/discover-teachers')}
          className="mb-6 hover:bg-white/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teachers
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Teacher Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-lg">
              <CardHeader className="pb-4 bg-gradient-to-br from-purple-50/50 to-white">
                <div className="flex flex-col items-center text-center gap-4">
                  <Avatar className="w-28 h-28 border-4 border-white shadow-lg ring-2 ring-purple-100">
                    <AvatarImage src={teacher.profile_image_url} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {teacher.full_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="w-full space-y-2">
                    <CardTitle className="text-2xl">{teacher.full_name}</CardTitle>
                    
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{teacher.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-sm">
                          ({teacher.total_reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {teacher.accent && (
                      <Badge variant="secondary" className="text-sm">
                        <Globe className="w-3 h-3 mr-1" />
                        {teacher.accent} Accent
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-4">
                {/* Bio */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    About {teacher.full_name.split(' ')[0]}
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {teacher.bio}
                  </p>
                </div>

                {/* Video Preview */}
                {teacher.video_url && (
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={openTeacherVideo}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Watch Introduction Video
                    </Button>
                  </div>
                )}

                {/* Specializations */}
                {teacher.specializations?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Experience
                    </span>
                    <span className="font-semibold">
                      {teacher.years_experience} years
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Languages
                    </span>
                    <span className="font-medium text-xs text-right">
                      {teacher.languages_spoken.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground font-semibold">Rate</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600">
                        {teacher.hourly_rate_dzd} DZD
                      </div>
                      <div className="text-xs text-muted-foreground">
                        €{teacher.hourly_rate_eur}/hour
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Schedule Your Lesson</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a date and time that works best for you
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Info Alert */}
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All lessons are 60 minutes long. You'll receive a confirmation email and calendar invite after booking.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <h4 className="font-semibold mb-4">
                      Choose Date
                    </h4>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0; // Disable past dates and Sundays
                      }}
                      className="rounded-lg border-2 border-purple-100 shadow-sm pointer-events-auto"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      Available Times {selectedDate && `(${selectedDate.toLocaleDateString()})`}
                    </h4>
                    
                    {loadingSlots ? (
                      <div className="grid grid-cols-2 gap-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="h-11 bg-muted animate-pulse rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
                        {availableSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={`h-11 ${
                              selectedTime === time 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                                : 'hover:border-purple-300 hover:bg-purple-50'
                            }`}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}

                    {!loadingSlots && availableSlots.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No slots available for this date</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                    <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Booking Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Teacher</span>
                        <span className="font-semibold">{teacher.full_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-semibold">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-semibold">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-semibold">60 minutes</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-purple-200">
                        <span className="font-semibold">Total Cost</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {teacher.hourly_rate_dzd} DZD
                          </div>
                          <div className="text-sm text-muted-foreground">
                            (€{teacher.hourly_rate_eur})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                  onClick={handleBookLesson}
                  disabled={!selectedDate || !selectedTime || isBooking}
                  size="lg"
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      Booking Your Lesson...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      Confirm Booking
                    </div>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By booking, you agree to our{' '}
                  <button className="underline hover:text-foreground">terms of service</button> and{' '}
                  <button className="underline hover:text-foreground">cancellation policy</button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};