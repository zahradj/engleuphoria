
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { TeacherHeader } from "@/components/teacher/TeacherHeader";
import { DashboardTab } from "@/components/teacher/DashboardTab";
import { AIIntegrationTab } from "@/components/teacher/AIIntegrationTab";
import { EnhancedCalendarTab } from "@/components/teacher/EnhancedCalendarTab";
import { StudentsTab } from "@/components/teacher/StudentsTab";
import { LessonHistoryTab } from "@/components/teacher/LessonHistoryTab";
import { AssignmentsTab } from "@/components/teacher/AssignmentsTab";
import { ResourceLibraryTab } from "@/components/teacher/ResourceLibraryTab";
import { ReadingLibraryTab } from "@/components/teacher/ReadingLibraryTab";
import { MessagesTab } from "@/components/teacher/MessagesTab";
import { EarningsTab } from "@/components/teacher/EarningsTab";
import { ReportsTab } from "@/components/teacher/ReportsTab";
import { SettingsTab } from "@/components/teacher/SettingsTab";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

type TabType = 'dashboard' | 'ai-assistant' | 'calendar' | 'students' | 'reading-library' | 'history' | 'assignments' | 'resources' | 'messages' | 'earnings' | 'reports' | 'settings';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedTeacherName = localStorage.getItem("teacherName");
    const storedTeacherId = localStorage.getItem("teacherId") || "teacher-1";
    const userType = localStorage.getItem("userType");

    if (!storedTeacherName || userType !== "teacher") {
      navigate("/login");
      return;
    }

    setTeacherName(storedTeacherName);
    setTeacherId(storedTeacherId);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("userType");
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
        return <DashboardTab teacherName={teacherName} />;
      case 'ai-assistant':
        return <AIIntegrationTab />;
      case 'calendar':
        return <EnhancedCalendarTab teacherId={teacherId} />;
      case 'students':
        return <StudentsTab />;
      case 'reading-library':
        return <ReadingLibraryTab />;
      case 'history':
        return <LessonHistoryTab />;
      case 'assignments':
        return <AssignmentsTab />;
      case 'resources':
        return <ResourceLibraryTab />;
      case 'messages':
        return <MessagesTab />;
      case 'earnings':
        return <EarningsTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab teacherName={teacherName} />;
      default:
        return <DashboardTab teacherName={teacherName} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-indigo-50 to-white">
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
          <TeacherSidebar 
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
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {teacherName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-bold text-sm bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                  Engleuphoria
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <TeacherHeader teacherName={teacherName} />
          </div>
          
          <main className="flex-1 overflow-y-auto p-3 sm:p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
