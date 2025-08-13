
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Video, Wifi } from "lucide-react";
import { ConnectionManager } from "./components/ConnectionManager";
import { useConnectionRecovery } from "@/hooks/enhanced-classroom/useConnectionRecovery";
import { ClassStatusBar } from "./components/ClassStatusBar";

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
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enhanced connection recovery
  const { retryCount, isRecovering, manualRetry } = useConnectionRecovery({
    isConnected: enhancedClassroom?.isConnected || false,
    error: enhancedClassroom?.error || null,
    onReconnect: async () => {
      if (enhancedClassroom?.videoService) {
        try {
          // Attempt to reconnect the video service
          await enhancedClassroom.videoService.initialize();
          if (!enhancedClassroom.isConnected) {
            await enhancedClassroom.joinRoom();
          }
        } catch (error) {
          console.error('Reconnection failed:', error);
          throw error;
        }
      }
    },
    maxRetries: 5,
    retryDelay: 3000
  });

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Full-screen grid layout */}
      <div className="flex-1 flex overflow-auto">
        {/* Main content area - 80-85% width */}
        <main className="flex-1 bg-background">
          {children}
        </main>
      </div>

      {/* Bottom Status Bar - Fixed at bottom */}
      <ClassStatusBar
        elapsedSec={classTime}
        totalSec={1800}
        participantsCount={enhancedClassroom?.participants?.length || 0}
      />

      {/* Recovery Status Indicator */}
      {isRecovering && (
        <div className="fixed bottom-16 right-4 z-50">
          <Card className="p-3 bg-muted border">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-foreground">
                Reconnecting... ({retryCount}/5)
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
