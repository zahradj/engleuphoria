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

      const { data, error } = await supabase
        .from('lessons')
        .insert({
          teacher_id: teacher.user_id,
          student_id: user.id,
          title: `English Lesson with ${teacher.full_name}`,
          scheduled_at: scheduledAt.toISOString(),
          duration: 60,
          cost: teacher.hourly_rate_eur,
          status: 'scheduled'
        });

      if (error) throw error;

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
    <div className="container mx-auto py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/discover-teachers')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Teachers
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Teacher Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={teacher.profile_image_url} />
                <AvatarFallback>
                  {teacher.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{teacher.full_name}</CardTitle>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{teacher.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({teacher.total_reviews} reviews)</span>
                </div>
                {teacher.accent && (
                  <Badge variant="secondary">
                    <Globe className="w-3 h-3 mr-1" />
                    {teacher.accent}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {teacher.bio}
            </p>

            {teacher.specializations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-1">
                  {teacher.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Experience:</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {teacher.years_experience} years
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Rate:</span>
                <div className="font-semibold">
                  {teacher.hourly_rate_dzd} DZD/hr
                </div>
              </div>
            </div>

            {teacher.languages_spoken.length > 0 && (
              <div>
                <span className="text-muted-foreground">Languages:</span>
                <div className="text-sm">{teacher.languages_spoken.join(', ')}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Book a Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Select Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                className="rounded-md border"
              />
            </div>

            <div>
              <h4 className="font-semibold mb-3">Select Time</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableTimeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {selectedDate && selectedTime && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Lesson Summary</h4>
                <div className="space-y-1 text-sm">
                  <div>Teacher: {teacher.full_name}</div>
                  <div>Date: {selectedDate.toDateString()}</div>
                  <div>Time: {selectedTime}</div>
                  <div>Duration: 60 minutes</div>
                  <div className="font-semibold">Cost: {teacher.hourly_rate_dzd} DZD</div>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleBookLesson}
              disabled={!selectedDate || !selectedTime || isBooking}
            >
              {isBooking ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Booking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Book Lesson
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};