
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UnifiedContentViewer } from "@/components/classroom/content/UnifiedContentViewer";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { StartTabContent } from "./components/TabContent/StartTabContent";
import { FinishTabContent } from "./components/TabContent/FinishTabContent";
import { BookOpen, Gamepad2, Play, CheckCircle, Sparkles } from "lucide-react";
import { AITabContent } from "./components/TabContent/AITabContent";

interface UnifiedCenterPanelProps {
  activeCenterTab: string;
  onTabChange: (tab: string) => void;
  currentUser: {
    id: string;
    role: 'teacher' | 'student';
    name: string;
  };
  sessionStatus?: 'waiting' | 'started' | 'ended';
  roomId?: string;
  onStartLesson?: () => void;
  onEndLesson?: () => void;
}

export function UnifiedCenterPanel({ 
  activeCenterTab, 
  onTabChange, 
  currentUser,
  sessionStatus = 'waiting',
  roomId = '',
  onStartLesson = () => {},
  onEndLesson = () => {}
}: UnifiedCenterPanelProps) {
  const isTeacher = currentUser.role === 'teacher';

  return (
    <Card className="h-full shadow-lg border-0 bg-white/95 backdrop-blur-sm flex flex-col">
      <Tabs value={activeCenterTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className="p-4 pb-0 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="start" className="flex items-center gap-2">
              <Play size={16} />
              <span className="hidden sm:inline">Start</span>
            </TabsTrigger>
            <TabsTrigger value="lesson" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Lesson</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Gamepad2 size={16} />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="hidden sm:inline">AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="finish" className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span className="hidden sm:inline">Finish</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="start" className="h-full m-0 overflow-y-auto">
            <StartTabContent
              onStartLesson={onStartLesson}
              isTeacher={isTeacher}
              sessionStatus={sessionStatus}
              roomId={roomId}
            />
          </TabsContent>

          <TabsContent value="lesson" className="h-full m-0 p-4 overflow-y-auto">
            <UnifiedContentViewer 
              isTeacher={isTeacher}
              studentName={currentUser.name}
            />
          </TabsContent>

          <TabsContent value="activities" className="h-full m-0 p-4 overflow-y-auto">
            <OneOnOneGames />
          </TabsContent>

          <TabsContent value="ai" className="h-full m-0 p-4 overflow-y-auto">
            <AITabContent
              currentUser={currentUser}
              onInsertToWhiteboard={(content) => {
                console.log('Inserting to whiteboard:', content);
                // This would integrate with the whiteboard system
              }}
            />
          </TabsContent>

          <TabsContent value="finish" className="h-full m-0 overflow-y-auto">
            <FinishTabContent
              onEndLesson={onEndLesson}
              isTeacher={isTeacher}
              sessionStatus={sessionStatus}
              roomId={roomId}
              studentId={!isTeacher ? currentUser.id : undefined}
              teacherId={isTeacher ? currentUser.id : undefined}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
