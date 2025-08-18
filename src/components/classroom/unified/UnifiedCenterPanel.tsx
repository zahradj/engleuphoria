
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnifiedContentViewer } from "@/components/classroom/content/UnifiedContentViewer";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { StartTabContent } from "./components/TabContent/StartTabContent";
import { FinishTabContent } from "./components/TabContent/FinishTabContent";
import { ActivityCountdownTimer } from "@/components/classroom/ActivityCountdownTimer";
import { BookOpen, Gamepad2, Play, CheckCircle } from "lucide-react";

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
    <Card className="h-full shadow-sm border border-muted bg-surface backdrop-blur-sm flex flex-col">
      <Tabs value={activeCenterTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className="p-4 pb-0 flex-shrink-0 border-b border-muted/50">
          {/* Top Bar with Timer and Start/Finish buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={sessionStatus === 'started' ? "default" : "outline"}
                size="sm"
                onClick={onStartLesson}
                disabled={sessionStatus === 'started'}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  sessionStatus === 'started' 
                    ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm' 
                    : 'border-muted text-foreground hover:bg-surface-2'
                }`}
              >
                <Play size={14} />
                Start Lesson
              </Button>
              <Button
                variant={sessionStatus === 'ended' ? "default" : "outline"}
                size="sm"
                onClick={onEndLesson}
                disabled={sessionStatus !== 'started'}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  sessionStatus === 'ended' 
                    ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm' 
                    : 'border-muted text-foreground hover:bg-surface-2'
                }`}
              >
                <CheckCircle size={14} />
                Finish Lesson
              </Button>
            </div>
            
            <ActivityCountdownTimer className="ml-auto" />
          </div>
          
          <TabsList className="grid w-full grid-cols-2 bg-surface-2 border border-muted/50">
            <TabsTrigger 
              value="lesson" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-500 data-[state=active]:text-white text-muted-foreground transition-all duration-200"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">Lesson</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-500 data-[state=active]:text-white text-muted-foreground transition-all duration-200"
            >
              <Gamepad2 size={16} />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="lesson" className="h-full m-0 p-4 overflow-y-auto">
            <UnifiedContentViewer 
              isTeacher={isTeacher}
              studentName={currentUser.name}
            />
          </TabsContent>

          <TabsContent value="activities" className="h-full m-0 p-4 overflow-y-auto">
            <OneOnOneGames />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
