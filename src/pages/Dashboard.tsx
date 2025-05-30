
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, BookOpen, Clock, Star, Users, CalendarPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentHandlers } from "@/hooks/useStudentHandlers";

const Dashboard = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const { languageText } = useLanguage();
  const navigate = useNavigate();
  const handlers = useStudentHandlers();

  useEffect(() => {
    // Check authentication and redirect teachers to their dashboard
    const storedStudentName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    const userType = localStorage.getItem("userType");
    const teacherName = localStorage.getItem("teacherName");

    // If user is a teacher, redirect to teacher dashboard
    if (userType === "teacher" || teacherName) {
      navigate("/teacher-dashboard");
      return;
    }

    // If no student credentials, redirect to login
    if (!storedStudentName && userType !== "student") {
      navigate("/login");
      return;
    }

    setStudentName(storedStudentName || "Student");
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
  }, [navigate]);

  const quickActions = [
    {
      title: "Join Class",
      description: "Enter your virtual classroom",
      icon: Users,
      color: "bg-blue-500",
      onClick: handlers.handleJoinClass
    },
    {
      title: "Schedule Lesson",
      description: "Request a lesson with your teacher",
      icon: CalendarPlus,
      color: "bg-purple-500",
      onClick: handlers.handleScheduleLesson
    },
    {
      title: "Practice Vocabulary",
      description: "Learn new words and phrases",
      icon: BookOpen,
      color: "bg-green-500",
      onClick: handlers.handlePracticeVocabulary
    },
    {
      title: "View Progress",
      description: "Check your learning progress",
      icon: Trophy,
      color: "bg-orange-500",
      onClick: handlers.handleViewProgress
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Student-specific Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b py-6 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{studentName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {studentName}!</h1>
                <p className="text-purple-100">Ready to continue your learning journey?</p>
                <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                  Student Dashboard
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-yellow-300">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-xl font-bold">{points}</span>
                </div>
                <p className="text-xs text-purple-100">Learning Points</p>
              </div>
              <Button variant="outline" className="text-purple-600 border-white bg-white hover:bg-purple-50">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Student Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What would you like to do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.onClick}>
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Student Progress Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Lessons Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <Progress value={75} className="mb-2" />
                <p className="text-sm text-muted-foreground">75% of monthly goal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">8.5h</div>
                <Progress value={85} className="mb-2" />
                <p className="text-sm text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Badges earned</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Completed "Basic Conversation" lesson</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="secondary">+50 points</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Joined group study session</p>
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                  </div>
                  <Badge variant="secondary">+30 points</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Requested lesson with teacher</p>
                    <p className="text-sm text-muted-foreground">3 days ago</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
