import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";

interface ModernClassroomLayoutProps {
  topBar: ReactNode;
  leftPanel?: ReactNode;
  centerContent: ReactNode;
  rightSidebar?: ReactNode;
  bottomToolbar: ReactNode;
  showLeftPanel?: boolean;
  showRightSidebar?: boolean;
  className?: string;
}

export function ModernClassroomLayout({
  topBar,
  leftPanel,
  centerContent,
  rightSidebar,
  bottomToolbar,
  showLeftPanel = true,
  showRightSidebar = true,
  className
}: ModernClassroomLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-primary/5 via-surface to-accent/5",
      "relative overflow-hidden",
      className
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 h-screen grid grid-rows-[60px_1fr_70px] gap-0">
        {/* Top Bar */}
        <div className="border-b border-border/50 backdrop-blur-sm bg-surface/80">
          {topBar}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 p-4 overflow-hidden">
          {/* Left Panel - Slides */}
          {showLeftPanel && leftPanel && (
            <div className="col-span-3 overflow-y-auto">
              <GlassCard className="h-full p-4">
                {leftPanel}
              </GlassCard>
            </div>
          )}

          {/* Center - Whiteboard */}
          <div className={cn(
            "overflow-hidden",
            showLeftPanel && showRightSidebar && "col-span-6",
            !showLeftPanel && showRightSidebar && "col-span-9",
            showLeftPanel && !showRightSidebar && "col-span-9",
            !showLeftPanel && !showRightSidebar && "col-span-12"
          )}>
            <GlassCard variant="strong" className="h-full p-4">
              {centerContent}
            </GlassCard>
          </div>

          {/* Right Sidebar - Chat/Dictionary/Rewards */}
          {showRightSidebar && rightSidebar && (
            <div className="col-span-3 overflow-y-auto">
              <GlassCard className="h-full p-4">
                {rightSidebar}
              </GlassCard>
            </div>
          )}
        </div>

        {/* Bottom Toolbar */}
        <div className="relative">
          {bottomToolbar}
        </div>
      </div>
    </div>
  );
}
