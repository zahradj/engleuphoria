import React from 'react';
import { KidsWorldMap, ThemeType } from '../kids/KidsWorldMap';

interface PlaygroundDashboardProps {
  studentName?: string;
  totalXp?: number;
  theme?: ThemeType;
  onLevelUp?: () => void;
}

export const PlaygroundDashboard: React.FC<PlaygroundDashboardProps> = ({
  studentName = 'Explorer',
  totalXp = 1234,
  theme = 'jungle',
  onLevelUp,
}) => {
  const handleLevelClick = (levelId: string) => {
    console.log('Level clicked:', levelId);
  };

  const handlePlayNext = () => {
    console.log('Play next lesson');
  };

  return (
    <KidsWorldMap
      studentName={studentName}
      totalStars={totalXp}
      theme={theme}
      onLevelClick={handleLevelClick}
      onPlayNext={handlePlayNext}
    />
  );
};
