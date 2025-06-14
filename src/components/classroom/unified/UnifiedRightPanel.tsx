
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BookOpen, Book, Users } from "lucide-react";
import { OneOnOneChat } from "@/components/classroom/oneonone/OneOnOneChat";
import { OneOnOneHomework } from "@/components/classroom/oneonone/OneOnOneHomework";
import { EnhancedDictionary } from "@/components/classroom/oneonone/dictionary/EnhancedDictionary";
import { CompactVideoFeed } from "@/components/classroom/video/CompactVideoFeed";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedRightPanelProps {
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
  enhancedClassroom: any;
}

export function UnifiedRightPanel({
  studentXP,
  activeRightTab,
  onTabChange,
  currentUser,
  enhancedClassroom
}: UnifiedRightPanelProps) {
  const isTeacher = currentUser.role === 'teacher';
  const {
    participants,
    localStream,
    isConnected,
    isMuted,
    isCameraOff
  } = enhancedClassroom;

  // For video display: teachers see a compact view, students see their own video
  const videoStream = localStream;
  const displayName = currentUser.name;
  const userRole = currentUser.role;

  // Handle adding word to vocabulary
  const handleAddToVocab = (word: string, definition: string) => {
    console.log('Adding to vocabulary:', word, definition);
    // This would integrate with student vocabulary tracking
  };

  // Define tabs with role-based visibility
  const tabs = [
    {
      id: "chat",
      label: "Chat",
      icon: MessageCircle,
      available: true
    },
    {
      id: "homework", 
      label: isTeacher ? "Assignments" : "Tasks",
      icon: BookOpen,
      available: true
    },
    {
      id: "dictionary",
      label: "Dictionary", 
      icon: Book,
      available: true
    },
    {
      id: "participants",
      label: "People",
      icon: Users,
      available: isTeacher // Teachers can see participant management
    }
  ].filter(tab => tab.available);

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Compact Video Feed - Role-Based Display */}
      <div className="p-3 flex-shrink-0">
        <CompactVideoFeed
          stream={videoStream}
          isConnected={isConnected}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          userName={displayName}
          userRole={userRole}
          isOwnVideo={true}
          onToggleMute={undefined} // Controlled from top bar
          onToggleCamera={undefined} // Controlled from top bar
          onJoinCall={undefined} // Controlled from top bar
          onLeaveCall={undefined} // Controlled from top bar
        />
      </div>

      {/* Tabs Navigation - Role-Based */}
      <div className="border-b p-2 flex-shrink-0">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeRightTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="text-xs px-3 py-1 flex-shrink-0"
              >
                <IconComponent size={12} className="mr-1" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Role-Aware */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full p-3">
          {activeRightTab === "chat" && <OneOnOneChat />}
          {activeRightTab === "homework" && <OneOnOneHomework />}
          {activeRightTab === "dictionary" && (
            <EnhancedDictionary onAddToVocab={handleAddToVocab} />
          )}
          {activeRightTab === "participants" && isTeacher && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Participants ({participants.length})</h3>
              {participants.length === 0 ? (
                <p className="text-xs text-gray-500">No participants yet</p>
              ) : (
                participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-xs font-medium">{participant.displayName}</div>
                      <div className="text-xs text-gray-500">{participant.role}</div>
                    </div>
                    {participant.isMuted && (
                      <Badge variant="secondary" className="text-xs">Muted</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* XP Progress Bar - Student Focus, Teacher Overview */}
      <div className="p-3 border-t bg-gradient-to-r from-purple-50 to-purple-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {isTeacher ? "Student Progress" : "Your Progress"}
          </span>
          <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">
            Level {Math.floor(studentXP / 100)}
          </Badge>
        </div>
        
        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>XP Progress</span>
            <span>{studentXP % 100}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(studentXP % 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
