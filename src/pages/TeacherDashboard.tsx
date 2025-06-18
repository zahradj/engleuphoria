
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

type TabType = 'dashboard' | 'ai-assistant' | 'calendar' | 'students' | 'reading-library' | 'history' | 'assignments' | 'resources' | 'messages' | 'earnings' | 'reports' | 'settings';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
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
        <TeacherSidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TeacherHeader teacherName={teacherName} />
          
          <main className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
