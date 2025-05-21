
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentHeader } from "@/components/StudentHeader";
import { ClassCard, ClassInfo } from "@/components/ClassCard";
import { RewardItem } from "@/components/RewardItem";
import { ArrowRight, BookOpen, Edit, Video } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const navigate = useNavigate();
  const { languageText } = useLanguage();
  
  // Demo classes
  const classes: ClassInfo[] = [
    {
      id: "class-1",
      title: "Fun with Phonics",
      teacher: "Ms. Johnson",
      time: "Today, 2:00 PM",
      students: 12,
      color: "#9B87F5", // Purple
    },
    {
      id: "class-2",
      title: "Storytelling Hour",
      teacher: "Mr. Thomas",
      time: "Tomorrow, 10:00 AM",
      students: 8,
      color: "#14B8A6", // Teal
    },
    {
      id: "class-3",
      title: "Vocabulary Games",
      teacher: "Ms. Garcia",
      time: "Thursday, 3:30 PM",
      students: 15,
      color: "#F97316", // Orange
    },
  ];
  
  // Activities
  const activities = [
    {
      title: "Alphabet Songs",
      description: "Learn through music",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-purple-light text-purple-dark",
    },
    {
      title: "Animal Vocabulary",
      description: "Learn animal names",
      icon: <Video className="h-5 w-5" />,
      color: "bg-teal-light text-teal-dark",
    },
    {
      title: "Writing Practice",
      description: "Draw and write letters",
      icon: <Edit className="h-5 w-5" />,
      color: "bg-orange-light text-orange-dark",
    },
  ];
  
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
  
  const handleJoinClass = (classId: string) => {
    // In a real app, we'd fetch the class details
    navigate(`/classroom/${classId}`);
  };
  
  const handleStartActivity = (activityIndex: number) => {
    // For demo purposes, going to whiteboard for any activity
    navigate("/whiteboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome section */}
            <Card className="bg-gradient-to-r from-purple-light/70 to-teal-light/70 border-none">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {languageText.welcomeUser.replace('{}', studentName)}
                    </h2>
                    <p className="text-muted-foreground">
                      {languageText.readyToLearn}
                    </p>
                  </div>
                  
                  <Button className="gap-2" onClick={() => navigate("/classroom/class-1")}>
                    {languageText.joinNextClass} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming classes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{languageText.upcomingClasses}</h2>
                <Button variant="ghost" size="sm">
                  {languageText.viewAll}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classes.map((classInfo) => (
                  <ClassCard
                    key={classInfo.id}
                    classInfo={classInfo}
                    onJoin={handleJoinClass}
                  />
                ))}
              </div>
            </div>
            
            {/* Activities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{languageText.funActivities}</h2>
                <Button variant="ghost" size="sm">
                  {languageText.viewAll}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activities.map((activity, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className={`p-2 rounded-full ${activity.color} mr-3`}>
                        {activity.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-4">
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartActivity(index)}
                      >
                        {languageText.start}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{languageText.yourProgress}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{languageText.thisWeekActivities}</span>
                      <span className="text-sm font-medium">3/5</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full rounded-full bg-purple" style={{ width: "60%" }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{languageText.classesAttended}</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full rounded-full bg-teal" style={{ width: "40%" }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{languageText.pointsEarned}</span>
                      <span className="text-sm font-medium">{points}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full rounded-full bg-yellow" style={{ width: "50%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Rewards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{languageText.yourRewards}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <RewardItem
                  title="First Class"
                  description="Attended your first class"
                  points={10}
                  unlocked={true}
                />
                
                <RewardItem
                  title="Vocabulary Master"
                  description="Learned 20 new words"
                  points={25}
                  unlocked={true}
                />
                
                <RewardItem
                  title="Storyteller"
                  description="Completed 5 speaking activities"
                  points={50}
                  unlocked={false}
                />
              </CardContent>
            </Card>
            
            {/* Recent activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{languageText.recentActivity}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="bg-purple/20 p-1 rounded">
                    <Video className="text-purple h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{languageText.attendedClass}</p>
                    <p className="text-xs text-muted-foreground">Fun with Phonics</p>
                  </div>
                  <div className="text-xs text-muted-foreground">2h ago</div>
                </div>
                
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="bg-teal/20 p-1 rounded">
                    <BookOpen className="text-teal h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{languageText.completedActivity}</p>
                    <p className="text-xs text-muted-foreground">Animal Vocabulary</p>
                  </div>
                  <div className="text-xs text-muted-foreground">1d ago</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-yellow/20 p-1 rounded">
                    <ArrowRight className="text-yellow-dark h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{languageText.earnedBadge}</p>
                    <p className="text-xs text-muted-foreground">Vocabulary Master</p>
                  </div>
                  <div className="text-xs text-muted-foreground">2d ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

export default Dashboard;
