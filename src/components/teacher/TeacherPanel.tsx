
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { TeacherSidebar } from "./TeacherSidebar";
import { DashboardTab } from "./DashboardTab";
import { EnhancedCalendarTab } from "./EnhancedCalendarTab";
import { StudentsTab } from "./StudentsTab";
import { LessonHistoryTab } from "./LessonHistoryTab";
import { AssignmentsTab } from "./AssignmentsTab";
import { ResourceLibraryTab } from "./ResourceLibraryTab";
import { MessagesTab } from "./MessagesTab";
import { EarningsTab } from "./EarningsTab";
import { ReportsTab } from "./ReportsTab";
import { SettingsTab } from "./SettingsTab";
import { AIAssistantTab } from "./AIAssistantTab";
import { ReadingLibraryTab } from "./ReadingLibraryTab";
import { BackendTab } from "./BackendTab";
import { EnhancedEnterpriseHub } from "../enterprise/enhanced/EnhancedEnterpriseHub";
import CurriculumArchitect from "./CurriculumArchitect";

interface TeacherPanelProps {
  teacherId?: string;
  teacherName?: string;
}

export const TeacherPanel = ({ 
  teacherId = "teacher-123", 
  teacherName = "Ms. Sarah" 
}: TeacherPanelProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { signOut } = useAuth();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab teacherName={teacherName} />;
      case "ai-generator":
        return <CurriculumArchitect />;
      case "ai-assistant":
        return <AIAssistantTab />;
      case "calendar":
        return <EnhancedCalendarTab teacherId={teacherId} />;
      case "students":
        return <StudentsTab />;
      case "reading-library":
        return <ReadingLibraryTab />;
      case "history":
        return <LessonHistoryTab />;
      case "assignments":
        return <AssignmentsTab />;
      case "resources":
        return <ResourceLibraryTab />;
      case "messages":
        return <MessagesTab />;
      case "earnings":
        return <EarningsTab />;
      case "reports":
        return <ReportsTab />;
      case "settings":
        return <SettingsTab teacherName={teacherName} />;
      case "backend":
        return <BackendTab />;
      case "enterprise":
        return <EnhancedEnterpriseHub />;
      default:
        return <DashboardTab teacherName={teacherName} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <TeacherSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={signOut}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};
