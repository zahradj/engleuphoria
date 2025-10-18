
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./StatsCard";
import { ActivityItem } from "./ActivityItem";
import { ClassCard } from "./ClassCard";
import { WelcomeSection } from "./WelcomeSection";
import { Calendar, Users, FileText, PlusCircle, CheckCircle, LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OverviewTabProps {
  onCreateLessonPlan: () => void;
  onScheduleClass: () => void;
  onViewProgress: () => void;
  onStartScheduledClass: (className: string) => void;
  onViewClassDetails: (className: string) => void;
}

export const OverviewTab = ({ 
  onCreateLessonPlan, 
  onScheduleClass, 
  onViewProgress, 
  onStartScheduledClass, 
  onViewClassDetails 
}: OverviewTabProps) => {
  const { languageText } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalStudents: 0, lessonPlans: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTeacherData = async () => {
      try {
        // Fetch upcoming lessons
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            scheduled_at,
            status,
            student_id,
            users!lessons_student_id_fkey(full_name)
          `)
          .eq('teacher_id', user.id)
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(4);

        if (lessonsError) throw lessonsError;

        // Transform lessons data
        const transformedLessons = lessons?.map(lesson => {
          const scheduledDate = new Date(lesson.scheduled_at);
          const now = new Date();
          const isToday = scheduledDate.toDateString() === now.toDateString();
          const isSoon = scheduledDate.getTime() - now.getTime() < 3600000; // Within 1 hour
          
          return {
            id: lesson.id,
            title: lesson.title,
            time: isToday 
              ? `Today, ${scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
              : scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
            students: 1,
            status: (isSoon || lesson.status === 'confirmed') ? 'ready' : 'scheduled' as const
          };
        }) || [];

        setUpcomingClasses(transformedLessons);

        // Fetch total unique students
        const { data: studentData, error: studentError } = await supabase
          .from('lessons')
          .select('student_id')
          .eq('teacher_id', user.id);

        if (studentError) throw studentError;

        const uniqueStudents = new Set(studentData?.map(l => l.student_id) || []);
        setStats({ totalStudents: uniqueStudents.size, lessonPlans: 0 });
        
      } catch (error: any) {
        console.error('Error fetching teacher data:', error);
        toast({
          title: "Error loading data",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();

    // Subscribe to real-time lesson updates
    const channel = supabase
      .channel('teacher-lessons')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'lessons', filter: `teacher_id=eq.${user.id}` },
        () => fetchTeacherData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeSection 
        teacherName="Teacher"
        onJoinClassroom={() => onStartScheduledClass("Next Class")}
        weeklyEarnings={2847}
        todaysClasses={upcomingClasses.filter(c => c.status === "ready").length}
        totalStudents={upcomingClasses.reduce((total, c) => total + c.students, 0)}
        rating="4.8"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Overview */}
      <StatsCard 
        title={languageText.upcomingClasses}
        value={upcomingClasses.filter(c => c.status === "ready").length.toString()}
        icon={<Calendar className="h-5 w-5 text-primary" />}
      />
      <StatsCard 
        title={languageText.activeStudents}
        value={loading ? "..." : stats.totalStudents.toString()}
        icon={<Users className="h-5 w-5 text-blue-500" />}
      />
      <StatsCard 
        title={languageText.lessonPlans}
        value={loading ? "..." : stats.lessonPlans.toString()}
        icon={<FileText className="h-5 w-5 text-green-500" />}
      />
      
      {/* Recent Activity */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{languageText.recentActivity}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ActivityItem 
            icon={<CheckCircle className="h-4 w-4 text-green-500" />}
            title={`${languageText.lessonCompleted}: Animal Vocabulary`}
            time="2h ago"
          />
          <ActivityItem 
            icon={<Users className="h-4 w-4 text-blue-500" />}
            title={languageText.newStudentEnrolled}
            time="Yesterday"
          />
          <ActivityItem 
            icon={<FileText className="h-4 w-4 text-purple-500" />}
            title={`${languageText.lessonPlanCreated}: Daily Routines`}
            time="3 days ago"
          />
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{languageText.quickActions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={onCreateLessonPlan}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {languageText.createLessonPlan}
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={onScheduleClass}>
            <Calendar className="mr-2 h-4 w-4" />
            {languageText.scheduleClass}
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={onViewProgress}>
            <LineChart className="mr-2 h-4 w-4" />
            {languageText.viewProgress}
          </Button>
        </CardContent>
      </Card>
      
      {/* Upcoming Classes - Full Width */}
      <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{languageText.upcomingClasses}</CardTitle>
          <Button size="sm" onClick={onScheduleClass}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule New Class
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingClasses.map((classInfo) => (
                <ClassCard 
                  key={classInfo.id}
                  title={classInfo.title}
                  time={classInfo.time}
                  students={classInfo.students}
                  buttonText={classInfo.status === "ready" ? languageText.startClass : languageText.viewDetails}
                  onButtonClick={() => {
                    if (classInfo.status === "ready") {
                      onStartScheduledClass(classInfo.title);
                    } else {
                      onViewClassDetails(classInfo.title);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming classes scheduled</p>
              <Button className="mt-4" onClick={onScheduleClass}>
                Schedule Your First Class
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
