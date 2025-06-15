
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Multi-layer Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.08),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Floating Animated Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-indigo-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      {/* Enhanced Top Bar with Glass Morphism */}
      <div className="sticky top-0 z-50 h-20 p-3">
        <div className="h-full bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl ring-1 ring-black/5">
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

      {/* Main Enhanced Classroom Layout */}
      <div className="px-4 pb-4">
        <div className="animate-fade-in">
          {children}
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="fixed bottom-6 left-6 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse shadow-lg"></div>
      <div className="fixed top-36 right-12 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-32 right-16 w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '3s' }}></div>
      
      {/* Ambient Light Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-blue-300/5 via-transparent to-transparent rounded-full"></div>
      </div>
    </div>
  );
}
