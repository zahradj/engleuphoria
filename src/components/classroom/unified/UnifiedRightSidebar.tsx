import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { MessageSquare, BookOpen, Trophy, Video, Mic, MicOff, VideoOff, ChevronRight, Library } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModernChatPanel } from "@/components/classroom/modern/ModernChatPanel";
import { ModernDictionaryPanel } from "@/components/classroom/modern/ModernDictionaryPanel";
import { ModernRewardsPanel } from "@/components/classroom/modern/ModernRewardsPanel";
import { EnglishJourneyLibrary } from "@/components/teacher/library/EnglishJourneyLibrary";
import { soundEffectsService } from "@/services/soundEffectsService";

interface UnifiedRightSidebarProps {
  // Video states
  teacher: {
    id: string;
    name: string;
    isVideoOn: boolean;
    isAudioOn: boolean;
  };
  student: {
    id: string;
    name: string;
    isVideoOn: boolean;
    isAudioOn: boolean;
  };
  connectionQuality: "excellent" | "good" | "poor";
  
  // Video controls
  onToggleTeacherVideo: () => void;
  onToggleTeacherAudio: () => void;
  onToggleStudentVideo: () => void;
  onToggleStudentAudio: () => void;
  
  // Tab state
  activeTab: string;
  onTabChange: (tab: string) => void;
  
  // Tab content props
  roomId: string;
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  
  // Rewards props
  currentXP: number;
  nextLevelXP: number;
  level: number;
  badges: any[];
  recentAchievements: any[];
  starCount: number;
  isTeacher: boolean;
  onAwardStar: () => void;
  onAddToVocab: (word: string, definition: string) => void;
  
  // UI state
  unreadChatCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function VideoFeed({ 
  user, 
  role, 
  onToggleVideo, 
  onToggleAudio 
}: { 
  user: { name: string; isVideoOn: boolean; isAudioOn: boolean }, 
  role: 'teacher' | 'student',
  onToggleVideo: () => void,
  onToggleAudio: () => void
}) {
  const gradientClass = role === 'teacher' 
    ? 'from-purple-500/20 to-violet-600/20' 
    : 'from-blue-500/20 to-cyan-500/20';
  
  const borderColor = role === 'teacher'
    ? 'border-purple-500/50'
    : 'border-blue-500/50';

  return (
    <GlassCard className={`relative h-[240px] overflow-hidden border-2 ${borderColor}`}>
      {/* Video content */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
        {user.isVideoOn ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 border-2 border-white/30">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-100 border-blue-500/50">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-1" />
              LIVE
            </Badge>
          </div>
        ) : (
          <div className="text-center">
            <VideoOff className="w-12 h-12 text-white/60 mb-2 mx-auto" />
            <p className="text-sm text-white/80">Camera Off</p>
          </div>
        )}
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        <GlassButton
          size="sm"
          variant={user.isAudioOn ? "primary" : "accent"}
          onClick={() => {
            soundEffectsService.playButtonClick();
            onToggleAudio();
          }}
          className={!user.isAudioOn ? "bg-red-500/20 hover:bg-red-500/30" : ""}
        >
          {user.isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </GlassButton>
        <GlassButton
          size="sm"
          variant={user.isVideoOn ? "primary" : "accent"}
          onClick={() => {
            soundEffectsService.playButtonClick();
            onToggleVideo();
          }}
          className={!user.isVideoOn ? "bg-red-500/20 hover:bg-red-500/30" : ""}
        >
          {user.isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </GlassButton>
      </div>

      {/* Name tag */}
      <div className="absolute top-3 left-3">
        <Badge variant="secondary" className="bg-black/30 text-white border-0 backdrop-blur-sm">
          {role === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {user.name}
        </Badge>
      </div>
    </GlassCard>
  );
}

export function UnifiedRightSidebar({
  teacher,
  student,
  connectionQuality,
  onToggleTeacherVideo,
  onToggleTeacherAudio,
  onToggleStudentVideo,
  onToggleStudentAudio,
  activeTab,
  onTabChange,
  roomId,
  currentUser,
  currentXP,
  nextLevelXP,
  level,
  badges,
  recentAchievements,
  starCount,
  isTeacher,
  onAwardStar,
  onAddToVocab,
  unreadChatCount = 0,
  isCollapsed = false,
  onToggleCollapse
}: UnifiedRightSidebarProps) {
  
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: unreadChatCount },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    ...(isTeacher ? [{ id: 'library', label: 'Library', icon: Library }] : [])
  ];

  const handleTabClick = (tabId: string) => {
    soundEffectsService.playPageTurn();
    onTabChange(tabId);
  };

  if (isCollapsed) {
    return (
      <GlassCard className="h-full flex items-center justify-center p-2">
        <GlassButton
          variant="default"
          size="sm"
          onClick={() => {
            soundEffectsService.playButtonClick();
            onToggleCollapse?.();
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </GlassButton>
      </GlassCard>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Teacher Video */}
      <VideoFeed
        user={teacher}
        role="teacher"
        onToggleVideo={onToggleTeacherVideo}
        onToggleAudio={onToggleTeacherAudio}
      />

      {/* Student Video */}
      <VideoFeed
        user={student}
        role="student"
        onToggleVideo={onToggleStudentVideo}
        onToggleAudio={onToggleStudentAudio}
      />

      {/* Tools Panel */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/10 p-1 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-classroom-primary/20 text-classroom-primary shadow-lg scale-105'
                    : 'hover:bg-white/5 text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium hidden md:inline">{tab.label}</span>
                {tab.badge ? (
                  <Badge variant="destructive" className="h-5 min-w-5 text-[10px] px-1">
                    {tab.badge}
                  </Badge>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && (
            <ModernChatPanel roomId={roomId} currentUser={currentUser} />
          )}
          {activeTab === 'dictionary' && (
            <ModernDictionaryPanel onAddToVocab={onAddToVocab} />
          )}
          {activeTab === 'rewards' && (
            <ModernRewardsPanel
              currentXP={currentXP}
              nextLevelXP={nextLevelXP}
              level={level}
              badges={badges}
              recentAchievements={recentAchievements}
              starCount={starCount}
              isTeacher={isTeacher}
              onAwardStar={onAwardStar}
            />
          )}
          {activeTab === 'library' && isTeacher && (
            <div className="h-full overflow-y-auto p-4">
              <EnglishJourneyLibrary />
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
