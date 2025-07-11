import React from 'react';
import { GamificationDashboard } from '@/components/gamification/GamificationDashboard';
import { MobileAwarePage } from '@/components/mobile/MobileAwarePage';
import { useAuth } from '@/hooks/useAuth';

export const GamificationPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <MobileAwarePage title="Rewards & Achievements" showBackButton>
      <GamificationDashboard studentId={user?.id} />
    </MobileAwarePage>
  );
};

export default GamificationPage;