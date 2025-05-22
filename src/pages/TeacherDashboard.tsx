
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentHeader } from "@/components/StudentHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  BookOpen, 
  FileText, 
  Users, 
  Calendar, 
  PlusCircle,
  CheckCircle,
  Clock,
  LineChart
} from "lucide-react";

const TeacherDashboard = () => {
  const [teacherName, setTeacherName] = useState<string>("");
  const navigate = useNavigate();
  const { languageText } = useLanguage();
  
  useEffect(() => {
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("teacherName") || localStorage.getItem("studentName");
    
    if (!storedName) {
      navigate("/");
      return;
    }
    
    setTeacherName(storedName);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-white border-b py-4">
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">{languageText.teacherDashboard}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">{teacherName}</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              {languageText.logOut}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{languageText.overview}</TabsTrigger>
            <TabsTrigger value="lessons">{languageText.lessons}</TabsTrigger>
            <TabsTrigger value="students">{languageText.students}</TabsTrigger>
            <TabsTrigger value="schedule">{languageText.schedule}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Overview */}
              <StatsCard 
                title={languageText.upcomingClasses}
                value="4"
                icon={<Calendar className="h-5 w-5 text-primary" />}
              />
              <StatsCard 
                title={languageText.activeStudents}
                value="12"
                icon={<Users className="h-5 w-5 text-blue-500" />}
              />
              <StatsCard 
                title={languageText.lessonPlans}
                value="8"
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
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {languageText.createLessonPlan}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {languageText.scheduleClass}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LineChart className="mr-2 h-4 w-4" />
                    {languageText.viewProgress}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Upcoming Classes */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>{languageText.upcomingClasses}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ClassCard 
                      title="Beginner English"
                      time="Today, 10:00 AM"
                      students={5}
                      buttonText={languageText.startClass}
                      onButtonClick={() => navigate("/esl-classroom")}
                    />
                    
                    <ClassCard 
                      title="Intermediate Conversation"
                      time="Today, 2:00 PM"
                      students={3}
                      buttonText={languageText.startClass}
                      onButtonClick={() => navigate("/esl-classroom")}
                    />
                    
                    <ClassCard 
                      title="Vocabulary Practice"
                      time="Tomorrow, 11:00 AM"
                      students={4}
                      buttonText={languageText.viewDetails}
                      onButtonClick={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="lessons">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{languageText.lessonPlans}</CardTitle>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {languageText.createLessonPlan}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <LessonPlanItem
                      title="Animal Vocabulary"
                      subject={languageText.vocabulary}
                      grade={languageText.beginner}
                      lastModified="2025-05-20"
                    />
                    <LessonPlanItem
                      title="Daily Routines"
                      subject={languageText.conversation}
                      grade={languageText.intermediate}
                      lastModified="2025-05-18"
                    />
                    <LessonPlanItem
                      title="Past Tense Practice"
                      subject={languageText.grammar}
                      grade={languageText.intermediate}
                      lastModified="2025-05-15"
                    />
                    <LessonPlanItem
                      title="Reading Comprehension"
                      subject={languageText.reading}
                      grade={languageText.advanced}
                      lastModified="2025-05-10"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{languageText.teachingMaterials}</CardTitle>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {languageText.uploadMaterial}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <MaterialItem
                      title="Animal Flashcards.pdf"
                      type="PDF"
                      size="2.4 MB"
                    />
                    <MaterialItem
                      title="Daily Routines Worksheet.pdf"
                      type="PDF"
                      size="1.8 MB"
                    />
                    <MaterialItem
                      title="Past Tense Exercise.docx"
                      type="DOCX"
                      size="1.2 MB"
                    />
                    <MaterialItem
                      title="Reading Story - The Lost Dog.pdf"
                      type="PDF"
                      size="3.1 MB"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="students">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{languageText.students}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {languageText.filter}
                  </Button>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {languageText.addStudent}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <StudentItem
                    name="Alex Johnson"
                    level={languageText.intermediate}
                    lastClass="2025-05-20"
                    progress={78}
                  />
                  <StudentItem
                    name="Maria Garcia"
                    level={languageText.beginner}
                    lastClass="2025-05-21"
                    progress={45}
                  />
                  <StudentItem
                    name="Li Wei"
                    level={languageText.advanced}
                    lastClass="2025-05-19"
                    progress={92}
                  />
                  <StudentItem
                    name="Sophia Ahmed"
                    level={languageText.intermediate}
                    lastClass="2025-05-21"
                    progress={65}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{languageText.schedule}</CardTitle>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {languageText.scheduleClass}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Weekly Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{languageText.thisWeek}</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                        <div key={day} className="border rounded-lg p-3">
                          <h4 className="font-medium mb-2">{day}</h4>
                          <div className="space-y-2">
                            <ScheduleItem time="10:00 AM" title="Beginner English" />
                            <ScheduleItem time="2:00 PM" title="Intermediate Conversation" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Upcoming Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{languageText.upcomingClasses}</h3>
                    <div className="space-y-3">
                      <ClassScheduleItem 
                        title="Beginner English"
                        day="Monday"
                        time="10:00 - 11:00 AM"
                        students={5}
                      />
                      <ClassScheduleItem 
                        title="Intermediate Conversation"
                        day="Monday"
                        time="2:00 - 3:00 PM"
                        students={3}
                      />
                      <ClassScheduleItem 
                        title="Vocabulary Practice"
                        day="Tuesday"
                        time="11:00 AM - 12:00 PM"
                        students={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, icon }: StatsCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
}

const ActivityItem = ({ icon, title, time }: ActivityItemProps) => (
  <div className="flex items-center justify-between pb-2 border-b">
    <div className="flex items-center gap-3">
      <div className="p-1 rounded-full">
        {icon}
      </div>
      <p className="font-medium">{title}</p>
    </div>
    <p className="text-sm text-muted-foreground">{time}</p>
  </div>
);

interface ClassCardProps {
  title: string;
  time: string;
  students: number;
  buttonText: string;
  onButtonClick: () => void;
}

const ClassCard = ({ title, time, students, buttonText, onButtonClick }: ClassCardProps) => (
  <Card className="overflow-hidden">
    <div className="bg-primary/10 p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{students} students</p>
        </div>
      </div>
      <Button className="w-full" size="sm" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

interface LessonPlanItemProps {
  title: string;
  subject: string;
  grade: string;
  lastModified: string;
}

const LessonPlanItem = ({ title, subject, grade, lastModified }: LessonPlanItemProps) => (
  <div className="flex items-center justify-between py-3 border-b">
    <div>
      <h3 className="font-medium">{title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{subject}</span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{grade}</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <p className="text-sm text-muted-foreground">Modified: {lastModified}</p>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

interface MaterialItemProps {
  title: string;
  type: string;
  size: string;
}

const MaterialItem = ({ title, type, size }: MaterialItemProps) => (
  <div className="flex items-center justify-between py-3 border-b">
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 p-2 rounded">
        <FileText className="h-4 w-4 text-blue-700" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{type} • {size}</p>
      </div>
    </div>
    <div className="flex gap-1">
      <Button variant="ghost" size="icon">
        <BookOpen className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

interface StudentItemProps {
  name: string;
  level: string;
  lastClass: string;
  progress: number;
}

const StudentItem = ({ name, level, lastClass, progress }: StudentItemProps) => (
  <div className="flex items-center justify-between py-3 border-b">
    <div>
      <h3 className="font-medium">{name}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{level}</span>
        <span className="text-xs text-muted-foreground">Last class: {lastClass}</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{progress}%</span>
        <div className="w-24 h-2 bg-muted rounded">
          <div className="h-full bg-primary rounded" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <Button variant="outline" size="sm">View Details</Button>
    </div>
  </div>
);

interface ScheduleItemProps {
  time: string;
  title: string;
}

const ScheduleItem = ({ time, title }: ScheduleItemProps) => (
  <div className="text-xs p-1.5 bg-primary/10 rounded">
    <p className="font-medium">{time}</p>
    <p className="truncate">{title}</p>
  </div>
);

interface ClassScheduleItemProps {
  title: string;
  day: string;
  time: string;
  students: number;
}

const ClassScheduleItem = ({ title, day, time, students }: ClassScheduleItemProps) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{day}, {time}</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 text-sm">
        <Users className="h-4 w-4" />
        <span>{students}</span>
      </div>
      <Button size="sm">Start</Button>
    </div>
  </div>
);

export default TeacherDashboard;
