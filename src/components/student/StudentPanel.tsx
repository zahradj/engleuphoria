
import React, { useState } from "react";
import { StudentSidebar } from "./StudentSidebar";
import { DashboardTab } from "./DashboardTab";
import { ProfileTab } from "./ProfileTab";
import { EnhancedUpcomingClassesTab } from "./EnhancedUpcomingClassesTab";
import { LessonHistoryTab } from "./LessonHistoryTab";
import { HomeworkTab } from "./HomeworkTab";
import { ProgressTrackerTab } from "./ProgressTrackerTab";
import { ChatTab } from "./ChatTab";
import { BillingTab } from "./BillingTab";
import { CertificatesTab } from "./CertificatesTab";
import { SettingsTab } from "./SettingsTab";
import { useToast } from "@/hooks/use-toast";

interface StudentPanelProps {
  studentId?: string;
  studentName?: string;
  points?: number;
}

export const StudentPanel = ({ 
  studentId = "student-456", 
  studentName = "Alex", 
  points = 150 
}: StudentPanelProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab studentName={studentName} points={points} />;
      case "profile":
        return <ProfileTab />;
      case "classes":
        return <EnhancedUpcomingClassesTab studentId={studentId} />;
      case "history":
        return <LessonHistoryTab />;
      case "homework":
        return <HomeworkTab />;
      case "progress":
        return <ProgressTrackerTab />;
      case "chat":
        return <ChatTab />;
      case "billing":
        return <BillingTab />;
      case "certificates":
        return <CertificatesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab studentName={studentName} points={points} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};
