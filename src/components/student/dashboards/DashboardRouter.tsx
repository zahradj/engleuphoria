import React from 'react';
import { SystemId } from '@/types/multiTenant';
import { PlaygroundDashboard } from './PlaygroundDashboard';
import { AcademyDashboard } from './AcademyDashboard';
import { HubDashboard } from './HubDashboard';

interface DashboardRouterProps {
  systemId: SystemId;
  studentName?: string;
  totalXp?: number;
  onLevelUp?: () => void;
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({
  systemId,
  studentName,
  totalXp,
  onLevelUp,
}) => {
  switch (systemId) {
    case 'kids':
      return (
        <PlaygroundDashboard 
          studentName={studentName} 
        />
      );
    case 'teen':
      return (
        <AcademyDashboard 
          studentName={studentName} 
          totalXp={totalXp}
          onLevelUp={onLevelUp}
        />
      );
    case 'adult':
      return (
        <HubDashboard 
          studentName={studentName} 
          totalXp={totalXp}
        />
      );
    default:
      return (
        <PlaygroundDashboard 
          studentName={studentName} 
        />
      );
  }
};
