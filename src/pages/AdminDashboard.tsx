
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { UserManagement } from '@/components/admin/UserManagement';
import { TeacherManagement } from '@/components/admin/TeacherManagement';
import { TeacherApplicationsManagement } from '@/components/admin/TeacherApplicationsManagement';
import { TeacherAssignments } from '@/components/admin/TeacherAssignments';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ContentModeration } from '@/components/admin/ContentModeration';
import { ReportsGeneration } from '@/components/admin/ReportsGeneration';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu, X, Loader2 } from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'teachers' | 'teacher-applications' | 'assignments' | 'analytics' | 'moderation' | 'reports';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  console.log('=== AdminDashboard Render ===');
  console.log('isAdmin:', isAdmin);
  console.log('isLoading:', isLoading);
  console.log('localStorage userType:', localStorage.getItem('userType'));
  console.log('localStorage adminName:', localStorage.getItem('adminName'));

  // Redirect if not admin (but only after loading is complete)
  React.useEffect(() => {
    console.log('AdminDashboard useEffect triggered');
    console.log('isLoading:', isLoading, 'isAdmin:', isAdmin);
    
    if (!isLoading && !isAdmin) {
      console.log('Not admin and loading complete, redirecting to home page');
      navigate('/');
    } else if (!isLoading && isAdmin) {
      console.log('Admin authenticated successfully');
    }
  }, [isAdmin, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
            <h1 className="text-xl font-bold text-gray-800">Loading Admin Panel...</h1>
            <p className="text-gray-600 mt-2">Verifying your admin permissions</p>
            <div className="mt-4 text-xs text-gray-500">
              <p>UserType: {localStorage.getItem('userType')}</p>
              <p>AdminName: {localStorage.getItem('adminName')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin (after loading is complete)
  if (!isAdmin) {
    console.log('Showing access denied');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have permission to access the admin panel.</p>
            <div className="mt-4 text-xs text-gray-500">
              <p>UserType: {localStorage.getItem('userType')}</p>
              <p>AdminName: {localStorage.getItem('adminName')}</p>
              <p>Please log in as an administrator to access this panel.</p>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-4"
              variant="outline"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('Rendering admin dashboard successfully');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as AdminTab);
    setIsMobileSidebarOpen(false); // Close mobile sidebar when tab changes
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
      case 'assignments':
        return <TeacherAssignments />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'moderation':
        return <ContentModeration />;
      case 'reports':
        return <ReportsGeneration />;
      default:
        return <AdminOverview />;
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
