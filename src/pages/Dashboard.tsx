
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudentHeader } from "@/components/StudentHeader";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ClassesSection } from "@/components/dashboard/ClassesSection";
import { ActivitiesSection } from "@/components/dashboard/ActivitiesSection";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { RewardsSection } from "@/components/dashboard/RewardsSection";
import { RecentActivitySection } from "@/components/dashboard/RecentActivitySection";
import { Footer } from "@/components/dashboard/Footer";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";

const Dashboard = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const navigate = useNavigate();
  
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
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <WelcomeSection studentName={studentName} />
            
            {/* Quick Access to Classroom */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Join a Classroom
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ready to start learning? Choose your classroom type and begin your English journey.
                </p>
                <Button 
                  onClick={() => navigate("/classroom-selector")}
                  className="w-full"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Enter Classroom
                </Button>
              </CardContent>
            </Card>
            
            <ClassesSection />
            <ActivitiesSection />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <ProgressTracker
              vocabProgress={65}
              grammarProgress={40}
              listeningProgress={80}
              speakingProgress={30}
              readingProgress={55}
            />
            <ProgressSummary 
              weeklyActivities={{completed: 3, total: 5}}
              classesAttended={8}
              points={points}
            />
            <RewardsSection />
            <RecentActivitySection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
