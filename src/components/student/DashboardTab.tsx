
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  FileText, 
  TrendingUp, 
  Play, 
  Clock,
  Star,
  Award,
  BookOpen,
  MessageCircle,
  FolderOpen,
  Video,
  Target,
  Flame,
  BarChart3,
  Users,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentHandlers } from "@/hooks/useStudentHandlers";
import { useAuth } from "@/hooks/useAuth";
import { HomeworkSubmissionModal } from "./HomeworkSubmissionModal";
import { TeacherMessageModal } from "./TeacherMessageModal";
import { StudentLessonTracker } from "@/components/dashboard/student/StudentLessonTracker";

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
    <div className="space-y-6">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Hello, {studentName}! 🌟</h1>
              <p className="text-sm opacity-80 mb-2 font-mono">ID: {studentId}</p>
              <p className="opacity-90 text-lg">
                {hasProfile 
                  ? "Ready to continue your English adventure?" 
                  : "Let's start your English learning journey!"
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Today</div>
              <div className="text-xl font-bold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {hasProfile && studentProfile && (
              <>
                {studentProfile.points && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <Star className="h-5 w-5 fill-current mx-auto mb-1" />
                    <div className="font-bold">{studentProfile.points}</div>
                    <div className="text-xs opacity-80">Points</div>
                  </div>
                )}
                {studentProfile.level && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                    <div className="font-bold">Level {studentProfile.level}</div>
                    <div className="text-xs opacity-80">Current</div>
                  </div>
                )}
              </>
            )}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <Flame className="h-5 w-5 mx-auto mb-1" />
              <div className="font-bold">{hasProfile ? "7" : "0"}</div>
              <div className="text-xs opacity-80">Day Streak</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <Target className="h-5 w-5 mx-auto mb-1" />
              <div className="font-bold">{hasProfile ? "3/5" : "0/5"}</div>
              <div className="text-xs opacity-80">Week Goal</div>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {!hasProfile && (
              <Button 
                onClick={() => navigate('/dashboard?tab=profile')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                size="sm"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Complete Profile
              </Button>
            )}
            <Button 
              onClick={handleJoinClassroom}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              size="sm"
            >
              <Video className="h-4 w-4 mr-2" />
              Join Classroom
            </Button>
            <Button 
              onClick={() => navigate('/discover-teachers')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book Lesson
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson Tracker Section */}
      <StudentLessonTracker />

      {/* Learning Progress Section */}
      {hasProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Weekly Progress</h3>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  60%
                </Badge>
              </div>
              <Progress value={60} className="mb-2" />
              <p className="text-sm text-gray-600">3 of 5 lessons completed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Assignments</h3>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  All Done
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-600">2/2</div>
              <p className="text-sm text-gray-600">Completed this week</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Class Rank</h3>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Top 10%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-purple-600">#5</div>
              <p className="text-sm text-gray-600">out of 50 students</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Upcoming Classes */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
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
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">No classes scheduled</h3>
                <p className="text-gray-500 mb-4">Book your first lesson to get started!</p>
                <Button onClick={() => navigate('/discover-teachers')} className="bg-blue-600 hover:bg-blue-700">
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
                        <p className="text-sm text-blue-600 mt-1">with {lesson.teacher_name || 'Teacher'}</p>
                        <Badge variant="secondary" className="mt-1">
                          {lesson.duration} minutes
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700" 
                          onClick={() => {
                            if (lesson.room_link) {
                              window.open(lesson.room_link, '_blank');
                            } else {
                              handleJoinClassroom();
                            }
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Join
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
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
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
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
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
                          <Button size="sm" onClick={() => openHomeworkSubmission(hw.id)} className="bg-green-600 hover:bg-green-700">
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

      {/* Enhanced Achievements & Learning Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="text-gray-800">Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {achievements.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">No achievements yet</h3>
                <p className="text-gray-500 mb-4">Complete lessons and activities to earn your first badge!</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "🏆", title: "First Lesson", progress: hasProfile ? 50 : 0 },
                    { icon: "📚", title: "Homework Hero", progress: 0 },
                    { icon: "🔥", title: "Week Streak", progress: hasProfile ? 30 : 0 }
                  ].map((achievement, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <p className="text-xs font-medium text-gray-600 mb-2">{achievement.title}</p>
                      <Progress value={achievement.progress} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">{achievement.progress}%</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg text-center transition-all ${
                      achievement.earned 
                        ? 'bg-yellow-50 border-2 border-yellow-200' 
                        : 'bg-gray-50 border-2 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <p className="text-sm font-medium text-gray-800">{achievement.title}</p>
                    {achievement.earned && (
                      <Badge variant="default" className="mt-2 bg-yellow-500">
                        Earned!
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Goals */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-gray-800">Learning Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!hasProfile ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Set your goals</h3>
                <p className="text-gray-500 mb-4">Complete your profile to set personalized learning goals!</p>
                <Button onClick={() => navigate('/dashboard?tab=profile')} className="bg-purple-600 hover:bg-purple-700">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { title: "Complete 5 lessons this week", progress: 60, current: 3, total: 5 },
                  { title: "Practice speaking daily", progress: 85, current: 6, total: 7 },
                  { title: "Submit all homework on time", progress: 100, current: 2, total: 2 }
                ].map((goal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{goal.title}</h4>
                      <Badge variant={goal.progress === 100 ? "default" : "secondary"}>
                        {goal.current}/{goal.total}
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="mb-2" />
                    <p className="text-xs text-gray-600">{goal.progress}% complete</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span className="text-gray-800">Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              onClick={handleBookClass}
            >
              <Calendar className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Book Class</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 border-2 hover:border-green-300 hover:bg-green-50 transition-all group"
              onClick={() => openHomeworkSubmission("new")}
            >
              <FileText className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Submit Work</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 border-2 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              onClick={() => setShowMessageModal(true)}
            >
              <MessageCircle className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Message</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 border-2 hover:border-orange-300 hover:bg-orange-50 transition-all group"
              onClick={handleViewMaterials}
            >
              <FolderOpen className="h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Materials</span>
            </Button>
          </div>
          
          {/* Additional Quick Links */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-700 mb-3">Study Tools</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Video className="h-3 w-3 mr-1" />
                Practice Speaking
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                View Progress
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Study Groups
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <ArrowRight className="h-3 w-3 mr-1" />
                All Features
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
