
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsNavigation } from "@/components/classroom/content/TabsNavigation";
import { ContentLayout } from "@/components/classroom/content/ContentLayout";

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

interface OneOnOneContentProps {
  videoFeeds: VideoFeedType[];
  students: StudentType[];
  currentUserId: string;
  isTeacherView: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onToggleHand: (id: string) => void;
  onMessageStudent: (studentId: string) => void;
  onToggleSpotlight: (studentId: string) => void;
  onLayoutChange: (layout: string) => void;
}

export function OneOnOneContent({
  videoFeeds,
  students,
  currentUserId,
  isTeacherView,
  isMuted,
  isVideoOff,
  isHandRaised,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onMessageStudent,
  onToggleSpotlight,
  onLayoutChange
}: OneOnOneContentProps) {
  const [activeTab, setActiveTab] = useState("video");
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "video") {
      onLayoutChange("video");
    } else if (value === "whiteboard") {
      onLayoutChange("material");
    } else if (value === "students") {
      onLayoutChange(isTeacherView ? "gallery" : "default");
    }
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full flex flex-col gap-4 h-full"
    >
      <TabsNavigation isTeacherView={isTeacherView} />
      
      <TabsContent value={activeTab} className="flex-1 mt-0">
        <ContentLayout
          activeTab={activeTab}
          videoFeeds={videoFeeds}
          students={students}
          quizQuestions={[]}
          currentUserId={currentUserId}
          isTeacherView={isTeacherView}
          onToggleMute={onToggleMute}
          onToggleVideo={onToggleVideo}
          onToggleHand={onToggleHand}
          onQuizComplete={() => {}}
          onMessageStudent={onMessageStudent}
          onToggleSpotlight={onToggleSpotlight}
        />
      </TabsContent>
    </Tabs>
  );
}
