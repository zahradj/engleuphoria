import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CommandCenterSidebar } from './CommandCenterSidebar';
import { CommandCenterHeader } from './CommandCenterHeader';
import { ClassScheduler } from '@/components/teacher/scheduler';
import { LibraryManager } from '@/components/admin/LibraryManager';
import { StudentsPlaceholder } from './StudentsPlaceholder';

type TabType = 'schedule' | 'library' | 'students';

interface TeacherDashboardShellProps {
  teacherName: string;
  teacherId: string;
}

export const TeacherDashboardShell = ({
  teacherName,
  teacherId,
}: TeacherDashboardShellProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <ClassScheduler teacherName={teacherName} teacherId={teacherId} />;
      case 'library':
        return <LibraryManager />;
      case 'students':
        return <StudentsPlaceholder />;
      default:
        return <ClassScheduler teacherName={teacherName} teacherId={teacherId} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <CommandCenterSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        teacherName={teacherName}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <CommandCenterHeader teacherName={teacherName} activeTab={activeTab} />

        {/* Main Stage */}
        <main className="flex-1 p-6 bg-muted/30">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
