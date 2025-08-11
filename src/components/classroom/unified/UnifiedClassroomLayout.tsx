
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">Enhanced Classroom</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Video className="h-3 w-3 mr-1" />
                Live Session
              </Badge>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Class Timer */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-gray-700">{formatTime(classTime)}</span>
              </div>

              {/* Participants Count */}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  {enhancedClassroom?.participants?.length || 0} participants
                </span>
              </div>

              {/* Connection Status */}
              <ConnectionManager
                isConnected={enhancedClassroom?.isConnected || false}
                error={enhancedClassroom?.error}
                onRetry={manualRetry}
                onRefresh={handleRefreshPage}
                connectionQuality={enhancedClassroom?.connectionQuality}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <div className="p-6">
            {children}
          </div>
        </Card>
      </main>

      {/* Bottom Status Bar */}
      <ClassStatusBar
        elapsedSec={classTime}
        totalSec={1800}
        participantsCount={enhancedClassroom?.participants?.length || 0}
      />


      {/* Recovery Status Indicator */}
      {isRecovering && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">
                Reconnecting... ({retryCount}/5)
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
