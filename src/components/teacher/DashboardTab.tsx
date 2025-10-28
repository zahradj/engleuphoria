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
import { HelloAdventuresQuickAccess } from "./dashboard/HelloAdventuresQuickAccess";

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
        if (diffMinutes <= 10 && diffMinutes >= -lesson.duration) {
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

          <HelloAdventuresQuickAccess />
          
          <RecentActivityFeed />
          
          {/* All Lessons Section */}
          <div className="rounded-xl border border-border/50 p-6 bg-card shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">All Lessons</h3>
                <button 
                  onClick={() => navigate('/teacher-dashboard?tab=history')}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View All →
                </button>
              </div>
              
              {loadingLessons ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-surface-2">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                      </div>
                      <div className="h-8 bg-muted rounded animate-pulse w-20"></div>
                    </div>
                  ))}
                </div>
              ) : recentLessons.length === 0 ? (
                <div className="text-center py-6 text-text-muted">
                  No lessons found
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLessons.slice(0, 5).map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-surface hover:bg-surface-2 transition-all duration-200 hover:shadow-md">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{lesson.title}</div>
                        <div className="text-xs text-text-muted space-x-2">
                          <span>{format(new Date(lesson.scheduled_at), 'MMM dd, HH:mm')}</span>
                          <span>•</span>
                          <span>{lesson.student?.full_name || 'Unknown Student'}</span>
                          <span>•</span>
                          <span>{lesson.duration} min</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          lesson.status === 'completed' ? 'bg-success-soft text-success' :
                          lesson.status === 'scheduled' ? 'bg-info-soft text-info' :
                          'bg-muted text-text-muted'
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
                            className="px-3 py-1 text-xs bg-gradient-to-r from-primary to-accent text-white rounded-md hover:opacity-90 transition-opacity"
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
      </div>

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};
