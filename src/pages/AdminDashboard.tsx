import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { UserManagement } from '@/components/admin/UserManagement';
import { TeacherManagement } from '@/components/admin/TeacherManagement';
import { TeacherApplicationsManagement } from '@/components/admin/TeacherApplicationsManagement';
import { StudentManagement } from '@/components/admin/StudentManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { LibraryManager } from '@/components/admin/LibraryManager';
import { CurriculumBuilder } from '@/components/admin/CurriculumBuilder';
import { ScheduleManager } from '@/components/admin/ScheduleManager';
import { PaymentsPanel } from '@/components/admin/PaymentsPanel';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { AdminLessonEditor } from '@/components/admin/lesson-builder';
import { Loader2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'teacher-applications':
        return <TeacherApplicationsManagement />;
      case 'students':
        return <StudentManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'library':
        return <LibraryManager />;
      case 'curriculum':
        return <CurriculumBuilder />;
      case 'lesson-builder':
        return <AdminLessonEditor />;
      case 'schedule':
        return <ScheduleManager />;
      case 'payments':
        return <PaymentsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <AdminHeader />
        
        <main className="p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
