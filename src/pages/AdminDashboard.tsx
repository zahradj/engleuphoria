
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';
import { UserManagement } from '@/components/admin/UserManagement';
import { TeacherApplicationsTable } from '@/components/admin/TeacherApplicationsTable';
import { ActiveTeachersTable } from '@/components/admin/ActiveTeachersTable';
import { StudentManagement } from '@/components/admin/StudentManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { LibraryManager } from '@/components/admin/LibraryManager';
import { PaymentsPanel } from '@/components/admin/PaymentsPanel';
import { SettingsPanel } from '@/components/admin/SettingsPanel';

import { SystematicLessonsLibrary } from '@/components/curriculum/SystematicLessonsLibrary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'teachers' | 'teacher-applications' | 'students' | 'analytics' | 'library' | 'curriculum' | 'payments' | 'settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading, permissions } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Redirect if not admin (after loading completes)
  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-bold">Loading...</h1>
            <p className="text-gray-600 mt-2">Verifying admin permissions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as AdminTab);
    setIsMobileSidebarOpen(false); // Close mobile sidebar when tab changes
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'users':
        return <UserManagement />;
      case 'teachers':
        return <ActiveTeachersTable />;
      case 'teacher-applications':
        return <TeacherApplicationsTable />;
      case 'students':
        return <StudentManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'library':
        return <LibraryManager />;
      case 'curriculum':
        return <SystematicLessonsLibrary />;
      case 'payments':
        return <PaymentsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <AdminOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <AdminSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
        </div>

        <div className="flex-1 flex flex-col w-full lg:w-auto">
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <AdminHeader />
          </div>

          <main className="flex-1 overflow-y-auto p-3 sm:p-6">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
