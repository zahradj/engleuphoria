
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { StudentHeader } from "@/components/student/StudentHeader";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { DashboardTab } from "@/components/student/DashboardTab";
import { TeachersTab } from "@/components/student/TeachersTab";
import { UpcomingClassesTab } from "@/components/student/UpcomingClassesTab";
import { HomeworkTab } from "@/components/student/HomeworkTab";
import { MaterialsLibraryTab } from "@/components/student/MaterialsLibraryTab";
import { ProgressTrackerTab } from "@/components/student/ProgressTrackerTab";
import { SpeakingPracticeTab } from "@/components/student/speaking/SpeakingPracticeTab";
import { EnhancedBillingTab } from "@/components/student/EnhancedBillingTab";
import { ProfileTab } from "@/components/student/ProfileTab";
import { SettingsTab } from "@/components/student/SettingsTab";
import { LearningPathTab } from "@/components/student/LearningPathTab";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasProfile, setHasProfile] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Generate or get student ID and name
  const generateStudentId = () => {
    const existingId = localStorage.getItem('studentId');
    if (existingId) return existingId;
    const newId = 'STU' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('studentId', newId);
    return newId;
  };
  
  const studentName = localStorage.getItem('studentName') || 'Student';
  const studentId = generateStudentId();

  useEffect(() => {
    // Check if student has completed their profile
    const profile = localStorage.getItem('studentProfile');
    if (profile) {
      setStudentProfile(JSON.parse(profile));
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentName');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentProfile');
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate("/");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab studentName={studentName} studentId={studentId} hasProfile={hasProfile} studentProfile={studentProfile} />;
      case "learning-path":
        return <LearningPathTab />;
      case "teachers":
        return <TeachersTab />;
      case "upcoming-classes":
        return <UpcomingClassesTab />;
      case "homework":
        return <HomeworkTab />;
      case "materials":
        return <MaterialsLibraryTab />;
      case "progress":
        return <ProgressTrackerTab />;
      case "speaking":
        return <SpeakingPracticeTab />;
      case "billing":
        return <EnhancedBillingTab />;
      case "profile":
        return <ProfileTab studentName={studentName} />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab studentName={studentName} studentId={studentId} hasProfile={hasProfile} studentProfile={studentProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader studentName={studentName} studentId={studentId} hasProfile={hasProfile} studentProfile={studentProfile} />
      <div className="flex">
        <StudentSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          hasProfile={hasProfile}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-6 ml-64">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
