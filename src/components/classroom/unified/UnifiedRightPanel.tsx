
import React from "react";
import { StudentVideoPanel } from "./components/StudentVideoPanel";
import { StudentInfoTabs } from "./components/StudentInfoTabs";

interface UnifiedRightPanelProps {
  studentName: string;
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
}

export function UnifiedRightPanel({
  studentName,
  studentXP,
  activeRightTab,
  onTabChange,
  currentUser
}: UnifiedRightPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Student Video Section - Fixed height to match teacher video */}
      <div className="h-[300px]">
        <StudentVideoPanel
          studentName={studentName}
          currentUser={currentUser}
        />
      </div>

      {/* Student Info Panel - Takes remaining space */}
      <div className="flex-1">
        <StudentInfoTabs
          studentName={studentName}
          studentXP={studentXP}
          activeRightTab={activeRightTab}
          onTabChange={onTabChange}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
