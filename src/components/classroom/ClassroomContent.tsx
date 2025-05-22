
import React from "react";
import { ToolsPanel } from "@/components/classroom/ToolsPanel";
import { MainContentTabs } from "@/components/classroom/MainContentTabs";
import { useToast } from "@/components/ui/use-toast";
import { type LayoutType } from "@/hooks/useClassroomState";

interface VideoFeedType {
  id: string;
  name: string;
  isTeacher: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised?: boolean;
}

interface StudentType {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isCurrentUser: boolean;
}

interface QuizQuestionType {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ClassroomContentProps {
  videoFeeds: VideoFeedType[];
  students: StudentType[];
  quizQuestions: QuizQuestionType[];
  currentUserId: string;
  isTeacherView: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onToggleHand: (id: string) => void;
  onQuizComplete: (score: number, total: number) => void;
  onMessageStudent: (studentId: string) => void;
  onToggleSpotlight: (studentId: string) => void;
  onLayoutChange: (layout: LayoutType) => void;
}

export function ClassroomContent({
  videoFeeds,
  students,
  quizQuestions,
  currentUserId,
  isTeacherView,
  isMuted,
  isVideoOff,
  isHandRaised,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onQuizComplete,
  onMessageStudent,
  onToggleSpotlight,
  onLayoutChange
}: ClassroomContentProps) {
  const { toast } = useToast();

  const videoWithHandRaised = videoFeeds.map(feed => ({
    ...feed,
    isHandRaised: feed.id === currentUserId ? isHandRaised : feed.isHandRaised
  }));

  return (
    <div className="space-y-4">
      <ToolsPanel
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        onToggleMute={() => onToggleMute(currentUserId)}
        onToggleVideo={() => onToggleVideo(currentUserId)}
        onToggleHand={() => onToggleHand(currentUserId)}
        onShowGames={() => toast({ title: "Games", description: "Opening games panel" })}
        onLayoutChange={onLayoutChange}
        onShowRewards={() => toast({ title: "Rewards", description: "Opening rewards panel" })}
        onStartTimer={() => toast({ title: "Timer", description: "Starting timer" })}
        onUploadMaterial={() => toast({ title: "Upload", description: "Opening upload dialog" })}
      />

      <MainContentTabs
        videoFeeds={videoWithHandRaised}
        students={students}
        quizQuestions={quizQuestions}
        currentUserId={currentUserId}
        isTeacherView={isTeacherView}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        onToggleMute={onToggleMute}
        onToggleVideo={onToggleVideo}
        onToggleHand={onToggleHand}
        onQuizComplete={onQuizComplete}
        onMessageStudent={onMessageStudent}
        onToggleSpotlight={onToggleSpotlight}
      />
    </div>
  );
}
