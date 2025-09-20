
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
    <Card className="h-full shadow-xl flex flex-col relative overflow-hidden bg-surface/80 backdrop-blur-xl border border-primary-100">
      {/* Modern decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-gradient-to-bl from-primary-100/30 via-accent-100/20 to-transparent animate-pulse-subtle"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full bg-gradient-to-tr from-accent-100/25 via-primary-100/15 to-transparent animate-float"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-radial from-primary-50/20 to-transparent opacity-50 animate-rotate-slow"></div>
      
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
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-success to-success-soft border-success text-white shadow-md"
              >
                <Play size={14} />
                Start Lesson
              </Button>
              <Button
                variant={sessionStatus === 'ended' ? "default" : "outline"}
                size="sm"
                onClick={onEndLesson}
                disabled={sessionStatus !== 'started'}
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-primary-600 to-primary-500 border-primary-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={14} />
                Finish Lesson
              </Button>
            </div>
            
            <ActivityCountdownTimer className="ml-auto" />
          </div>
          
          <TabsList className="grid w-full grid-cols-2 mb-4 shadow-lg bg-surface-2/80 backdrop-blur-lg border border-primary-200">
            <TabsTrigger 
              value="lesson" 
              className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary-50 text-primary-700 font-medium"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">Lesson</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary-50 text-primary-700 font-medium"
            >
              <Gamepad2 size={16} />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="lesson" className="h-full m-0 overflow-hidden">
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
