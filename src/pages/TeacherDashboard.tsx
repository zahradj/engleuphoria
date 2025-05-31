
import { useState, useEffect } from "react";
import { TeacherDashboardHeader } from "@/components/teacher/dashboard/TeacherDashboardHeader";
import { TeacherDashboardSidebar } from "@/components/teacher/dashboard/TeacherDashboardSidebar";
import { TeacherMainContent } from "@/components/teacher/dashboard/TeacherMainContent";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { useTeacherHandlers } from "@/hooks/useTeacherHandlers";

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const { teacherName } = useTeacherAuth();
  const handlers = useTeacherHandlers();
  
  useEffect(() => {
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
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherDashboardHeader 
        teacherName={teacherName}
        onLogout={handlers.handleLogout}
      />
      
      <div className="flex">
        <TeacherDashboardSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <TeacherMainContent 
          activeSection={activeSection}
          lessonPlans={lessonPlans}
          handlers={handlers}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
