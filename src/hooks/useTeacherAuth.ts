
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useTeacherAuth = () => {
  const [teacherName, setTeacherName] = useState<string>("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication and user type
    const storedTeacherName = localStorage.getItem("teacherName");
    const userType = localStorage.getItem("userType");
    const studentName = localStorage.getItem("studentName");
    
    console.log("Teacher Dashboard - Auth check:", { storedTeacherName, userType, studentName });
    
    // If we have teacher credentials, use them regardless of userType
    if (storedTeacherName) {
      console.log("Found teacher credentials, allowing access");
      setTeacherName(storedTeacherName);
      return;
    }
    
    // If userType is explicitly teacher but no teacher name, set default
    if (userType === "teacher") {
      console.log("User type is teacher, setting default teacher name");
      setTeacherName("Teacher");
      return;
    }
    
    // If user type is student and no teacher credentials, redirect to student dashboard
    if (userType === "student" && !storedTeacherName) {
      console.log("Redirecting to student dashboard - user type is student");
      navigate("/dashboard");
      return;
    }
    
    // If no credentials at all, redirect to login
    if (!storedTeacherName && !userType) {
      console.log("No credentials found, redirecting to login");
      navigate("/login");
      return;
    }
    
    // Default fallback
    setTeacherName("Teacher");
  }, [navigate]);

  return { teacherName };
};
