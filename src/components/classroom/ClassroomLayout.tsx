import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileClassroomLayout } from "./mobile/MobileClassroomLayout";

interface ClassroomLayoutProps {
  children?: React.ReactNode;
  studentName?: string;
  points?: number;
  isTeacherView?: boolean;
  mainContent?: React.ReactElement;
  sidebarContent?: React.ReactElement;
}

export const ClassroomLayout = ({
  children,
  studentName,
  points,
  isTeacherView,
  mainContent,
  sidebarContent,
}: ClassroomLayoutProps) => {
  const isMobile = useIsMobile();

  // Mobile: collapse split layout into tabbed mobile shell
  if (isMobile && mainContent && sidebarContent) {
    return (
      <MobileClassroomLayout
        currentUser={{
          id: "current",
          name: studentName || "User",
          role: isTeacherView ? "teacher" : "student",
        }}
        videoContent={<div className="h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">Video</div>}
        chatContent={sidebarContent}
        whiteboardContent={mainContent}
        studentsContent={<div className="p-4 text-sm text-muted-foreground">Participants list</div>}
        classTime={0}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {mainContent && sidebarContent ? (
        <div className="flex h-screen">
          <div className="w-1/4 bg-white border-r border-gray-200">{sidebarContent}</div>
          <div className="flex-1">{mainContent}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
