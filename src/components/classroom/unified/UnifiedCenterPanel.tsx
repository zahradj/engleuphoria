
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
    <Card className="h-full shadow-lg border border-neutral-200/80 bg-surface/98 backdrop-blur-sm flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-100/20 via-accent-50/10 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-100/20 via-primary-50/10 to-transparent rounded-tr-full"></div>
      
      <Tabs value={activeCenterTab} onValueChange={onTabChange} className="h-full flex flex-col relative z-10">
        <div className="p-4 pb-0 flex-shrink-0">
          {/* Top Bar with Timer and Start/Finish buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant={sessionStatus === 'started' ? "default" : "outline"}
                size="sm"
                onClick={onStartLesson}
                disabled={sessionStatus === 'started'}
                className={`flex items-center gap-2 ${
                  sessionStatus === 'started' 
                    ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                    : 'border-neutral-200 text-primary-600 hover:bg-primary-50'
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
                className={`flex items-center gap-2 ${
                  sessionStatus === 'ended' 
                    ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                    : 'border-neutral-200 text-primary-600 hover:bg-primary-50'
                }`}
              >
                <CheckCircle size={14} />
                Finish Lesson
              </Button>
            </div>
            
            <ActivityCountdownTimer className="ml-auto" />
          </div>
          
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-neutral-100/80 border border-neutral-200/60 backdrop-blur-sm shadow-sm">
            <TabsTrigger 
              value="lesson" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-500 data-[state=active]:text-white text-primary-600 transition-all duration-300 data-[state=active]:shadow-md"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">Lesson</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-500 data-[state=active]:text-white text-primary-600 transition-all duration-300 data-[state=active]:shadow-md"
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
