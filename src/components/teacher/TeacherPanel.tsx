
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { TeacherSidebar } from "./TeacherSidebar";
import { DashboardTab } from "./DashboardTab";
import { EnhancedCalendarTab } from "./EnhancedCalendarTab";
import { StudentsTab } from "./StudentsTab";
import { AssignmentsTab } from "./AssignmentsTab";
import { MessagesTab } from "./MessagesTab";
import { LibraryTab } from "./LibraryTab";

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
        return <DashboardTab teacherName={teacherName} teacherId={teacherId} />;
      case "calendar":
        return <EnhancedCalendarTab teacherId={teacherId} />;
      case "students":
        return <StudentsTab />;
      case "assignments":
        return <AssignmentsTab />;
      case "messages":
        return <MessagesTab />;
      case "reading-library":
        return <LibraryTab />;
      default:
        return <DashboardTab teacherName={teacherName} teacherId={teacherId} />;
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
