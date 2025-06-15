
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      {/* Enhanced Top Bar with Glass Morphism */}
      <div className="sticky top-0 z-50 h-20 p-3">
        <div className="h-full bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
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

      {/* Main Enhanced Classroom Layout with Proper Scrolling */}
      <div className="px-4 pb-4">
        <div className="animate-fade-in">
          {children}
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="fixed bottom-4 left-4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
      <div className="fixed top-32 right-8 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-20 right-12 w-1.5 h-1.5 bg-indigo-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
