import React from 'react';
import { KidsWorldMap, ThemeType } from '../kids/KidsWorldMap';
import { usePlaygroundLessons } from '@/hooks/usePlaygroundLessons';
import { Loader2 } from 'lucide-react';

interface PlaygroundDashboardProps {
  studentName?: string;
  theme?: ThemeType;
}

export const PlaygroundDashboard: React.FC<PlaygroundDashboardProps> = ({
  studentName = 'Explorer',
  theme = 'jungle',
}) => {
  const { lessons, loading, error, markLessonComplete, getTotalStars } = usePlaygroundLessons();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-400 to-emerald-600">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
          <p className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive" }}>
            Loading your adventure...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-red-400 to-red-600">
        <div className="text-center text-white p-8 bg-white/20 rounded-3xl backdrop-blur">
          <p className="text-4xl mb-4">😢</p>
          <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>
            Oops! Something went wrong
          </p>
          <p className="text-white/80">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-400 to-indigo-600">
        <div className="text-center text-white p-8 bg-white/20 rounded-3xl backdrop-blur">
          <p className="text-6xl mb-4">🎒</p>
          <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>
            No lessons yet!
          </p>
          <p className="text-white/80">Your adventure will start soon...</p>
        </div>
      </div>
    );
  }

  return (
    <KidsWorldMap
      studentName={studentName}
      totalStars={getTotalStars()}
      theme={theme}
      lessons={lessons}
      onLessonComplete={markLessonComplete}
    />
  );
};
