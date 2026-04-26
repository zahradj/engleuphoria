import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileClassroomLayout } from "./mobile/MobileClassroomLayout";
import { ClassroomVideo } from "./ClassroomVideo";

interface ClassroomLayoutProps {
  children?: React.ReactNode;
  studentName?: string;
  points?: number;
  isTeacherView?: boolean;
  mainContent?: React.ReactElement;
  sidebarContent?: React.ReactElement;
  videoContent?: React.ReactElement;
  participantsContent?: React.ReactElement;
  classTime?: number;
  onLeave?: () => void;
}

export const ClassroomLayout = ({
  children,
  studentName,
  points,
  isTeacherView,
  mainContent,
  sidebarContent,
  videoContent,
  participantsContent,
  classTime = 0,
  onLeave,
}: ClassroomLayoutProps) => {
  const isMobile = useIsMobile();

  // Mobile: lesson-first layout with floating video bubble & chat sheet
  if (isMobile && mainContent && sidebarContent) {
    return (
      <MobileClassroomLayout
        currentUser={{
          id: "current",
          name: studentName || "User",
          role: isTeacherView ? "teacher" : "student",
        }}
        videoContent={
          videoContent ?? (
            <div className="h-full w-full bg-black flex items-center justify-center text-white/70 text-xs">
              Connecting video…
            </div>
          )
        }
        chatContent={sidebarContent}
        whiteboardContent={mainContent}
        studentsContent={
          participantsContent ?? (
            <div className="p-4 text-sm text-muted-foreground">
              Participants will appear here.
            </div>
          )
        }
        classTime={classTime}
        onLeave={onLeave}
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
