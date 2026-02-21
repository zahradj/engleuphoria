import React, { useState } from 'react';
import { useTeacherStatus } from '@/hooks/useTeacherStatus';
import { TeacherTopNav } from './TeacherTopNav';
import { NovakidDashboard } from './NovakidDashboard';
import { ProfileOnboardingModal } from './ProfileOnboardingModal';
import { PendingReviewBanner } from './PendingReviewBanner';
import { ClassScheduler } from '@/components/teacher/scheduler';
import { ProfileSetupTab } from '@/components/teacher/ProfileSetupTab';
import { StudentsPlaceholder } from './StudentsPlaceholder';
import { TeacherGuideTab } from './TeacherGuideTab';
import { ScrollHeader } from '@/components/navigation/ScrollHeader';
import { Loader2 } from 'lucide-react';

type TabType = 'dashboard' | 'schedule' | 'methodology' | 'account' | 'teacher-hub' | 'help';

interface TeacherDashboardShellProps {
  teacherName: string;
  teacherId: string;
}

export const TeacherDashboardShell = ({
  teacherName,
  teacherId,
}: TeacherDashboardShellProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { status, loading, profile, refetch } = useTeacherStatus(teacherId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // If pending approval, show banner regardless of tab
    if (status === 'PENDING_APPROVAL') {
      return <PendingReviewBanner teacherName={teacherName} />;
    }

    // If approved, render content based on active tab
    if (status === 'APPROVED') {
      switch (activeTab) {
        case 'dashboard':
          return <NovakidDashboard teacherId={teacherId} />;
        case 'schedule':
          return <ClassScheduler teacherName={teacherName} teacherId={teacherId} />;
        case 'account':
          return <ProfileSetupTab teacherId={teacherId} />;
        case 'help':
          return <TeacherGuideTab />;
        case 'methodology':
        case 'teacher-hub':
          return <StudentsPlaceholder />;
        default:
          return <NovakidDashboard teacherId={teacherId} />;
      }
    }

    // For NEW status, the modal handles it
    return null;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Scroll Header with Logo */}
      <ScrollHeader />
      
      {/* Top Navigation */}
      <TeacherTopNav
        teacherName={teacherName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profileImageUrl={profile?.profile_image_url || undefined}
      />

      {/* Onboarding Modal - Blocks everything if NEW */}
      {status === 'NEW' && (
        <ProfileOnboardingModal
          teacherId={teacherId}
          teacherName={teacherName}
          onComplete={refetch}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};
