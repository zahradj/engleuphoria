
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { EnhancedTeacherSidebar } from "@/components/teacher/EnhancedTeacherSidebar";
import { CleanWorkspaceHeader } from "@/components/teacher/CleanWorkspaceHeader";
import { MobileTeacherNav } from "@/components/teacher/mobile/MobileTeacherNav";
import { DashboardTab } from "@/components/teacher/DashboardTab";
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
import { ProfileSetupTab } from "@/components/teacher/ProfileSetupTab";
import { ProfileCompleteGuard } from "@/components/teacher/ProfileCompleteGuard";
import { WithdrawalsTab } from "@/components/teacher/WithdrawalsTab";
import { QuickActions } from "@/components/navigation/QuickActions";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DailyRoutinesSlides } from "@/components/classroom/lesson-slides/DailyRoutinesSlides";

type TabType = 'dashboard' | 'profile' | 'calendar' | 'students' | 'reading-library' | 'history' | 'assignments' | 'resources' | 'messages' | 'earnings' | 'withdrawals' | 'reports' | 'settings' | 'slides';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use the authenticated user's information
  const teacherName = user?.user_metadata?.full_name || user?.email || "Teacher";
  const teacherId = user?.id || "";

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // If user is not a teacher, redirect to appropriate dashboard
    if (user.role !== "teacher") {
      if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  const renderTabContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'dashboard':
          return <DashboardTab teacherName={teacherName} />;
        case 'profile':
          return <ProfileSetupTab teacherId={teacherId} />;
        case 'slides':
          return <DailyRoutinesSlides />;
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
        case 'withdrawals':
          return <WithdrawalsTab />;
        case 'reports':
          return <ReportsTab />;
        case 'settings':
          return <SettingsTab teacherName={teacherName} />;
        default:
          return <DashboardTab teacherName={teacherName} />;
      }
    })();

    // Don't wrap profile tab in guard since it's the setup itself
    if (activeTab === 'profile') {
      return content;
    }

    // Wrap all other tabs in profile completion guard
    return (
      <ProfileCompleteGuard teacherId={teacherId}>
        {content}
      </ProfileCompleteGuard>
    );
  };

  // Show loading if user is still being fetched
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBFBFB' }}>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileTeacherNav 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onLogout={signOut}
          teacherName={teacherName}
        />
        <main className="p-4" style={{ backgroundColor: '#E8F9FF' }}>
          {renderTabContent()}
        </main>
      </div>

      {/* Desktop Layout with Clean Workspace Mode */}
      <div className="hidden md:block">
        <SidebarProvider defaultOpen={false}>
          <div className="flex min-h-screen w-full" style={{ backgroundColor: '#FBFBFB' }}>
            <EnhancedTeacherSidebar 
              activeTab={activeTab} 
              setActiveTab={handleTabChange}
              onLogout={signOut}
            />
            
            <SidebarInset className="flex-1">
              <CleanWorkspaceHeader teacherName={teacherName} />
              <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#E8F9FF' }}>
                <QuickActions />
                {renderTabContent()}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default TeacherDashboard;
