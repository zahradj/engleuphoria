
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { UserManagement } from '@/components/admin/UserManagement';
import { TeacherManagement } from '@/components/admin/TeacherManagement';
import { TeacherAssignments } from '@/components/admin/TeacherAssignments';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ContentModeration } from '@/components/admin/ContentModeration';
import { ReportsGeneration } from '@/components/admin/ReportsGeneration';
import { Card, CardContent } from '@/components/ui/card';

type AdminTab = 'overview' | 'users' | 'teachers' | 'assignments' | 'analytics' | 'moderation' | 'reports';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, permissions } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'teachers':
        return <TeacherManagement />;
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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        permissions={permissions}
      />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
