
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-16 p-3">
        <div className="h-full bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-sm">
          <Card className="h-full p-3 shadow-none border-0 bg-transparent">
            <UnifiedTopBar
              classTime={classTime}
              currentUser={currentUser}
              enhancedClassroom={enhancedClassroom}
              roomId={finalRoomId}
            />
          </Card>
        </div>
      </div>

      {/* Main Content - Allow scrolling */}
      <div className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
}
