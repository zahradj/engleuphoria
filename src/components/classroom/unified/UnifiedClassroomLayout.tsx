
import React from "react";
import { Card } from "@/components/ui/card";
import { UnifiedTopBar } from "./UnifiedTopBar";
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";

interface UnifiedClassroomLayoutProps {
  children: React.ReactNode;
  classTime: number;
  enhancedClassroom: any;
}

export function UnifiedClassroomLayout({ 
  children, 
  classTime, 
  enhancedClassroom 
}: UnifiedClassroomLayoutProps) {
  const { currentUser, finalRoomId } = useUnifiedClassroomContext();

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Fixed Top Bar with reduced padding */}
      <div className="fixed top-0 left-0 right-0 z-50 h-20 p-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="h-full p-3 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <UnifiedTopBar
            classTime={classTime}
            currentUser={currentUser}
            enhancedClassroom={enhancedClassroom}
            roomId={finalRoomId}
          />
        </Card>
      </div>

      {/* Main Enhanced Classroom Layout - Adjusted margin and height */}
      <div className="mt-24 h-[calc(100vh-6rem)] px-4 pb-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
