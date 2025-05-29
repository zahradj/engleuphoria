
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
  }, [navigate]);

  return { teacherName };
};
