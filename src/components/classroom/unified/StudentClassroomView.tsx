import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoTile } from "./components/VideoTile";
import { ESLWhiteboard } from "@/components/classroom/ESLWhiteboard";
import { ThumbsUp, Clock, Star, FileText, PenTool } from "lucide-react";
interface StudentClassroomViewProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  enhancedClassroom?: any;
  classTime: number;
  studentXP: number;
}
export function StudentClassroomView({
  currentUser,
  enhancedClassroom,
  classTime,
  studentXP
}: StudentClassroomViewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [activeContentTab, setActiveContentTab] = useState("slides");
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  const pronouns = ["I", "He", "She", "It", "You", "We", "They"];
  const exercises = [{
    id: 1,
    answer: "played"
  }, {
    id: 2,
    answer: "play___"
  }, {
    id: 3,
    answer: "play___"
  }, {
    id: 4,
    answer: "play___"
  }, {
    id: 5,
    answer: "play___"
  }, {
    id: 6,
    answer: "play___"
  }, {
    id: 7,
    answer: "play"
  }];
  const handleDragStart = (e: React.DragEvent, pronoun: string) => {
    e.dataTransfer.setData("text/plain", pronoun);
  };
  const handleDrop = (e: React.DragEvent, exerciseId: number) => {
    e.preventDefault();
    const pronoun = e.dataTransfer.getData("text/plain");
    setSelectedAnswers(prev => ({
      ...prev,
      [exerciseId]: pronoun
    }));
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  return <div className="h-screen w-full bg-gradient-to-br from-classroom-background via-white to-classroom-neutral/30 relative">
      {/* Clean header with time and XP only */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        
      </div>

      {/* XP Display - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        
      </div>

      {/* Two-column layout: Material + Teacher */}
      <div className="h-full grid grid-cols-[1fr_400px] gap-4 p-4 pt-4">{/* Content positioned directly under fixed header */}
        {/* Left: Learning Material */}
        <Card className="h-full bg-gradient-to-br from-classroom-card to-classroom-background/50 shadow-xl rounded-3xl overflow-hidden border border-classroom-border">
          <Tabs value={activeContentTab} onValueChange={setActiveContentTab} className="w-full h-full flex flex-col">
            <div className="px-8 pt-6 pb-2 border-b border-classroom-border/60">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="slides" className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Lesson</span>
                </TabsTrigger>
                <TabsTrigger value="whiteboard" className="flex items-center gap-2">
                  <PenTool size={16} />
                  <span>Whiteboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="slides" className="flex-1 m-0 overflow-y-auto">
              <div className="h-full p-8 bg-gradient-to-br from-classroom-background via-white to-classroom-neutral/20 relative overflow-y-auto">
                {/* Main Exercise Content */}
                <div className="flex items-center justify-center h-full">
                  <div className="max-w-4xl w-full">
                    
                    {/* Pronoun Cards - Left Side */}
                    <div className="flex flex-col gap-3 w-48 float-left mr-8">
                      {pronouns.map(pronoun => <div key={pronoun} draggable onDragStart={e => handleDragStart(e, pronoun)} className="bg-gradient-to-r from-classroom-primary to-classroom-primary/80 text-white p-4 rounded-xl text-center font-bold text-lg cursor-move shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-classroom-primary/70">
                          {pronoun}
                        </div>)}
                    </div>

                    {/* Exercise Area - Center */}
                    <div className="flex-1 space-y-4">
                      {exercises.map(exercise => <div key={exercise.id} className="flex items-center gap-4">
                          {/* Drop zone for pronoun */}
                          <div onDrop={e => handleDrop(e, exercise.id)} onDragOver={handleDragOver} className={`w-32 h-12 border-2 border-dashed rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${selectedAnswers[exercise.id] ? 'bg-classroom-primary/10 border-classroom-primary text-classroom-primary animate-pulse-subtle' : 'border-classroom-secondary/60 bg-classroom-secondary/10 text-classroom-secondary hover:border-classroom-secondary'}`}>
                            {selectedAnswers[exercise.id] || "Drop here"}
                          </div>

                          {/* Exercise text */}
                          <div className="bg-gradient-to-r from-classroom-accent to-classroom-accent/80 text-white p-4 rounded-xl font-bold text-lg shadow-lg min-w-32 text-center border-2 border-classroom-accent/70 hover:scale-105 transition-transform duration-300">
                            {exercise.answer}
                          </div>
                        </div>)}

                      {/* Completion word */}
                      <div className="flex justify-center mt-8">
                        <div className="bg-gradient-to-r from-classroom-secondary to-classroom-secondary/80 text-white p-6 rounded-xl font-bold text-2xl shadow-xl border-2 border-classroom-secondary/70 animate-bounce-gentle">
                          yesterday.
                        </div>
                      </div>
                    </div>

                    {/* Feedback thumbs up */}
                    <div className="absolute top-1/2 right-16 transform -translate-y-1/2">
                      <div className="w-20 h-20 bg-gradient-to-r from-classroom-success to-classroom-primary rounded-full flex items-center justify-center shadow-xl animate-bounce border-4 border-white">
                        <ThumbsUp className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar at bottom */}
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="w-full bg-classroom-neutral/60 rounded-full h-3 shadow-inner">
                    <div className="bg-gradient-to-r from-classroom-primary via-classroom-accent to-classroom-secondary h-3 rounded-full shadow-sm animate-pulse-subtle" style={{
                    width: '65%'
                  }}></div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="whiteboard" className="flex-1 m-0">
              <div className="h-full">
                <ESLWhiteboard className="h-full" isCollaborative={true} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Right: Teacher Video */}
        <Card className="h-full bg-gradient-to-br from-classroom-card to-classroom-background/30 shadow-xl rounded-2xl p-4 flex flex-col border border-classroom-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-classroom-primary rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold" style={{ color: 'hsl(var(--classroom-primary))' }}>Teacher</span>
          </div>
          
          <div className="flex-1 bg-gradient-to-br from-classroom-background to-classroom-neutral/20 rounded-xl overflow-hidden border-2 border-classroom-primary/30 shadow-inner">
            <VideoTile stream={enhancedClassroom?.remoteStreams?.[0] || null} hasVideo={!!enhancedClassroom?.remoteStreams?.[0]} isTeacher={true} userLabel="Teacher" isCameraOff={false} />
          </div>
        </Card>

      </div>
    </div>;
}