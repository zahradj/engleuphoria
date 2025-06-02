import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentHeader } from "@/components/student/StudentHeader";
import { DashboardTab } from "@/components/student/DashboardTab";
import { ProfileTab } from "@/components/student/ProfileTab";
import { UpcomingClassesTab } from "@/components/student/UpcomingClassesTab";
import { LessonHistoryTab } from "@/components/student/LessonHistoryTab";
import { HomeworkTab } from "@/components/student/HomeworkTab";
import { ProgressTrackerTab } from "@/components/student/ProgressTrackerTab";
import { ChatTab } from "@/components/student/ChatTab";
import { MaterialsLibraryTab } from "@/components/student/MaterialsLibraryTab";
import { BillingTab } from "@/components/student/BillingTab";
import { CertificatesTab } from "@/components/student/CertificatesTab";
import { SettingsTab } from "@/components/student/SettingsTab";

type TabType = 'dashboard' | 'profile' | 'classes' | 'history' | 'homework' | 'progress' | 'chat' | 'materials' | 'billing' | 'certificates' | 'settings';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [studentName, setStudentName] = useState("");
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedStudentName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    const userType = localStorage.getItem("userType");

    if (!storedStudentName || userType !== "student") {
      navigate("/login");
      return;
    }

    setStudentName(storedStudentName);
    setPoints(storedPoints ? parseInt(storedPoints) : 50);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("userType");
    localStorage.removeItem("points");
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate("/");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab studentName={studentName} points={points} />;
      case 'profile':
        return <ProfileTab studentName={studentName} />;
      case 'classes':
        return <UpcomingClassesTab />;
      case 'history':
        return <LessonHistoryTab />;
      case 'homework':
        return <HomeworkTab points={points} setPoints={setPoints} />;
      case 'progress':
        return <ProgressTrackerTab />;
      case 'chat':
        return <ChatTab />;
      case 'materials':
        return <MaterialsLibraryTab />;
      case 'billing':
        return <BillingTab />;
      case 'certificates':
        return <CertificatesTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab studentName={studentName} points={points} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <div className="flex h-screen">
        <StudentSidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader studentName={studentName} points={points} />
          
          <main className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
