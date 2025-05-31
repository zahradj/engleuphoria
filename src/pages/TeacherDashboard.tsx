
import { useState, useEffect } from "react";
import { TeacherDashboardHeader } from "@/components/teacher/dashboard/TeacherDashboardHeader";
import { TeacherDashboardContent } from "@/components/teacher/dashboard/TeacherDashboardContent";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <TeacherDashboardHeader 
        teacherName={teacherName}
        onLogout={handlers.handleLogout}
      />
      
      <div className="relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <TeacherDashboardContent 
            lessonPlans={lessonPlans}
            handlers={handlers}
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
