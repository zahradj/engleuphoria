
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  BookOpen, 
  Users, 
  Calendar,
  Target,
  Award,
  MessageCircle,
  TrendingUp,
  Clock,
  Star,
  Trophy,
  CheckCircle
} from 'lucide-react';

// Import the new KPI components
import { TeacherKPIOverview } from '@/components/teacher/kpi/TeacherKPIOverview';
import { LessonFeedbackTracker } from '@/components/teacher/kpi/LessonFeedbackTracker';
import { TeacherGamification } from '@/components/teacher/kpi/TeacherGamification';

// Import existing components
import { SmartMaterialBrowser } from '@/components/teacher/unified/SmartMaterialBrowser';
import { TodaysClassPanel } from '@/components/teacher/unified/TodaysClassPanel';
import { CurriculumUnitViewer } from '@/components/teacher/curriculum/CurriculumUnitViewer';
import { LessonPlanGenerator } from '@/components/teacher/curriculum/LessonPlanGenerator';
import { TeacherHeader } from '@/components/teacher/TeacherHeader';

export function UnifiedTeacherDashboard() {
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic'>('visual');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showLessonGenerator, setShowLessonGenerator] = useState(false);

  const handleMaterialSelect = (material: any) => {
    console.log('Selected material:', material);
  };

  const handleGenerateLesson = () => {
    setShowLessonGenerator(true);
  };

  // Mock data for today's metrics
  const todayMetrics = {
    scheduledLessons: 3,
    completedLessons: 1,
    pendingFeedback: 2,
    averageRating: 4.8
  };

  // Mock data for today's classes with number IDs to match ClassItem interface
  const mockClasses = [
    {
      id: 1,
      title: 'Beginner English - Level A1',
      time: '10:00 AM',
      student: 'John Doe',
      status: 'upcoming' as const,
      level: 'A1',
      topic: 'Basic Greetings',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      title: 'Intermediate Conversation',
      time: '2:00 PM', 
      student: 'Jane Smith',
      status: 'upcoming' as const,
      level: 'B1',
      topic: 'Daily Routines',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const handleStartClass = (classId: number, studentName: string) => {
    console.log('Starting class:', classId, 'with student:', studentName);
  };

  const handleViewStudent = (studentId: string) => {
    console.log('Viewing student:', studentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <TeacherHeader teacherName="Sarah Johnson" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar size={24} />
                </div>
                <div className="text-2xl font-bold">{todayMetrics.scheduledLessons}</div>
                <div className="text-sm opacity-90">Today's Lessons</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle size={24} />
                </div>
                <div className="text-2xl font-bold">{todayMetrics.completedLessons}</div>
                <div className="text-sm opacity-90">Completed</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle size={24} />
                </div>
                <div className="text-2xl font-bold text-yellow-300">{todayMetrics.pendingFeedback}</div>
                <div className="text-sm opacity-90">Pending Feedback</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star size={24} />
                </div>
                <div className="text-2xl font-bold">{todayMetrics.averageRating}</div>
                <div className="text-sm opacity-90">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="kpi" className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-14 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 rounded-xl p-1">
            <TabsTrigger 
              value="kpi" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Target className="h-4 w-4" />
              KPI Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger 
              value="materials" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Materials
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="kpi" className="animate-fade-in">
              <TeacherKPIOverview />
            </TabsContent>

            <TabsContent value="feedback" className="animate-fade-in">
              <LessonFeedbackTracker />
            </TabsContent>

            <TabsContent value="achievements" className="animate-fade-in">
              <TeacherGamification />
            </TabsContent>

            <TabsContent value="schedule" className="animate-fade-in">
              <TodaysClassPanel 
                classes={mockClasses}
                onStartClass={handleStartClass}
                onViewStudent={handleViewStudent}
              />
            </TabsContent>

            <TabsContent value="materials" className="animate-fade-in">
              <SmartMaterialBrowser
                selectedLevel={selectedLevel}
                selectedSkill={selectedSkill}
                selectedLearningStyle={selectedLearningStyle}
                onLevelChange={setSelectedLevel}
                onSkillChange={setSelectedSkill}
                onLearningStyleChange={setSelectedLearningStyle}
                onMaterialSelect={handleMaterialSelect}
              />
            </TabsContent>

            <TabsContent value="analytics" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="text-green-500" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                    <p className="text-gray-600">Detailed performance analytics coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Curriculum Unit Viewer Modal */}
        {selectedUnit && (
          <CurriculumUnitViewer
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onGenerateLesson={handleGenerateLesson}
          />
        )}

        {/* Lesson Plan Generator Modal */}
        {showLessonGenerator && (
          <LessonPlanGenerator
            unit={selectedUnit}
            onClose={() => setShowLessonGenerator(false)}
            level={selectedLevel as 'A1' | 'A2'}
          />
        )}
      </div>
    </div>
  );
}
