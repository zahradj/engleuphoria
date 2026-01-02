import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type TabType = 'schedule' | 'library' | 'students';

interface CommandCenterHeaderProps {
  teacherName: string;
  activeTab: TabType;
}

const tabLabels: Record<TabType, string> = {
  schedule: 'Schedule',
  library: 'Library',
  students: 'Students',
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const CommandCenterHeader = ({
  teacherName,
  activeTab,
}: CommandCenterHeaderProps) => {
  const navigate = useNavigate();
  const firstName = teacherName.split(' ')[0];

  return (
    <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left: Greeting & Breadcrumb */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {getGreeting()}, {firstName}
        </h2>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{tabLabels[activeTab]}</span>
        </div>
      </div>

      {/* Right: Next Class Card */}
      <Card className="flex items-center gap-4 px-5 py-3 border-2 border-primary/20 bg-primary/5">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Next Class: English 101</p>
          <p className="text-xs text-muted-foreground">Starts in 15 mins</p>
        </div>
        <Button
          onClick={() => navigate('/classroom/session-1')}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg animate-pulse"
        >
          <Video className="w-4 h-4 mr-2" />
          Enter Classroom
        </Button>
      </Card>
    </header>
  );
};
