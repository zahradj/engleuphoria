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
    navigate("/classroom?role=teacher&name=" + encodeURIComponent(teacherName) + "&userId=teacher-1");
  };

  const handleStartClass = (classId: number) => {
    toast({
      title: "Starting Class",
      description: `Starting class with ID: ${classId}`,
    });
    navigate("/classroom?role=teacher&name=" + encodeURIComponent(teacherName) + "&userId=teacher-1");
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

  // Enhanced class data with 10 euro lesson cost
  const todaysClasses = [
    {
      id: 1,
      title: "Beginner English - Group A",
      time: "9:00 AM",
      student: "Alex, Maria, Li",
      studentCount: 3,
      status: "ready" as const,
      earnings: 30 // 3 students × €10
    },
    {
      id: 2,
      title: "Intermediate Conversation",
      time: "2:00 PM", 
      student: "Emma Johnson",
      studentCount: 1,
      status: "ready" as const,
      earnings: 10 // 1 student × €10
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      time: "4:00 PM",
      student: "Carlos, Sophia",
      studentCount: 2,
      status: "upcoming" as const,
      earnings: 20 // 2 students × €10
    },
    {
      id: 4,
      title: "Advanced Writing Workshop",
      time: "6:00 PM",
      student: "David Kim",
      studentCount: 1,
      status: "live" as const,
      earnings: 10 // 1 student × €10
    }
  ];

  const pendingHomework = [
    {
      student: "Alex Johnson",
      assignment: "Past Tense Exercises",
      submitted: "2 hours ago",
      urgent: false
    },
    {
      student: "Maria Garcia", 
      assignment: "Vocabulary Practice",
      submitted: "1 day ago",
      urgent: true
    }
  ];

  const notifications = [
    {
      type: "message" as const,
      text: "New message from Emma Johnson",
      time: "5 min ago"
    },
    {
      type: "homework" as const,
      text: "3 homework submissions to grade",
      time: "1 hour ago"
    },
    {
      type: "schedule" as const,
      text: "Class rescheduled by Alex Johnson",
      time: "2 hours ago"
    }
  ];

  // Updated earnings data based on €10 per lesson
  const earningsData = {
    weeklyEarnings: 350, // 35 lessons this week × €10
    pendingPayment: 70,  // 7 completed lessons awaiting payment × €10
    totalBalance: 2100   // Total accumulated earnings
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
