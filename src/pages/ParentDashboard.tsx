
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentHeader } from "@/components/StudentHeader";
import { ProgressTracker } from "@/components/ProgressTracker";
import { StudyCalendar, CalendarEvent } from "@/components/StudyCalendar";
import { HomeworkAssignment, Assignment } from "@/components/HomeworkAssignment";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Clock, Award, Bell, BookOpen } from "lucide-react";

const ParentDashboard = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [childName, setChildName] = useState<string>("Alex");
  const [points, setPoints] = useState<number>(0);
  const navigate = useNavigate();
  const { languageText } = useLanguage();
  
  // Demo events for calendar
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "event-1",
      title: "English Class",
      date: new Date(new Date().setHours(10, 0, 0, 0)),
      type: "class"
    },
    {
      id: "event-2",
      title: "Vocabulary Homework",
      date: new Date(new Date().setHours(14, 0, 0, 0)),
      type: "homework"
    },
    {
      id: "event-3",
      title: "Progress Assessment",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      type: "test"
    }
  ]);
  
  // Demo homework assignments
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "assignment-1",
      title: "Vocabulary Practice",
      description: "Complete the vocabulary list for Unit 3 on Animals and their habitats.",
      dueDate: "2025-05-25",
      points: 15,
      completed: true
    },
    {
      id: "assignment-2",
      title: "Grammar Exercise",
      description: "Complete the worksheet on Present Continuous tense.",
      dueDate: "2025-05-28",
      points: 20,
      completed: false
    }
  ]);
  
  useEffect(() => {
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    
    if (!storedName) {
      navigate("/");
      return;
    }
    
    setStudentName(storedName);
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
  }, [navigate]);
  
  const handleHomeworkComplete = (id: string, submission: string) => {
    // Mark the assignment as completed
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, completed: true } : assignment
    ));
    
    // Update points
    const assignmentPoints = assignments.find(a => a.id === id)?.points || 0;
    const newPoints = points + assignmentPoints;
    setPoints(newPoints);
    localStorage.setItem("points", newPoints.toString());
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">{languageText.parentDashboard}</h1>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{languageText.overview}</TabsTrigger>
            <TabsTrigger value="progress">{languageText.childProgress}</TabsTrigger>
            <TabsTrigger value="schedule">{languageText.schedule}</TabsTrigger>
            <TabsTrigger value="homework">{languageText.homework}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Welcome Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {languageText.welcomeParent.replace('{}', studentName)}
                        </h2>
                        <p className="text-muted-foreground">
                          {languageText.parentDashboardDesc.replace('{}', childName)}
                        </p>
                      </div>
                      
                      <Button className="gap-2">
                        <Bell className="h-4 w-4" />
                        {languageText.contactTeacher}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Child's Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>{languageText.recentActivity}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActivityItem
                      icon="calendar"
                      title={languageText.attendedClass}
                      description="Fun with Phonics"
                      time="2h ago"
                      color="purple"
                    />
                    
                    <ActivityItem
                      icon="book"
                      title={languageText.completedActivity}
                      description="Animal Vocabulary"
                      time="1d ago"
                      color="teal"
                    />
                    
                    <ActivityItem
                      icon="award"
                      title={languageText.earnedBadge}
                      description="Vocabulary Master"
                      time="2d ago"
                      color="yellow"
                    />
                  </CardContent>
                </Card>
                
                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>{languageText.upcomingEvents}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {events.slice(0, 3).map((event) => (
                        <div key={event.id} className="py-3 flex items-center gap-3">
                          <div className="bg-purple/20 p-2 rounded-full">
                            <Calendar className="h-5 w-5 text-purple" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                {/* Child's Learning Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>{languageText.learningSummary}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">{languageText.timeSpentLearning}</h3>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple" />
                          <span className="text-2xl font-bold">7.5</span>
                          <span className="text-muted-foreground">{languageText.hoursThisWeek}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">{languageText.pointsEarned}</h3>
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-yellow-dark" />
                          <span className="text-2xl font-bold">{points}</span>
                          <span className="text-muted-foreground">{languageText.totalPoints}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">{languageText.completedActivities}</h3>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-teal" />
                          <span className="text-2xl font-bold">12</span>
                          <span className="text-muted-foreground">{languageText.activities}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline" className="w-full">
                        {languageText.viewDetailedReport}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Vocabulary Progress */}
                <ProgressTracker
                  vocabProgress={65}
                  grammarProgress={45}
                  listeningProgress={80}
                  speakingProgress={50}
                  readingProgress={60}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgressTracker
                vocabProgress={65}
                grammarProgress={45}
                listeningProgress={80}
                speakingProgress={50}
                readingProgress={60}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>{languageText.teacherNotes}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <p className="italic text-muted-foreground mb-2">"{childName} {languageText.teacherComment1}"</p>
                      <p className="text-sm text-right">- Ms. Johnson, {languageText.englishTeacher}</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="italic text-muted-foreground mb-2">"{languageText.teacherComment2}"</p>
                      <p className="text-sm text-right">- Mr. Thomas, {languageText.conversationTeacher}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{languageText.learningRecommendations}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{languageText.practiceVocabulary}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {languageText.focusOnVocabulary}
                      </p>
                      <Button size="sm">{languageText.viewResources}</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{languageText.joinExtraClass}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {languageText.additionalPractice}
                      </p>
                      <Button size="sm">{languageText.exploreTimes}</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{languageText.useAudiobooks}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {languageText.improveListening}
                      </p>
                      <Button size="sm">{languageText.browseAudiobooks}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <StudyCalendar events={events} className="mb-6" />
            
            <Card>
              <CardHeader>
                <CardTitle>{languageText.upcomingClassSchedule}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Fun with Phonics</h3>
                      <p className="text-sm text-muted-foreground">Ms. Johnson • {languageText.recurring}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Mondays & Wednesdays</p>
                      <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Storytelling Hour</h3>
                      <p className="text-sm text-muted-foreground">Mr. Thomas • {languageText.recurring}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Tuesdays</p>
                      <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Vocabulary Games</h3>
                      <p className="text-sm text-muted-foreground">Ms. Garcia • {languageText.recurring}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Thursdays</p>
                      <p className="text-sm text-muted-foreground">3:30 PM - 4:30 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="homework">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => (
                <HomeworkAssignment
                  key={assignment.id}
                  assignment={assignment}
                  onComplete={handleHomeworkComplete}
                />
              ))}
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{languageText.homeworkHistory}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Animals and Colors</h3>
                      <p className="text-sm text-muted-foreground">{languageText.submitted}: May 15, 2025</p>
                    </div>
                    <div className="text-right flex items-center">
                      <span className="font-medium text-green-600">{languageText.scoreReceived}: 18/20</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Simple Present Tense</h3>
                      <p className="text-sm text-muted-foreground">{languageText.submitted}: May 10, 2025</p>
                    </div>
                    <div className="text-right flex items-center">
                      <span className="font-medium text-green-600">{languageText.scoreReceived}: 15/15</span>
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

interface ActivityItemProps {
  icon: "calendar" | "book" | "award";
  title: string;
  description: string;
  time: string;
  color: "purple" | "teal" | "yellow";
}

const ActivityItem = ({ icon, title, description, time, color }: ActivityItemProps) => {
  const renderIcon = () => {
    const iconClass = `text-${color}${color === "yellow" ? "-dark" : ""} h-4 w-4`;
    switch (icon) {
      case "calendar":
        return <Calendar className={iconClass} />;
      case "book":
        return <BookOpen className={iconClass} />;
      case "award":
        return <Award className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 pb-2 border-b">
      <div className={`bg-${color}/20 p-1 rounded`}>
        {renderIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
};

export default ParentDashboard;
