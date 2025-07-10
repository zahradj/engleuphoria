import React, { useState } from "react";
import { useTeacherHandlers } from "@/hooks/useTeacherHandlers";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { WelcomeSection } from "./dashboard/WelcomeSection";
import { BalanceOverview } from "./dashboard/BalanceOverview";
import { UpcomingClassesCard } from "./dashboard/UpcomingClassesCard";
import { PendingHomeworkCard } from "./dashboard/PendingHomeworkCard";
import { NotificationsCard } from "./dashboard/NotificationsCard";
import { QuickActionsCard } from "./dashboard/QuickActionsCard";
import { AddStudentModal } from "./dashboard/AddStudentModal";

interface DashboardTabProps {
  teacherName: string;
}

export const DashboardTab = ({ teacherName }: DashboardTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const { 
    handleJoinClass, 
    handleScheduleClass, 
    handleCreateAssignment, 
    handleSendMessage, 
    handleManageStudents 
  } = useTeacherHandlers();

  const handleJoinClassroom = () => {
    navigate("/media-test?roomId=unified-classroom-1&role=teacher&name=" + encodeURIComponent(teacherName) + "&userId=teacher-1");
  };

  const handleStartClass = (classId: number) => {
    toast({
      title: "Starting Class",
      description: `Starting class with ID: ${classId}`,
    });
    navigate("/media-test?roomId=unified-classroom-1&role=teacher&name=" + encodeURIComponent(teacherName) + "&userId=teacher-1");
  };

  const handleAddStudent = () => {
    setIsAddStudentModalOpen(true);
  };

  const handleStudentAdded = (student: any) => {
    // In a real app, this would save to database
    console.log("New student added:", student);
  };

  const handleViewEarnings = () => {
    toast({
      title: "View Earnings",
      description: "Opening earnings overview...",
    });
  };

  // TODO: Replace with real data from API/database
  const todaysClasses: any[] = [];
  const pendingHomework: any[] = [];
  const notifications: any[] = [];
  
  // TODO: Connect to real earnings data
  const earningsData = {
    weeklyEarnings: 0,
    pendingPayment: 0,
    totalBalance: 0
  };

  return (
    <div className="space-y-6">
      <WelcomeSection 
        teacherName={teacherName}
        onJoinClassroom={handleJoinClassroom}
        weeklyEarnings={earningsData.weeklyEarnings}
      />

      <BalanceOverview
        weeklyEarnings={earningsData.weeklyEarnings}
        pendingPayment={earningsData.pendingPayment}
        totalBalance={earningsData.totalBalance}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClassesCard 
          classes={todaysClasses}
          onJoinClass={handleJoinClass}
          onStartClass={handleStartClass}
        />
        <PendingHomeworkCard homework={pendingHomework} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NotificationsCard notifications={notifications} />
        <QuickActionsCard 
          onScheduleClass={handleScheduleClass}
          onCreateAssignment={handleCreateAssignment}
          onSendMessage={handleSendMessage}
          onManageStudents={handleManageStudents}
          onAddStudent={handleAddStudent}
          onViewEarnings={handleViewEarnings}
        />
      </div>

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};
