
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ToolsPanel } from "@/components/classroom/ToolsPanel";
import { TabsNavigation } from "@/components/classroom/content/TabsNavigation";
import { ContentLayout } from "@/components/classroom/content/ContentLayout";
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
  const [activeTab, setActiveTab] = useState("video");

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

      <Tabs 
        defaultValue="video" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsNavigation isTeacherView={isTeacherView} />

        <TabsContent value="video" className="space-y-4 pt-4">
          <ContentLayout
            activeTab="video"
            videoFeeds={videoWithHandRaised}
            students={students}
            quizQuestions={quizQuestions}
            currentUserId={currentUserId}
            isTeacherView={isTeacherView}
            onToggleMute={onToggleMute}
            onToggleVideo={onToggleVideo}
            onToggleHand={onToggleHand}
            onQuizComplete={onQuizComplete}
            onMessageStudent={onMessageStudent}
            onToggleSpotlight={onToggleSpotlight}
          />
        </TabsContent>

        <TabsContent value="whiteboard" className="pt-4">
          <ContentLayout
            activeTab="whiteboard"
            videoFeeds={videoWithHandRaised}
            students={students}
            quizQuestions={quizQuestions}
            currentUserId={currentUserId}
            isTeacherView={isTeacherView}
            onToggleMute={onToggleMute}
            onToggleVideo={onToggleVideo}
            onToggleHand={onToggleHand}
            onQuizComplete={onQuizComplete}
            onMessageStudent={onMessageStudent}
            onToggleSpotlight={onToggleSpotlight}
          />
        </TabsContent>

        <TabsContent value="students" className="pt-4">
          <ContentLayout
            activeTab="students"
            videoFeeds={videoWithHandRaised}
            students={students}
            quizQuestions={quizQuestions}
            currentUserId={currentUserId}
            isTeacherView={isTeacherView}
            onToggleMute={onToggleMute}
            onToggleVideo={onToggleVideo}
            onToggleHand={onToggleHand}
            onQuizComplete={onQuizComplete}
            onMessageStudent={onMessageStudent}
            onToggleSpotlight={onToggleSpotlight}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
