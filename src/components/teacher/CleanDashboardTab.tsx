import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { lessonService } from '@/services/lessonService';
import { TeacherProfileCard } from './dashboard/TeacherProfileCard';
import { TeacherLevel } from './dashboard/TeacherLevel';
import { PerformanceTable } from './dashboard/PerformanceTable';
import { AssessmentWidget } from './dashboard/AssessmentWidget';
import { NextLessonCard } from './dashboard/NextLessonCard';
import { MonthlyStatistics } from './dashboard/MonthlyStatistics';
import { LessonsDetails } from './dashboard/LessonsDetails';
import { DeviceCheck } from './dashboard/DeviceCheck';

interface CleanDashboardTabProps {
  teacherName: string;
}

export const CleanDashboardTab = ({ teacherName }: CleanDashboardTabProps) => {
  const { user } = useAuth();
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const lessons = await lessonService.getTeacherUpcomingLessons(user.id);
        setUpcomingLessons(lessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [user?.id]);

  const nextLesson = upcomingLessons[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar - Profile & Metrics */}
      <div className="lg:col-span-4 space-y-4">
        <TeacherProfileCard />
        <TeacherLevel />
        <PerformanceTable />
        <AssessmentWidget />
      </div>

      {/* Right Content Area */}
      <div className="lg:col-span-8 space-y-4">
        <DeviceCheck />
        <NextLessonCard lesson={nextLesson} teacherName={teacherName} />
        <MonthlyStatistics />
        <LessonsDetails />
      </div>
    </div>
  );
};