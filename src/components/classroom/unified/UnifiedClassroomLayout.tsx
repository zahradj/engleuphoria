
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/60 to-slate-100/70 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_1200px_800px_at_50%_-20%,rgba(120,119,198,0.05),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_80%_100%,rgba(147,51,234,0.04),transparent)] pointer-events-none"></div>
      
      {/* Floating Elements */}
      <div className="fixed top-16 left-8 w-64 h-64 bg-gradient-to-br from-slate-200/10 to-gray-200/10 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="fixed bottom-16 right-8 w-56 h-56 bg-gradient-to-br from-slate-300/8 to-gray-200/8 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>
      
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-16 p-3">
        <div className="h-full glass-enhanced backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
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

      {/* Main Content */}
      <div className="px-4 pb-4 relative z-10">
        <div className="animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}
