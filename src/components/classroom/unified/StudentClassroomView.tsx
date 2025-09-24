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
  const exercises = [
    { id: 1, answer: "played" },
    { id: 2, answer: "play___" },
    { id: 3, answer: "play___" },
    { id: 4, answer: "play___" },
    { id: 5, answer: "play___" },
    { id: 6, answer: "play___" },
    { id: 7, answer: "play" }
  ];

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

  return (
    <div className="h-screen w-full grid grid-cols-[minmax(0,1fr)_minmax(22rem,32rem)] gap-0 p-0 md:gap-2 md:px-2 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className="text-blue-600 bg-blue-50">
          A
        </Badge>
      </div>

      <div className="absolute top-4 center-4 z-10 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-600">{formatTime(classTime)}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full p-2 md:p-4">
        <Card className="w-full h-full bg-white shadow-2xl rounded-3xl md:rounded-r-none overflow-hidden">
          <Tabs value={activeContentTab} onValueChange={setActiveContentTab} className="w-full h-full flex flex-col">
            <div className="px-8 pt-6 pb-2 border-b border-gray-100">
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
              <div className="h-full p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-y-auto">
            
            {/* Main Exercise Content */}
            <div className="flex items-center justify-center h-full">
              <div className="max-w-4xl w-full">
                
                {/* Pronoun Cards - Left Side */}
                <div className="flex flex-col gap-3 w-48 float-left mr-8">
                  {pronouns.map((pronoun) => (
                    <div
                      key={pronoun}
                      draggable
                      onDragStart={(e) => handleDragStart(e, pronoun)}
                      className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-xl text-center font-bold text-lg cursor-move shadow-lg hover:shadow-xl transition-shadow border-2 border-green-600"
                    >
                      {pronoun}
                    </div>
                  ))}
                </div>

                {/* Exercise Area - Center */}
                <div className="flex-1 space-y-4">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center gap-4">
                      {/* Drop zone for pronoun */}
                      <div
                        onDrop={(e) => handleDrop(e, exercise.id)}
                        onDragOver={handleDragOver}
                        className={`w-32 h-12 border-2 border-dashed rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${
                          selectedAnswers[exercise.id] 
                            ? 'bg-green-100 border-green-400 text-green-800' 
                            : 'border-gray-300 bg-gray-50 text-gray-400'
                        }`}
                      >
                        {selectedAnswers[exercise.id] || "Drop here"}
                      </div>

                      {/* Exercise text */}
                      <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-xl font-bold text-lg shadow-lg min-w-32 text-center border-2 border-purple-600">
                        {exercise.answer}
                      </div>
                    </div>
                  ))}

                  {/* Completion word */}
                  <div className="flex justify-center mt-8">
                    <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white p-6 rounded-xl font-bold text-2xl shadow-xl border-2 border-orange-600">
                      yesterday.
                    </div>
                  </div>
                </div>

                {/* Feedback thumbs up */}
                <div className="absolute top-1/2 right-16 transform -translate-y-1/2">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                    <ThumbsUp className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>

                {/* Progress bar at bottom */}
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-sm" style={{ width: '65%' }}></div>
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
      </div>

      {/* Right Sidebar - Videos */}
      <div className="w-full h-full p-2 md:p-4">
        <Card className="w-full h-full p-3 md:p-4 bg-white shadow-xl rounded-2xl md:rounded-l-none flex flex-col">
          {/* Student Video - Top */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">You</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
              <VideoTile
                stream={enhancedClassroom?.localStream || null}
                hasVideo={!!enhancedClassroom?.localStream}
                isTeacher={false}
                userLabel={currentUser.name}
                isCameraOff={enhancedClassroom?.isCameraOff || false}
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {formatTime(classTime)}
              </div>
            </div>
          </div>

          {/* Teacher Video - Bottom */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Teacher</span>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="h-full bg-gray-100 rounded-xl overflow-hidden">
              <VideoTile
                stream={null}
                hasVideo={false}
                isTeacher={true}
                userLabel="Teacher"
                isCameraOff={false}
              />
            </div>
          </div>

          {/* XP Display */}
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-yellow-700">{studentXP} XP</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}