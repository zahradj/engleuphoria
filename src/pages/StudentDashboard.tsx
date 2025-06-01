
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Trophy, BookOpen, Clock, Star, Users, MessageCircle, CreditCard, Download, Settings, PlayCircle, Upload, Award, TrendingUp, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudentHandlers } from "@/hooks/useStudentHandlers";
import { useToast } from "@/components/ui/use-toast";
import { StudyCalendar } from "@/components/StudyCalendar";
import { AchievementsBoard } from "@/components/gamification/AchievementsBoard";
import { ProgressTracker } from "@/components/ProgressTracker";

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const { languageText } = useLanguage();
  const navigate = useNavigate();
  const handlers = useStudentHandlers();
  const { toast } = useToast();

  useEffect(() => {
    const storedStudentName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    const userType = localStorage.getItem("userType");
    const teacherName = localStorage.getItem("teacherName");

    if (userType === "teacher" || teacherName) {
      navigate("/teacher-dashboard");
      return;
    }

    if (!storedStudentName && userType !== "student") {
      navigate("/login");
      return;
    }

    setStudentName(storedStudentName || "Student");
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("userType");
    localStorage.removeItem("points");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const mockUpcomingClasses = [
    { id: 1, title: "Conversation Practice", date: "Today", time: "2:00 PM", teacher: "Ms. Johnson" },
    { id: 2, title: "Grammar Workshop", date: "Tomorrow", time: "10:00 AM", teacher: "Mr. Smith" },
  ];

  const mockHomework = [
    { id: 1, title: "Essay: My Hobbies", dueDate: "2024-01-15", status: "pending" },
    { id: 2, title: "Vocabulary Quiz", dueDate: "2024-01-12", status: "completed" },
  ];

  const mockAchievements = [
    {
      id: "learning-first-lesson",
      name: "First Steps",
      description: "Complete your first lesson",
      icon: <BookOpen className="h-6 w-6" />,
      level: "bronze" as const,
      unlocked: true,
      pointsAwarded: 50,
    },
    {
      id: "streak-7-days", 
      name: "Week Warrior",
      description: "Study for 7 days in a row",
      icon: <Star className="h-6 w-6" />,
      level: "silver" as const,
      unlocked: false,
      progress: { current: 4, total: 7 },
      pointsAwarded: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-blue-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                  {studentName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {studentName}!</h1>
                <p className="text-gray-600">Intermediate Level • General English Course</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    📚 Active Learner
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    🔥 5 Day Streak
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-yellow-600">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-xl font-bold">{points}</span>
                </div>
                <p className="text-xs text-gray-500">Learning Points</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                {languageText.logout || "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-8 h-14 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 rounded-xl p-1 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="homework" className="flex items-center gap-1 text-sm">
              <FileText className="h-4 w-4" />
              Homework
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-1 text-sm">
              <Trophy className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1 text-sm">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-1 text-sm">
              <BookOpen className="h-4 w-4" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-1 text-sm">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handlers.handleJoinClass} className="h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Join Next Class
                    </Button>
                    <Button variant="outline" onClick={handlers.handlePracticeVocabulary} className="h-20 flex flex-col gap-2">
                      <BookOpen className="h-6 w-6" />
                      Practice Vocabulary
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Study Time</span>
                    <span className="font-bold">45 min</span>
                  </div>
                  <Progress value={75} />
                  <div className="text-xs text-gray-500">Goal: 60 minutes</div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingClasses.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{classItem.title}</h4>
                        <p className="text-sm text-gray-600">{classItem.date} at {classItem.time}</p>
                        <p className="text-xs text-gray-500">with {classItem.teacher}</p>
                      </div>
                      <Button size="sm">Join Class</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Preview */}
            <AchievementsBoard achievements={mockAchievements} />
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Classes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUpcomingClasses.map((classItem) => (
                    <div key={classItem.id} className="p-4 border rounded-lg">
                      <h4 className="font-semibold">{classItem.title}</h4>
                      <p className="text-sm text-gray-600">{classItem.date} at {classItem.time}</p>
                      <p className="text-xs text-gray-500 mb-3">Teacher: {classItem.teacher}</p>
                      <Button size="sm" className="w-full">Join Class</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium">Grammar Basics</h4>
                      <p className="text-sm text-gray-600">Yesterday, 2:00 PM</p>
                      <Badge variant="secondary" className="text-xs mt-1">Completed</Badge>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium">Pronunciation Practice</h4>
                      <p className="text-sm text-gray-600">Jan 8, 10:00 AM</p>
                      <Badge variant="secondary" className="text-xs mt-1">Completed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Homework Tab */}
          <TabsContent value="homework">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Assignments & Homework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHomework.map((hw) => (
                    <div key={hw.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{hw.title}</h4>
                        <p className="text-sm text-gray-600">Due: {hw.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={hw.status === 'completed' ? 'default' : 'destructive'}>
                          {hw.status}
                        </Badge>
                        {hw.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4 mr-1" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressTracker
                vocabProgress={75}
                grammarProgress={60}
                listeningProgress={80}
                speakingProgress={55}
                readingProgress={70}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-gold" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Basic English Certificate</h4>
                        <p className="text-sm text-gray-600">Completed: Dec 2023</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Message Your Teacher
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Hi! How are you doing with your homework?</p>
                      <p className="text-xs text-gray-500 mt-1">Ms. Johnson - 2 hours ago</p>
                    </div>
                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs ml-auto">
                      <p className="text-sm">I'm working on it! Should be done by tomorrow.</p>
                      <p className="text-xs text-blue-200 mt-1">You - 1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <Button>Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Learning Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <FileText className="h-8 w-8 text-red-500 mb-2" />
                    <h4 className="font-semibold">Grammar Guide PDF</h4>
                    <p className="text-sm text-gray-600 mb-3">Essential grammar rules</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <PlayCircle className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-semibold">Pronunciation Videos</h4>
                    <p className="text-sm text-gray-600 mb-3">Audio and video lessons</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-bold text-lg">Premium Plan</h3>
                      <p className="text-gray-600">$99/month</p>
                      <p className="text-sm text-gray-500">Unlimited classes & materials</p>
                    </div>
                    <Button className="w-full">Manage Subscription</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Premium Plan</p>
                        <p className="text-sm text-gray-600">Jan 1, 2024</p>
                      </div>
                      <span className="font-bold">$99.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input type="text" value={studentName} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" placeholder="student@example.com" className="w-full p-2 border rounded" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Class reminders
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Homework notifications
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Marketing emails
                    </label>
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
