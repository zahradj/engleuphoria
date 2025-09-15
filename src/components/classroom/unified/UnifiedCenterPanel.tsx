
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
    <Card className="h-full shadow-lg flex flex-col relative overflow-hidden" style={{ 
      backgroundColor: '#FBFBFB', 
      border: '1px solid rgba(196, 217, 255, 0.4)',
      backdropFilter: 'blur(8px)'
    }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full" style={{ background: 'linear-gradient(225deg, rgba(232, 249, 255, 0.3) 0%, rgba(197, 186, 255, 0.1) 50%, transparent 100%)' }}></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full" style={{ background: 'linear-gradient(45deg, rgba(197, 186, 255, 0.3) 0%, rgba(232, 249, 255, 0.1) 50%, transparent 100%)' }}></div>
      
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
                className="flex items-center gap-2 transition-colors duration-200"
                style={sessionStatus === 'started' 
                  ? { backgroundColor: '#4F46E5', color: 'white' }
                  : { 
                      borderColor: '#C4D9FF', 
                      color: '#4F46E5',
                      backgroundColor: 'transparent'
                    }
                }
                onMouseEnter={(e) => {
                  if (sessionStatus !== 'started') {
                    e.currentTarget.style.backgroundColor = '#E8F9FF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sessionStatus !== 'started') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Play size={14} />
                Start Lesson
              </Button>
              <Button
                variant={sessionStatus === 'ended' ? "default" : "outline"}
                size="sm"
                onClick={onEndLesson}
                disabled={sessionStatus !== 'started'}
                className="flex items-center gap-2 transition-colors duration-200"
                style={sessionStatus === 'ended' 
                  ? { backgroundColor: '#4F46E5', color: 'white' }
                  : { 
                      borderColor: '#C4D9FF', 
                      color: '#4F46E5',
                      backgroundColor: 'transparent'
                    }
                }
                onMouseEnter={(e) => {
                  if (sessionStatus !== 'ended' && sessionStatus === 'started') {
                    e.currentTarget.style.backgroundColor = '#E8F9FF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sessionStatus !== 'ended' && sessionStatus === 'started') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <CheckCircle size={14} />
                Finish Lesson
              </Button>
            </div>
            
            <ActivityCountdownTimer className="ml-auto" />
          </div>
          
          <TabsList className="grid w-full grid-cols-2 mb-4 shadow-sm" style={{ 
            backgroundColor: 'rgba(232, 249, 255, 0.6)', 
            border: '1px solid rgba(196, 217, 255, 0.4)',
            backdropFilter: 'blur(4px)'
          }}>
            <TabsTrigger 
              value="lesson" 
              className="flex items-center gap-2 transition-all duration-300 data-[state=active]:shadow-md"
              style={{
                color: '#4F46E5'
              }}
              data-active-style={{
                backgroundColor: '#4F46E5',
                color: 'white'
              }}
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">Lesson</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="flex items-center gap-2 transition-all duration-300 data-[state=active]:shadow-md"
              style={{
                color: '#4F46E5'
              }}
              data-active-style={{
                backgroundColor: '#4F46E5',
                color: 'white'
              }}
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
