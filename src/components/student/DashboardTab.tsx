
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Play, 
  Clock,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentHandlers } from "@/hooks/useStudentHandlers";
import { useAuth } from "@/hooks/useAuth";
import { HomeworkSubmissionModal } from "./HomeworkSubmissionModal";
import { TeacherMessageModal } from "./TeacherMessageModal";
import { StudentLessonTracker } from "@/components/dashboard/student/StudentLessonTracker";
import { StudentWelcomeSection } from "./dashboard/StudentWelcomeSection";
import { StudentStatsOverview } from "./dashboard/StudentStatsOverview";
import { StudentActivityFeed } from "./dashboard/StudentActivityFeed";
import { StudentQuickActions } from "./dashboard/StudentQuickActions";
import { StudentLearningGoals } from "./dashboard/StudentLearningGoals";

interface DashboardTabProps {
  studentName: string;
  studentId: string;
  hasProfile: boolean;
  studentProfile: any;
}

export const DashboardTab = ({ studentName, studentId, hasProfile, studentProfile }: DashboardTabProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    handleJoinClass,
    handleSubmitHomework,
    handleMessageTeacher,
    handleViewMaterials,
    handleBookClass,
    handlePracticeVocabulary,
    handleViewProgress
  } = useStudentHandlers();

  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const handleJoinClassroom = () => {
    navigate("/media-test?roomId=unified-classroom-1&role=student&name=" + encodeURIComponent(studentName) + "&userId=" + studentId);
  };

  const handleHomeworkSubmit = (submission: { text: string; files: File[] }) => {
    if (selectedAssignment) {
      handleSubmitHomework(selectedAssignment, submission);
    }
    setShowHomeworkModal(false);
    setSelectedAssignment(null);
  };

  const openHomeworkSubmission = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setShowHomeworkModal(true);
  };

  // Import the enhanced upcoming classes component
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming classes on component mount
  React.useEffect(() => {
    const fetchUpcomingClasses = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Use the existing lesson service to fetch student lessons
        const { lessonService } = await import('@/services/lessonService');
        const lessons = await lessonService.getStudentUpcomingLessons(user.id);
        setUpcomingClasses(lessons.slice(0, 3)); // Show only first 3 on dashboard
      } catch (error) {
        console.error('Error fetching upcoming classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingClasses();
  }, [user?.id]);

  const recentHomework: any[] = [];

  const achievements: any[] = [];

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <StudentWelcomeSection
        studentName={studentName}
        studentId={studentId}
        hasProfile={hasProfile}
        studentProfile={studentProfile}
        onJoinClassroom={handleJoinClassroom}
      />

      {/* Lesson Tracker Section */}
      <StudentLessonTracker />

      {/* Enhanced Stats Overview */}
      <StudentStatsOverview hasProfile={hasProfile} studentProfile={studentProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Upcoming Classes */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-student-light to-student-light/80 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-student" />
                <span className="text-gray-800">Upcoming Classes</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/discover-teachers')}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your lessons...</p>
              </div>
            ) : upcomingClasses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-student" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">No classes scheduled</h3>
                <p className="text-gray-500 mb-4">Book your first lesson to get started!</p>
                <Button onClick={() => navigate('/discover-teachers')} className="bg-student hover:bg-student-dark text-student-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Book a Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingClasses.map((lesson) => (
                  <div key={lesson.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{lesson.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4" />
                          {new Date(lesson.scheduled_at).toLocaleDateString()} at {new Date(lesson.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-student mt-1">with {lesson.teacher_name || 'Teacher'}</p>
                        <Badge variant="secondary" className="mt-1">
                          {lesson.duration} minutes
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          className="bg-student hover:bg-student-dark text-student-foreground"
                          onClick={() => {
                            if (lesson.room_link) {
                              // Navigate to the classroom with proper parameters
                              const url = new URL(lesson.room_link);
                              url.searchParams.set('role', 'student');
                              url.searchParams.set('name', studentName);
                              url.searchParams.set('userId', user?.id || '');
                              window.open(url.toString(), '_blank');
                            } else {
                              handleJoinClassroom();
                            }
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Join Class
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/student/schedule')}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          View All
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Recent Homework */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-student-light to-student-light/80 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-student" />
                <span className="text-gray-800">Recent Homework</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openHomeworkSubmission("new")}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentHomework.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-student-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-student" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">No assignments yet</h3>
                <p className="text-gray-500 mb-4">Your homework will appear here once assigned.</p>
                <Button variant="outline" onClick={() => openHomeworkSubmission("new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Work
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentHomework.map((hw) => (
                  <div key={hw.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{hw.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4" />
                          Due {hw.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={hw.status === 'submitted' ? 'default' : 'secondary'}>
                          {hw.status}
                        </Badge>
                        {hw.status === 'pending' && (
                          <Button size="sm" onClick={() => openHomeworkSubmission(hw.id)} className="bg-student hover:bg-student-dark text-student-foreground">
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals and Daily Progress */}
      <StudentLearningGoals hasProfile={hasProfile} />

      {/* Activity Feed and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StudentActivityFeed hasProfile={hasProfile} />
        <div>
          <StudentQuickActions
            onJoinClassroom={handleJoinClassroom}
            onOpenHomeworkModal={() => openHomeworkSubmission("new")}
            onOpenMessageModal={() => setShowMessageModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <HomeworkSubmissionModal
        isOpen={showHomeworkModal}
        onClose={() => {
          setShowHomeworkModal(false);
          setSelectedAssignment(null);
        }}
        assignmentTitle={selectedAssignment && selectedAssignment !== "new" ? recentHomework.find(hw => hw.id === selectedAssignment)?.title || "New Assignment" : "New Assignment"}
        onSubmit={handleHomeworkSubmit}
      />

      <TeacherMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleMessageTeacher}
      />
    </div>
  );
};
