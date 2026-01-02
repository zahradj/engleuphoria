import React from 'react';
import { TeacherProfileCard } from './TeacherProfileCard';
import { TeacherLevelCard } from './TeacherLevelCard';
import { PerformanceCard } from './PerformanceCard';
import { DeviceCheckBanner } from './DeviceCheckBanner';
import { NextLessonCard } from './NextLessonCard';
import { MonthlyStatsCard } from './MonthlyStatsCard';
import { LessonsListCard } from './LessonsListCard';

interface NovakidDashboardProps {
  teacherId: string;
}

export const NovakidDashboard: React.FC<NovakidDashboardProps> = ({ teacherId }) => {
  // Mock data - in production would come from queries
  const performanceMetrics = [
    { label: 'Regular students', lastMonth: 12, thisMonth: 15 },
    { label: 'Conversion rate', lastMonth: 45, thisMonth: 52, unit: '%' },
    { label: 'Negative feedback', lastMonth: 2, thisMonth: 1 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - 1/3 */}
      <div className="lg:col-span-1 space-y-6">
        <TeacherProfileCard />
        <TeacherLevelCard
          currentLevel="Major"
          currentRate={3.00}
          nextLevel="Colonel"
          nextRate={4.00}
          progressPercent={65}
        />
        <PerformanceCard metrics={performanceMetrics} />
      </div>

      {/* Right Column - 2/3 */}
      <div className="lg:col-span-2 space-y-6">
        <DeviceCheckBanner />
        <NextLessonCard />
        <MonthlyStatsCard
          totalLessons={24}
          totalStudents={18}
          regularStudents={15}
          trialStudents={3}
        />
        <LessonsListCard />
      </div>
    </div>
  );
};
