
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
import { SpeakingPracticeTab } from "@/components/student/speaking/SpeakingPracticeTab";
import { ProgressTrackerTab } from "@/components/student/ProgressTrackerTab";
import { ChatTab } from "@/components/student/ChatTab";
import { BillingTab } from "@/components/student/BillingTab";
import { CertificatesTab } from "@/components/student/CertificatesTab";
import { SettingsTab } from "@/components/student/SettingsTab";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

type TabType = 'dashboard' | 'profile' | 'classes' | 'history' | 'homework' | 'speaking-practice' | 'progress' | 'chat' | 'billing' | 'certificates' | 'settings';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [studentName, setStudentName] = useState("");
  const [points, setPoints] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
    setIsMobileSidebarOpen(false); // Close mobile sidebar when tab changes
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
      case 'speaking-practice':
        return <SpeakingPracticeTab />;
      case 'progress':
        return <ProgressTrackerTab />;
      case 'chat':
        return <ChatTab />;
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
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile by default, shown as overlay when open */}
        <div className={`${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative z-50 transition-transform duration-300 ease-in-out lg:z-auto`}>
          <StudentSidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange}
            onLogout={handleLogout}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2"
            >
              {isMobileSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {studentName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-bold text-sm bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Engleuphoria
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <StudentHeader studentName={studentName} points={points} />
          </div>
          
          <main className="flex-1 overflow-y-auto p-3 sm:p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
