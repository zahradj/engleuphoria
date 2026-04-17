import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProfessionalHub } from "@/components/teacher/professional/ProfessionalHub";
import { TeacherDashboardShell } from "@/components/teacher/dashboard/TeacherDashboardShell";
import { useTeacherHubRole } from "@/hooks/useTeacherHubRole";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const teacherName = user?.user_metadata?.full_name || user?.email || "Teacher";
  const teacherId = user?.id || "";

  // Resolve hub assignment to pick the right dashboard experience
  const { isPlayground, loading: hubLoading } = useTeacherHubRole(teacherId);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role !== "teacher") {
      if (user.role === "student") {
        navigate("/playground");
      } else if (user.role === "admin") {
        navigate("/super-admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  if (!user || hubLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Playground specialists get the kid-themed dashboard;
  // Academy / Success / Combined teachers get the Professional Hub.
  if (isPlayground) {
    return <TeacherDashboardShell teacherName={teacherName} teacherId={teacherId} />;
  }

  return <ProfessionalHub teacherName={teacherName} teacherId={teacherId} />;
}

export default TeacherDashboard;
