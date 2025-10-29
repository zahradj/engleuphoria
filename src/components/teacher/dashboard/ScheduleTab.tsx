import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react";
import { format, parseISO, isFuture, startOfWeek, endOfWeek } from "date-fns";
import { toast } from "sonner";

interface ScheduleTabProps {
  onScheduleClass: () => void;
  onStartScheduledClass: (className: string) => void;
}

interface BookedLesson {
  id: string;
  start_time: string;
  duration: number;
  student_name: string;
}

interface WeekStats {
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
}

export const ScheduleTab = ({ onScheduleClass, onStartScheduledClass }: ScheduleTabProps) => {
  const { user } = useAuth();
  const teacherId = user?.id || "";
  const [upcomingLessons, setUpcomingLessons] = useState<BookedLesson[]>([]);
  const [weekStats, setWeekStats] = useState<WeekStats>({ totalSlots: 0, bookedSlots: 0, availableSlots: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;

    const fetchScheduleData = async () => {
      try {
        const now = new Date().toISOString();
        const weekStart = startOfWeek(new Date()).toISOString();
        const weekEnd = endOfWeek(new Date()).toISOString();

        // Fetch upcoming booked lessons
        const { data: lessons, error: lessonsError } = await supabase
          .from('teacher_availability')
          .select('id, start_time, duration, student_name')
          .eq('teacher_id', teacherId)
          .eq('is_booked', true)
          .gte('start_time', now)
          .order('start_time', { ascending: true })
          .limit(5);

        if (lessonsError) throw lessonsError;
        setUpcomingLessons(lessons || []);

        // Fetch week statistics
        const { data: allSlots, error: statsError } = await supabase
          .from('teacher_availability')
          .select('is_booked')
          .eq('teacher_id', teacherId)
          .gte('start_time', weekStart)
          .lte('start_time', weekEnd);

        if (statsError) throw statsError;

        const total = allSlots?.length || 0;
        const booked = allSlots?.filter(slot => slot.is_booked).length || 0;
        setWeekStats({
          totalSlots: total,
          bookedSlots: booked,
          availableSlots: total - booked
        });

      } catch (error) {
        console.error('Error fetching schedule data:', error);
        toast.error('Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [teacherId]);

  if (!teacherId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please log in to access your schedule</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">{weekStats.totalSlots}</p>
              <p className="text-xs text-muted-foreground">Total Slots</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booked</p>
              <p className="text-2xl font-bold">{weekStats.bookedSlots}</p>
              <p className="text-xs text-muted-foreground">Lessons Scheduled</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold">{weekStats.availableSlots}</p>
              <p className="text-xs text-muted-foreground">Open Slots</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Lessons */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upcoming Lessons</h3>
          <Button onClick={onScheduleClass} variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Manage Calendar
          </Button>
        </div>

        {upcomingLessons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming lessons scheduled</p>
            <Button onClick={onScheduleClass} className="mt-4" variant="outline">
              Set Your Availability
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingLessons.map((lesson) => {
              const startTime = parseISO(lesson.start_time);
              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{lesson.student_name || 'Student'}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(startTime, 'EEE, MMM d')} at {format(startTime, 'h:mm a')}
                      </p>
                      <p className="text-xs text-muted-foreground">{lesson.duration} minutes</p>
                    </div>
                  </div>
                  {isFuture(startTime) && (
                    <Button
                      size="sm"
                      onClick={() => onStartScheduledClass(lesson.student_name || 'Class')}
                    >
                      Start Class
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Manage Your Full Calendar</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage all your availability slots, create new time slots, and track your schedule
          </p>
          <Button onClick={onScheduleClass}>
            Open Full Calendar
          </Button>
        </div>
      </Card>
    </div>
  );
};
