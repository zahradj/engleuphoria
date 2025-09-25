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
  const handleDrop = (e: React.DragEvent, answer: string) => {
    e.preventDefault();
    const question = e.dataTransfer.getData("text/plain");
    setSelectedAnswers(prev => ({
      ...prev,
      [answer]: question
    }));
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  return <div className="h-screen w-full bg-classroom-background relative">
      {/* Clean header with time and XP only */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        
      </div>

      {/* XP Display - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        
      </div>

      {/* Two-column layout: Material + Teacher */}
      <div className="h-full grid grid-cols-[1fr_400px] gap-4 p-4 pt-4">{/* Content positioned directly under fixed header */}
        {/* Left: Learning Material */}
        <Card className="h-full bg-classroom-card shadow-xl rounded-3xl overflow-hidden border-2 border-[hsl(var(--classroom-primary)/0.3)]">
          <Tabs value={activeContentTab} className="w-full h-full flex flex-col">
            <div className="px-8 pt-6 pb-2 border-b border-classroom-border/60">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="slides" className="flex items-center gap-2" onClick={() => setActiveContentTab("slides")}>
                  <FileText size={16} />
                  <span>Slides</span>
                </TabsTrigger>
                <TabsTrigger value="whiteboard" className="flex items-center gap-2" onClick={() => setActiveContentTab("whiteboard")}>
                  <PenTool size={16} />
                  <span>Whiteboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="slides" className="flex-1 m-0">
              <div className="h-full p-8">
                <Card className="h-full p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
                  <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Current Lesson</h3>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Question Words</h2>
                    <p className="text-gray-600 mb-6">Learn how to ask questions using: What, Where, When, Who, Why, How</p>
                    
                    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                      <h4 className="font-semibold mb-3 text-gray-800">Drag and Drop Exercise</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Questions:</h5>
                          {["What is your name?", "Where do you live?", "When is your birthday?"].map((question, i) => (
                            <div key={i} className="p-2 bg-blue-100 rounded text-sm text-center cursor-move"
                                 draggable
                                 onDragStart={(e) => handleDragStart(e, question)}>
                              {question}
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Answers:</h5>
                          {["My name is...", "I live in...", "My birthday is..."].map((answer, i) => (
                            <div key={i} className="p-2 border-2 border-dashed border-gray-300 rounded text-sm text-center min-h-[2.5rem] flex items-center justify-center"
                                 onDrop={(e) => handleDrop(e, answer)}
                                 onDragOver={handleDragOver}>
                              {selectedAnswers[answer] || "Drop here"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
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
        <Card className="h-full bg-classroom-card shadow-xl rounded-2xl p-4 flex flex-col border-2 border-[hsl(var(--classroom-secondary)/0.3)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-[hsl(var(--classroom-primary))] rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold" style={{ color: 'hsl(var(--classroom-primary))' }}>Teacher</span>
          </div>
          
          <div className="flex-1 bg-classroom-background rounded-xl overflow-hidden border-2 border-[hsl(var(--classroom-primary)/0.3)] shadow-inner">
            <VideoTile stream={enhancedClassroom?.remoteStreams?.[0] || null} hasVideo={!!enhancedClassroom?.remoteStreams?.[0]} isTeacher={true} userLabel="Teacher" isCameraOff={false} />
          </div>
        </Card>

      </div>
    </div>;
}