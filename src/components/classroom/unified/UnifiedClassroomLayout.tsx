
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
      {/* Enhanced Multi-layer Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_1200px_800px_at_50%_-20%,rgba(120,119,198,0.15),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_80%_100%,rgba(147,51,234,0.12),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_25%_25%,rgba(59,130,246,0.08),transparent,rgba(147,51,234,0.05))] pointer-events-none"></div>
      
      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             backgroundSize: '60px 60px'
           }}>
      </div>
      
      {/* Dynamic Floating Elements with Enhanced Animation */}
      <div className="fixed top-16 left-8 w-96 h-96 bg-gradient-to-br from-blue-300/20 via-purple-200/15 to-cyan-200/20 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="fixed bottom-16 right-8 w-80 h-80 bg-gradient-to-br from-violet-300/15 via-pink-200/10 to-indigo-300/20 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/10 via-teal-200/08 to-blue-200/15 rounded-full blur-2xl animate-float-reverse pointer-events-none"></div>
      
      {/* Enhanced Top Bar with Advanced Glass Morphism */}
      <div className="sticky top-0 z-50 h-20 p-3">
        <div className="h-full glass-enhanced backdrop-blur-2xl border border-white/40 rounded-2xl shadow-2xl ring-1 ring-black/5 relative overflow-hidden">
          {/* Subtle animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow rounded-2xl"></div>
          <Card className="h-full p-3 shadow-none border-0 bg-transparent relative z-10">
            <UnifiedTopBar
              classTime={classTime}
              currentUser={currentUser}
              enhancedClassroom={enhancedClassroom}
              roomId={finalRoomId}
            />
          </Card>
        </div>
      </div>

      {/* Enhanced Main Classroom Layout */}
      <div className="px-4 pb-4 relative z-10">
        <div className="animate-fade-in-up">
          {children}
        </div>
      </div>

      {/* Enhanced Decorative Elements with Better Positioning */}
      <div className="fixed bottom-8 left-8 w-4 h-4 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-full animate-pulse-gentle shadow-lg ring-2 ring-white/30"></div>
      <div className="fixed top-32 right-16 w-3 h-3 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full animate-pulse-gentle shadow-lg ring-2 ring-white/20" style={{ animationDelay: '1.5s' }}></div>
      <div className="fixed bottom-32 right-20 w-3.5 h-3.5 bg-gradient-to-br from-indigo-400 via-blue-400 to-sky-400 rounded-full animate-pulse-gentle shadow-lg ring-2 ring-white/25" style={{ animationDelay: '3s' }}></div>
      
      {/* Enhanced Ambient Light Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-2/3 h-2/3 bg-gradient-radial from-blue-300/8 via-purple-200/4 to-transparent rounded-full animate-ambient-glow"></div>
      </div>
      
      {/* Subtle Edge Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/2 to-transparent"></div>
      </div>
    </div>
  );
}
