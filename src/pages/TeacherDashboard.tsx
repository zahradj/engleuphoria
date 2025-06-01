
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, BookOpen, Upload, DollarSign, Settings, MessageCircle, TrendingUp, Clock, Star, FileText, CheckCircle, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { useTeacherHandlers } from "@/hooks/useTeacherHandlers";
import { useToast } from "@/components/ui/use-toast";

const TeacherDashboard = () => {
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const { teacherName } = useTeacherAuth();
  const handlers = useTeacherHandlers();
  const { languageText } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    const savedPlans = localStorage.getItem("lessonPlans");
    if (savedPlans) {
      try {
        setLessonPlans(JSON.parse(savedPlans));
      } catch (error) {
        console.error("Error parsing lesson plans:", error);
        setLessonPlans([]);
      }
    }
  }, []);

  const mockStudents = [
    { id: 1, name: "Alice Johnson", level: "Intermediate", nextClass: "Today 2:00 PM", progress: 78 },
    { id: 2, name: "Bob Smith", level: "Beginner", nextClass: "Tomorrow 10:00 AM", progress: 45 },
    { id: 3, name: "Carol Davis", level: "Advanced", nextClass: "Jan 12 3:00 PM", progress: 92 },
  ];

  const mockEarnings = {
    thisMonth: 2850,
    sessionsCompleted: 38,
    hourlyRate: 75,
    nextPayout: "Jan 15, 2024"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-8 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-white/20 shadow-lg">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                  {teacherName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {teacherName}! 👋</h1>
                <p className="text-blue-100 text-lg mb-3">English Language Instructor</p>
                <div className="flex gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    🎓 Professional Teacher
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/30 text-white border-emerald-400/50">
                    ⭐ 4.9 Rating
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/30 text-white border-orange-400/50">
                    📅 Available Today
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">${mockEarnings.thisMonth}</div>
                <p className="text-blue-100 text-sm">This Month</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handlers.handleLogout}
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Logout
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
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4" />
              My Students
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-1 text-sm">
              <BookOpen className="h-4 w-4" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1 text-sm">
              <MessageCircle className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-1 text-sm">
              <DollarSign className="h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Students</p>
                      <p className="text-3xl font-bold">24</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Classes This Week</p>
                      <p className="text-3xl font-bold">18</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Avg. Rating</p>
                      <p className="text-3xl font-bold">4.9</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Hours Taught</p>
                      <p className="text-3xl font-bold">156</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handlers.handleStartClass} className="h-16 flex flex-col gap-1">
                      <Users className="h-5 w-5" />
                      Start Class
                    </Button>
                    <Button variant="outline" onClick={handlers.handleCreateLessonPlan} className="h-16 flex flex-col gap-1">
                      <BookOpen className="h-5 w-5" />
                      Create Lesson
                    </Button>
                    <Button variant="outline" onClick={handlers.handleScheduleClass} className="h-16 flex flex-col gap-1">
                      <Calendar className="h-5 w-5" />
                      Schedule Class
                    </Button>
                    <Button variant="outline" onClick={handlers.handleUploadMaterial} className="h-16 flex flex-col gap-1">
                      <Upload className="h-5 w-5" />
                      Upload Material
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Conversation Practice</h4>
                        <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
                        <p className="text-xs text-gray-500">with Alice Johnson</p>
                      </div>
                      <Button size="sm">Start Now</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Grammar Workshop</h4>
                        <p className="text-sm text-gray-600">4:00 PM - 5:00 PM</p>
                        <p className="text-xs text-gray-500">Group Class (5 students)</p>
                      </div>
                      <Button size="sm" variant="outline">Upcoming</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  My Students ({mockStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.level} Level</p>
                          <p className="text-xs text-gray-500">Next class: {student.nextClass}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Progress</p>
                          <p className="text-lg font-bold text-green-600">{student.progress}%</p>
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>This Week's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Monday - Today</h4>
                          <p className="text-sm text-gray-600">3 classes scheduled</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Tuesday</h4>
                          <p className="text-sm text-gray-600">2 classes scheduled</p>
                        </div>
                        <Badge variant="outline">Upcoming</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Working Hours</h4>
                      <p className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-sm text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                    </div>
                    <Button variant="outline" className="w-full">Edit Availability</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Teaching Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <FileText className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-semibold">Grammar Worksheets</h4>
                    <p className="text-sm text-gray-600 mb-3">12 files</p>
                    <Button size="sm" variant="outline" className="w-full">View Files</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="font-semibold">Lesson Plans</h4>
                    <p className="text-sm text-gray-600 mb-3">8 plans</p>
                    <Button size="sm" variant="outline" className="w-full">View Plans</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Upload className="h-8 w-8 text-purple-500 mb-2" />
                    <h4 className="font-semibold">Upload New</h4>
                    <p className="text-sm text-gray-600 mb-3">Add materials</p>
                    <Button size="sm" className="w-full">Upload</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Attendance & Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Today's Classes</h4>
                      <Badge variant="outline">2 of 3 completed</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Alice Johnson - Conversation Practice</span>
                        <Badge variant="default">Present</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">Bob Smith - Grammar Basics</span>
                        <Badge variant="destructive">Absent</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Student Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">Alice Johnson</h4>
                        <p className="text-sm text-gray-600">Hi! I have a question about today's homework...</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                      <Badge variant="default">New</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>BS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">Bob Smith</h4>
                        <p className="text-sm text-gray-600">Thank you for the grammar tips!</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Earnings Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-green-600">${mockEarnings.thisMonth}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Sessions</p>
                      <p className="text-2xl font-bold text-blue-600">{mockEarnings.sessionsCompleted}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-xl font-bold text-purple-600">${mockEarnings.hourlyRate}/hour</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payout Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Next Payout</p>
                      <p className="font-semibold">{mockEarnings.nextPayout}</p>
                      <p className="text-lg font-bold text-orange-600">$2,850.00</p>
                    </div>
                    <Button className="w-full">View Payment History</Button>
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
                      <input type="text" value={teacherName} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" placeholder="teacher@example.com" className="w-full p-2 border rounded" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Teaching Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Accept new students
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Enable calendar integration
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Auto-approve class requests
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

export default TeacherDashboard;
