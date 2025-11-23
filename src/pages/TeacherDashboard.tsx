
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { EnhancedTeacherSidebar } from "@/components/teacher/EnhancedTeacherSidebar";
import { CleanWorkspaceHeader } from "@/components/teacher/CleanWorkspaceHeader";
import { MobileTeacherNav } from "@/components/teacher/mobile/MobileTeacherNav";
import { TeacherDashboardContent } from "@/components/teacher/dashboard/TeacherDashboardContent";
import { EnhancedCalendarTab } from "@/components/teacher/EnhancedCalendarTab";
import { StudentsTab } from "@/components/teacher/StudentsTab";
import { AssignmentsTab } from "@/components/teacher/AssignmentsTab";
import { MessagesTab } from "@/components/teacher/MessagesTab";
import { EarningsTab } from "@/components/teacher/EarningsTab";
import { ReportsTab } from "@/components/teacher/ReportsTab";
import { SettingsTab } from "@/components/teacher/SettingsTab";
import { ProfileSetupTab } from "@/components/teacher/ProfileSetupTab";
import { ProfileCompleteGuard } from "@/components/teacher/ProfileCompleteGuard";
import { WithdrawalsTab } from "@/components/teacher/WithdrawalsTab";
import { QuickActions } from "@/components/navigation/QuickActions";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AssessmentsManagementTab } from "@/components/teacher/tabs/AssessmentsManagementTab";
import { LibraryTab } from "@/components/teacher/LibraryTab";

type TabType = 'dashboard' | 'profile' | 'assessments' | 'calendar' | 'students' | 'library' | 'reading-library' | 'english-journey' | 'history' | 'assignments' | 'messages' | 'earnings' | 'withdrawals' | 'reports' | 'settings';

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
          return <TeacherDashboardContent 
            lessonPlans={[]}
            teacherName={teacherName}
            teacherId={teacherId}
            handlers={{
              handleCreateLessonPlan: () => setActiveTab('calendar'),
              handleScheduleClass: () => setActiveTab('calendar'),
              handleViewProgress: () => setActiveTab('reports'),
              handleStartScheduledClass: (className: string) => {
                navigate(`/classroom?roomId=unified-classroom-1&role=teacher&name=${encodeURIComponent(teacherName)}&userId=${teacherId}`);
              },
              handleViewClassDetails: (className: string) => {
                setActiveTab('calendar');
              },
              handleUploadMaterial: () => setActiveTab('calendar'),
              handleViewLessonPlan: (planId: string) => setActiveTab('calendar'),
              handleUseMaterial: (materialName: string) => {
                window.open(`/classroom/teacher?material=${encodeURIComponent(materialName)}`, '_blank');
              },
              handleFilter: () => console.log('Filter students'),
              handleAddStudent: () => console.log('Add student'),
              handleViewStudentDetails: (studentName: string) => console.log('View student:', studentName)
            }}
          />;
        case 'profile':
          return <ProfileSetupTab teacherId={teacherId} />;
        case 'assessments':
          return <AssessmentsManagementTab />;
        case 'library':
          return <LibraryTab />;
        case 'calendar':
          return <EnhancedCalendarTab teacherId={teacherId} />;
        case 'students':
          return <StudentsTab />;
        case 'assignments':
          return <AssignmentsTab />;
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
          return <TeacherDashboardContent 
            lessonPlans={[]}
            teacherName={teacherName}
            teacherId={teacherId}
            handlers={{
              handleCreateLessonPlan: () => setActiveTab('calendar'),
              handleScheduleClass: () => setActiveTab('calendar'),
              handleViewProgress: () => setActiveTab('reports'),
              handleStartScheduledClass: (className: string) => {
                navigate(`/classroom?roomId=unified-classroom-1&role=teacher&name=${encodeURIComponent(teacherName)}&userId=${teacherId}`);
              },
              handleViewClassDetails: (className: string) => {
                setActiveTab('calendar');
              },
              handleUploadMaterial: () => setActiveTab('calendar'),
              handleViewLessonPlan: (planId: string) => setActiveTab('calendar'),
              handleUseMaterial: (materialName: string) => {
                window.open(`/classroom/teacher?material=${encodeURIComponent(materialName)}`, '_blank');
              },
              handleFilter: () => console.log('Filter students'),
              handleAddStudent: () => console.log('Add student'),
              handleViewStudentDetails: (studentName: string) => console.log('View student:', studentName)
            }}
          />;
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="md:hidden min-h-screen">
        <MobileTeacherNav 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onLogout={signOut}
          teacherName={teacherName}
        />
        <main className="p-4">
          {renderTabContent()}
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <SidebarProvider defaultOpen={false}>
          <div className="flex min-h-screen w-full">
            <EnhancedTeacherSidebar
              activeTab={activeTab} 
              setActiveTab={handleTabChange}
              onLogout={signOut}
            />
            
            <SidebarInset className="flex-1">
              <CleanWorkspaceHeader teacherName={teacherName} />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                  <QuickActions />
                  {renderTabContent()}
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default TeacherDashboard;
