
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Trophy, 
  Calendar,
  Target,
  Star,
  Play,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentHandlers } from "@/hooks/useStudentHandlers";

interface DashboardTabProps {
  studentName: string;
  points: number;
}

export const DashboardTab = ({ studentName, points }: DashboardTabProps) => {
  const navigate = useNavigate();
  const { 
    handleScheduleLesson,
    handleViewProgress,
    handlePracticeVocabulary,
    handleViewHomework
  } = useStudentHandlers();

  const handleJoinClass = () => {
    // Navigate to unified classroom as student
    navigate('/classroom?role=student&name=' + encodeURIComponent(studentName));
  };

  // Mock data for dashboard
  const nextClass = {
    subject: "English Conversation",
    time: "Today at 2:00 PM",
    teacher: "Ms. Johnson"
  };

  const weeklyGoal = {
    current: 4,
    target: 7,
    percentage: (4/7) * 100
  };

  const recentAchievements = [
    { title: "Vocabulary Master", icon: "🏆", date: "Yesterday" },
    { title: "Perfect Attendance", icon: "⭐", date: "Last week" },
    { title: "Grammar Expert", icon: "📚", date: "2 days ago" }
  ];

  const todaysActivities = [
    { title: "Practice Pronunciation", time: "15 min", completed: false },
    { title: "Review Vocabulary", time: "10 min", completed: true },
    { title: "Complete Homework", time: "20 min", completed: false }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {studentName}! 👋
        </h1>
        <p className="text-gray-600">Ready to continue your learning journey?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Join Live Classroom</h3>
                <p className="text-blue-600 text-sm">Connect with your teacher now</p>
              </div>
              <Button 
                onClick={handleJoinClass}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Join Class
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-800 mb-1">Practice Session</h3>
                <p className="text-purple-600 text-sm">Continue your exercises</p>
              </div>
              <Button 
                onClick={handlePracticeVocabulary}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Target className="mr-2 h-4 w-4" />
                Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Class */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{nextClass.subject}</p>
                <p className="text-sm text-muted-foreground">{nextClass.time}</p>
                <p className="text-sm text-muted-foreground">with {nextClass.teacher}</p>
              </div>
              <Button size="sm" className="w-full" onClick={handleScheduleLesson}>
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Points & Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{points}</span>
                <Badge variant="secondary">Points</Badge>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Weekly Goal</span>
                  <span>{weeklyGoal.current}/{weeklyGoal.target} classes</span>
                </div>
                <Progress value={weeklyGoal.percentage} className="h-2" />
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={handleViewProgress}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Today's Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    activity.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {activity.completed && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${activity.completed ? 'line-through text-gray-500' : ''}`}>
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {!activity.completed && (
                  <Button size="sm" variant="outline">
                    Start
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
