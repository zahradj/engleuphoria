
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check user type and redirect to appropriate dashboard
    const userType = localStorage.getItem("userType");
    const teacherName = localStorage.getItem("teacherName");
    const studentName = localStorage.getItem("studentName");

    console.log("Dashboard Router - Auth check:", { userType, teacherName, studentName });

    if (userType === "teacher" || teacherName) {
      console.log("Redirecting to teacher dashboard");
      navigate("/teacher-dashboard", { replace: true });
    } else if (userType === "student" || studentName) {
      console.log("Redirecting to student dashboard");
      navigate("/student-dashboard", { replace: true });
    } else {
      console.log("No user type found, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
