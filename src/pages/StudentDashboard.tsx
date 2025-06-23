
import { useState, useEffect } from "react";
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
  const [points, setPoints] = useState(150);
  const [hasProfile, setHasProfile] = useState(false);
  
  // Get student name from localStorage or use default
  const studentName = localStorage.getItem('studentName') || 'Student';

  useEffect(() => {
    // Check if student has completed their profile
    const profile = localStorage.getItem('studentProfile');
    setHasProfile(!!profile);
    
    // If they have a profile, show learning path by default
    if (profile && activeTab === "dashboard") {
      setActiveTab("learning-path");
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab studentName={studentName} points={points} />;
      case "learning-path":
        return <LearningPathTab />;
      case "teachers":
        return <TeachersTab />;
      case "upcoming-classes":
        return <UpcomingClassesTab />;
      case "homework":
        return <HomeworkTab points={points} setPoints={setPoints} />;
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
        return <DashboardTab studentName={studentName} points={points} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader studentName={studentName} points={points} />
      <div className="flex">
        <StudentSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          hasProfile={hasProfile}
        />
        <main className="flex-1 p-6 ml-64">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
