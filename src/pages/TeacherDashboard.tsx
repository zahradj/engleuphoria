import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { TeacherDashboardShell } from "@/components/teacher/dashboard";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const teacherName = user?.user_metadata?.full_name || user?.email || "Teacher";
  const teacherId = user?.id || "";

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <TeacherDashboardShell teacherName={teacherName} teacherId={teacherId} />;
}

export default TeacherDashboard;
