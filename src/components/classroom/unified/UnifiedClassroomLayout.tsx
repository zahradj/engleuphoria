
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_1200px_800px_at_50%_-20%,rgba(120,119,198,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_80%_100%,rgba(147,51,234,0.08),transparent)] pointer-events-none"></div>
      
      {/* Floating Elements - Hidden on mobile */}
      <div className="hidden lg:block fixed top-16 left-8 w-64 h-64 bg-gradient-to-br from-blue-300/15 to-cyan-200/15 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="hidden lg:block fixed bottom-16 right-8 w-56 h-56 bg-gradient-to-br from-violet-300/10 to-pink-200/10 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>
      
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-12 sm:h-16 p-2 sm:p-3">
        <div className="h-full glass-enhanced backdrop-blur-xl border border-white/30 rounded-lg sm:rounded-xl shadow-lg">
          <Card className="h-full p-2 sm:p-3 shadow-none border-0 bg-transparent">
            <UnifiedTopBar
              classTime={classTime}
              currentUser={currentUser}
              enhancedClassroom={enhancedClassroom}
              roomId={finalRoomId}
            />
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-4 relative z-10">
        <div className="animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}
