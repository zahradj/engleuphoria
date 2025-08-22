import React, { useState, useEffect } from "react";
import { useTeacherHandlers } from "@/hooks/useTeacherHandlers";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { lessonService, ScheduledLesson } from "@/services/lessonService";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { WelcomeSection } from "./dashboard/WelcomeSection";
import { BalanceOverview } from "./dashboard/BalanceOverview";
import { UpcomingClassesCard } from "./dashboard/UpcomingClassesCard";
import { PendingHomeworkCard } from "./dashboard/PendingHomeworkCard";
import { NotificationsCard } from "./dashboard/NotificationsCard";
import { QuickActionsCard } from "./dashboard/QuickActionsCard";
import { TeacherStatsOverview } from "./dashboard/TeacherStatsOverview";
import { RecentActivityFeed } from "./dashboard/RecentActivityFeed";
import { AddStudentModal } from "./dashboard/AddStudentModal";

interface DashboardTabProps {
  teacherName: string;
}

export const DashboardTab = ({ teacherName }: DashboardTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [upcomingLessons, setUpcomingLessons] = useState<ScheduledLesson[]>([]);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const { 
    handleJoinClass, 
    handleScheduleClass, 
    handleCreateAssignment, 
    handleSendMessage, 
    handleManageStudents 
  } = useTeacherHandlers();

  const handleJoinClassroom = () => {
    navigate("/media-test?roomId=unified-classroom-1&role=teacher&name=" + encodeURIComponent(teacherName) + "&userId=teacher-1");
  };

  const handleStartClass = (classId: string) => {
    const lesson = upcomingLessons.find(l => l.id === classId);
    if (lesson?.room_link) {
      const url = new URL(lesson.room_link);
      url.searchParams.set('role', 'teacher');
      url.searchParams.set('name', teacherName);
      url.searchParams.set('userId', user?.id || 'teacher-1');
      window.open(url.toString(), '_blank');
    } else {
      toast({
        title: "Starting Class",
        description: `Starting class: ${lesson?.title || classId}`,
      });
      navigate("/media-test?roomId=unified-classroom-1&role=teacher&name=" + encodeURIComponent(teacherName) + "&userId=" + (user?.id || 'teacher-1'));
    }
  };

  const handleAddStudent = () => {
    setIsAddStudentModalOpen(true);
  };

  const handleStudentAdded = (student: any) => {
    // In a real app, this would save to database
    console.log("New student added:", student);
  };

  const handleViewEarnings = () => {
    toast({
      title: "View Earnings",
      description: "Opening earnings overview...",
    });
  };

  // Fetch real lesson data
  useEffect(() => {
    const fetchLessons = async () => {
      if (!user?.id) return;
      
      setLoadingLessons(true);
      try {
        // Fetch upcoming lessons
        const upcoming = await lessonService.getTeacherUpcomingLessons(user.id);
        setUpcomingLessons(upcoming);
        
        // Fetch recent lessons for "All Lessons" section
        const { data: recent, error } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            scheduled_at,
            duration,
            status,
            room_link,
            student:users!lessons_student_id_fkey(full_name)
          `)
          .eq('teacher_id', user.id)
          .order('scheduled_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        setRecentLessons(recent || []);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        toast({
          title: "Error",
          description: "Failed to load lesson data",
          variant: "destructive",
        });
      } finally {
        setLoadingLessons(false);
      }
    };
    
    fetchLessons();
  }, [user?.id, toast]);

  // Transform lessons to ClassInfo format
  const todaysClasses = upcomingLessons.map(lesson => {
    const scheduledTime = new Date(lesson.scheduled_at);
    const now = new Date();
    const diffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    
    let status: "upcoming" | "ready" | "live" = "upcoming";
    if (diffMinutes <= 15 && diffMinutes >= -lesson.duration) {
      status = diffMinutes <= 0 ? "live" : "ready";
    }
    
    return {
      id: lesson.id,
      title: lesson.title,
      time: format(scheduledTime, 'HH:mm'),
      student: lesson.student_name || 'Unknown Student',
      studentCount: 1,
      status,
      earnings: 10 // Keep consistent with UI
    };
  });

  const pendingHomework: any[] = [];
  const notifications: any[] = [];
  
  // TODO: Connect to real earnings data
  const earningsData = {
    weeklyEarnings: 0,
    pendingPayment: 0,
    totalBalance: 0
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeSection 
        teacherName={teacherName}
        onJoinClassroom={handleJoinClassroom}
        weeklyEarnings={earningsData.weeklyEarnings}
      />

      <BalanceOverview
        weeklyEarnings={earningsData.weeklyEarnings}
        pendingPayment={earningsData.pendingPayment}
        totalBalance={earningsData.totalBalance}
      />

      <TeacherStatsOverview />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <UpcomingClassesCard 
            classes={todaysClasses}
            onJoinClass={handleJoinClass}
            onStartClass={handleStartClass}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingHomeworkCard homework={pendingHomework} />
            <NotificationsCard notifications={notifications} />
          </div>
        </div>

        <div className="space-y-6">
          <QuickActionsCard 
            onScheduleClass={handleScheduleClass}
            onCreateAssignment={handleCreateAssignment}
            onSendMessage={handleSendMessage}
            onManageStudents={handleManageStudents}
            onAddStudent={handleAddStudent}
            onViewEarnings={handleViewEarnings}
          />
          
          <RecentActivityFeed />
          
          {/* All Lessons Section */}
          <div className="rounded-xl border p-6" style={{ backgroundColor: '#FBFBFB', borderColor: '#C5BAFF' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">All Lessons</h3>
              <button 
                onClick={() => navigate('/teacher-dashboard?tab=history')}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All →
              </button>
            </div>
            
            {loadingLessons ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                    </div>
                    <div className="h-8 bg-muted rounded animate-pulse w-20"></div>
                  </div>
                ))}
              </div>
            ) : recentLessons.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No lessons found
              </div>
            ) : (
              <div className="space-y-3">
                {recentLessons.slice(0, 5).map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border transition-colors" style={{ borderColor: '#C4D9FF' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F9FF'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{lesson.title}</div>
                      <div className="text-xs text-muted-foreground space-x-2">
                        <span>{format(new Date(lesson.scheduled_at), 'MMM dd, HH:mm')}</span>
                        <span>•</span>
                        <span>{lesson.student?.full_name || 'Unknown Student'}</span>
                        <span>•</span>
                        <span>{lesson.duration} min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                        lesson.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lesson.status}
                      </span>
                      {lesson.status === 'scheduled' && lesson.room_link && (
                        <button 
                          onClick={() => {
                            const url = new URL(lesson.room_link);
                            url.searchParams.set('role', 'teacher');
                            url.searchParams.set('name', teacherName);
                            url.searchParams.set('userId', user?.id || 'teacher-1');
                            window.open(url.toString(), '_blank');
                          }}
                          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};
