import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useTeacherHandlers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    navigate("/classroom?roomId=unified-classroom-1&role=teacher&name=Teacher&userId=teacher-1");
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
    console.log(`Starting class: ${className}`);
    toast({
      title: "Starting Class",
      description: `Starting ${className}...`,
    });
    // Navigate to classroom with teacher role
    navigate("/classroom?roomId=unified-classroom-1&role=teacher&name=Teacher&userId=teacher-1");
  };

  const handleViewClassDetails = (className: string) => {
    toast({
      title: "Class Details",
      description: `Viewing details for: ${className}`,
    });
  };

  const handleJoinClass = () => {
    navigate("/classroom?roomId=unified-classroom-1&role=teacher&name=Teacher&userId=teacher-1");
  };

  const handleCreateAssignment = () => {
    toast({
      title: "Create Assignment",
      description: "Assignment creation will be available soon!",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Send Message",
      description: "Message functionality will be available soon!",
    });
  };

  // New handlers for backend and AI integration
  const handleBackendSetup = () => {
    toast({
      title: "Backend Setup",
      description: "Opening backend integration panel...",
    });
  };

  const handleAIAssistant = () => {
    toast({
      title: "AI Assistant",
      description: "Opening enhanced AI assistant...",
    });
  };

  const handleDatabaseConfig = () => {
    toast({
      title: "Database Configuration",
      description: "Configure your database connection and schema.",
    });
  };

  const handleAPIIntegration = () => {
    toast({
      title: "API Integration",
      description: "Manage your third-party API connections.",
    });
  };

  return {
    handleLogout,
    handleCreateLessonPlan,
    handleManageStudents,
    handleStartClass,
    handleScheduleClass,
    handleViewProgress,
    handleUploadMaterial,
    handleFilter,
    handleAddStudent,
    handleViewLessonPlan,
    handleUseMaterial,
    handleViewStudentDetails,
    handleStartScheduledClass,
    handleViewClassDetails,
    handleJoinClass,
    handleCreateAssignment,
    handleSendMessage,
    // New handlers
    handleBackendSetup,
    handleAIAssistant,
    handleDatabaseConfig,
    handleAPIIntegration,
  };
};
