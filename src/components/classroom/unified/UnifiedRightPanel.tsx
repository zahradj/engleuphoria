
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
      {/* Student Video Section */}
      <StudentVideoPanel
        studentName={studentName}
        currentUser={currentUser}
      />

      {/* Student Info Panel */}
      <StudentInfoTabs
        studentName={studentName}
        studentXP={studentXP}
        activeRightTab={activeRightTab}
        onTabChange={onTabChange}
        currentUser={currentUser}
      />
    </div>
  );
}
