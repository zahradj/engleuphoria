
import { useState, useEffect } from "react";
import { TeacherDashboardHeader } from "@/components/teacher/dashboard/TeacherDashboardHeader";
import { TeacherDashboardContent } from "@/components/teacher/dashboard/TeacherDashboardContent";
import { TeacherDashboardFooter } from "@/components/teacher/dashboard/TeacherDashboardFooter";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { useTeacherHandlers } from "@/hooks/useTeacherHandlers";

const TeacherDashboard = () => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <TeacherDashboardHeader 
        teacherName={teacherName}
        onLogout={handlers.handleLogout}
      />
      
      <TeacherDashboardContent 
        lessonPlans={lessonPlans}
        handlers={handlers}
      />
      
      <TeacherDashboardFooter />
    </div>
  );
};

export default TeacherDashboard;
