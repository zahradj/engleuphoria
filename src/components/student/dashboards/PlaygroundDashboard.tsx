import React, { useState } from 'react';
import { KidsWorldMap, ThemeType } from '../kids/KidsWorldMap';
import { usePlaygroundLessons } from '@/hooks/usePlaygroundLessons';
import { Loader2 } from 'lucide-react';
import { PlaygroundSidebar } from '../kids/PlaygroundSidebar';
import { VirtualPetWidget } from '../kids/VirtualPetWidget';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { RecommendedTeachers } from '../RecommendedTeachers';
import { PlaygroundTopBar } from '../kids/PlaygroundTopBar';
import { EnterClassroomCTA } from '../kids/EnterClassroomCTA';

interface PlaygroundDashboardProps {
  studentName?: string;
  theme?: ThemeType;
  petType?: 'lion' | 'panda' | 'bunny';
  petHappiness?: number;
  wordsLearnedToday?: number;
  dailyStreak?: number;
}

export const PlaygroundDashboard: React.FC<PlaygroundDashboardProps> = ({
  studentName = 'Explorer',
  theme = 'jungle',
  petType = 'lion',
  petHappiness = 50,
  wordsLearnedToday = 2,
  dailyStreak = 0,
}) => {
  const { lessons, loading, error, markLessonComplete, getTotalStars } = usePlaygroundLessons();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-rose-100 to-pink-200">
        <div className="text-center text-purple-800">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-pink-500" />
          <p className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive" }}>
            Loading your adventure...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-rose-100 to-pink-200">
        <div className="text-center text-purple-800 p-8 bg-white/60 rounded-3xl backdrop-blur shadow-xl">
          <p className="text-4xl mb-4">😢</p>
          <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>
            Oops! Something went wrong
          </p>
          <p className="text-purple-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-rose-100 to-pink-200">
        <div className="text-center text-purple-800 p-8 bg-white/60 rounded-3xl backdrop-blur shadow-xl">
          <p className="text-6xl mb-4">🎒</p>
          <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>
            No lessons yet!
          </p>
          <p className="text-purple-600">Your adventure will start soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-100 p-4"
      style={{ fontFamily: "'Fredoka', cursive" }}
    >
      <div className="flex flex-col gap-4 h-[calc(100vh-2rem)]">
        {/* Top Bar: Stars + Streak */}
        <PlaygroundTopBar
          studentName={studentName}
          totalStars={getTotalStars()}
          dailyStreak={dailyStreak}
        />

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Sidebar */}
          <PlaygroundSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
            {/* Map Area */}
            <div className="flex-1 bg-white/40 rounded-3xl shadow-lg overflow-hidden">
              <KidsWorldMap
                studentName={studentName}
                totalStars={getTotalStars()}
                theme={theme}
                lessons={lessons}
                onLessonComplete={markLessonComplete}
              />
            </div>
            
            {/* Right Panel */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              {/* Bouncy CTA */}
              <EnterClassroomCTA />

              <VirtualPetWidget
                petType={petType}
                petHappiness={petHappiness}
                wordsLearnedToday={wordsLearnedToday}
                wordsGoal={5}
              />

              <WeeklyGoalWidget studentLevel="playground" />
              
              <AILessonAgent
                studentLevel="playground"
                studentInterests={['animals', 'games', 'cartoons']}
                cefrLevel="Pre-A1"
              />

              <RecommendedTeachers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
