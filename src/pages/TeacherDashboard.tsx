import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";
import { OverviewTab } from "@/components/teacher/dashboard/OverviewTab";
import { LessonsTab } from "@/components/teacher/dashboard/LessonsTab";
import { StudentsTab } from "@/components/teacher/dashboard/StudentsTab";
import { ScheduleTab } from "@/components/teacher/dashboard/ScheduleTab";

const TeacherDashboard = () => {
  const [teacherName, setTeacherName] = useState<string>("");
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const navigate = useNavigate();
  const { languageText } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check authentication and user type
    const storedTeacherName = localStorage.getItem("teacherName");
    const userType = localStorage.getItem("userType");
    const studentName = localStorage.getItem("studentName");
    
    console.log("Teacher Dashboard - Auth check:", { storedTeacherName, userType, studentName });
    
    // If user type is explicitly student, redirect to student dashboard
    if (userType === "student" && !storedTeacherName) {
      console.log("Redirecting to student dashboard - user type is student");
      navigate("/dashboard");
      return;
    }
    
    // If no teacher credentials and no teacher user type, redirect to login
    if (!storedTeacherName && userType !== "teacher") {
      console.log("No teacher credentials found, redirecting to login");
      navigate("/login");
      return;
    }
    
    // Set teacher data
    setTeacherName(storedTeacherName || "Teacher");
    
    // Load lesson plans from localStorage
    const savedPlans = localStorage.getItem("lessonPlans");
    if (savedPlans) {
      try {
        setLessonPlans(JSON.parse(savedPlans));
      } catch (error) {
        console.error("Error parsing lesson plans:", error);
        setLessonPlans([]);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem("teacherName");
    localStorage.removeItem("studentName");
    localStorage.removeItem("userType");
    localStorage.removeItem("points");
    navigate("/");
  };

  const handleCreateLessonPlan = () => {
    navigate("/lesson-plan-creator");
  };

  const handleManageStudents = () => {
    navigate("/student-management");
  };

  const handleStartClass = () => {
    navigate("/classroom-selector");
  };

  const handleScheduleClass = () => {
    navigate("/lesson-scheduler");
  };

  const handleViewProgress = () => {
    navigate("/student-management");
  };

  const handleUploadMaterial = () => {
    toast({
      title: "Upload Material",
      description: "File upload functionality will be available soon!",
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filter Students",
      description: "Filter functionality will be available soon!",
    });
  };

  const handleAddStudent = () => {
    toast({
      title: "Add Student",
      description: "Add student functionality will be available soon!",
    });
  };

  const handleViewLessonPlan = (planId: string) => {
    toast({
      title: "View Lesson Plan",
      description: `Viewing lesson plan: ${planId}`,
    });
  };

  const handleUseMaterial = (materialName: string) => {
    toast({
      title: "Use Material",
      description: `Using material: ${materialName}`,
    });
  };

  const handleViewStudentDetails = (studentName: string) => {
    toast({
      title: "View Student Details",
      description: `Viewing details for: ${studentName}`,
    });
  };

  const handleStartScheduledClass = (className: string) => {
    toast({
      title: "Starting Class",
      description: `Starting ${className}...`,
    });
    navigate("/classroom-selector");
  };

  const handleViewClassDetails = (className: string) => {
    toast({
      title: "Class Details",
      description: `Viewing details for: ${className}`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b py-4 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">{languageText.teacherDashboard}</h1>
            <span className="bg-purple-500 text-xs px-2 py-1 rounded-full ml-2">Teacher</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">👨‍🏫 {teacherName}</span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout} 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
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
            <OverviewTab
              onCreateLessonPlan={handleCreateLessonPlan}
              onScheduleClass={handleScheduleClass}
              onViewProgress={handleViewProgress}
              onStartScheduledClass={handleStartScheduledClass}
              onViewClassDetails={handleViewClassDetails}
            />
          </TabsContent>
          
          <TabsContent value="lessons">
            <LessonsTab
              lessonPlans={lessonPlans}
              onCreateLessonPlan={handleCreateLessonPlan}
              onUploadMaterial={handleUploadMaterial}
              onViewLessonPlan={handleViewLessonPlan}
              onUseMaterial={handleUseMaterial}
            />
          </TabsContent>
          
          <TabsContent value="students">
            <StudentsTab
              onFilter={handleFilter}
              onAddStudent={handleAddStudent}
              onViewStudentDetails={handleViewStudentDetails}
            />
          </TabsContent>
          
          <TabsContent value="schedule">
            <ScheduleTab
              onScheduleClass={handleScheduleClass}
              onStartScheduledClass={handleStartScheduledClass}
            />
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

export default TeacherDashboard;
