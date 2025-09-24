import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoTile } from "./components/VideoTile";
import { ChevronLeft, ChevronRight, List, Grid, Play, Pause, Clock } from "lucide-react";

interface TeacherClassroomViewProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  enhancedClassroom?: any;
  classTime: number;
}

export function TeacherClassroomView({
  currentUser,
  enhancedClassroom,
  classTime
}: TeacherClassroomViewProps) {
  const [currentSlide, setCurrentSlide] = useState(7);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const totalSlides = 45;

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const slides = [
    { id: 7, title: "Question words", content: "Current slide", status: "current" },
    { id: 8, title: "Vocabulary Introduction", content: "Teacher instructions", status: "upcoming" },
    { id: 9, title: "Practice Activity", content: "Memory game", status: "upcoming" },
    { id: 10, title: "Question Formation", content: "Fill in blanks", status: "upcoming" },
    { id: 11, title: "Speaking Practice", content: "Role play", status: "upcoming" },
    { id: 12, title: "Review", content: "Summary", status: "upcoming" }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex relative">
      {/* Main Content Area */}
      <div className="flex-1 pr-0 pl-4 py-4">
        <Card className="h-full bg-white shadow-2xl rounded-3xl overflow-hidden mr-80">
          {/* Lesson Content - Question Words Visual */}
          <div className="h-full p-2 pr-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative flex items-center justify-center">
            {/* Floating number indicator */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              1
            </div>
            
            {/* Main visual content - Question Words */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-3 gap-8 max-w-4xl">
                {/* Who circle */}
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center shadow-xl transform rotate-[-5deg]">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                        <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-2xl font-bold text-green-800">Who?</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-400 rounded-full animate-bounce"></div>
                </div>

                {/* Question Words Center */}
                <div className="flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-800 mb-2">Question</div>
                      <div className="text-2xl font-bold text-orange-800">words</div>
                    </div>
                  </div>
                </div>

                {/* When circle */}
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center shadow-xl transform rotate-[8deg]">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                        <Clock className="w-8 h-8 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-blue-800">When?</span>
                    </div>
                  </div>
                </div>

                {/* What circle */}
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-red-300 to-pink-400 rounded-full flex items-center justify-center shadow-xl transform rotate-[15deg]">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                        <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                      </div>
                      <span className="text-2xl font-bold text-red-800">What?</span>
                    </div>
                  </div>
                </div>

                {/* Why circle */}
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center shadow-xl transform rotate-[-10deg]">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl">❓</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-800">Why?</span>
                    </div>
                  </div>
                </div>

                {/* Where circle */}
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full flex items-center justify-center shadow-xl transform rotate-[12deg]">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                        <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                      </div>
                      <span className="text-2xl font-bold text-teal-800">Where?</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg"
                onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                disabled={currentSlide === 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <span className="px-4 py-2 bg-white rounded-full shadow-lg font-medium">
                {currentSlide} / {totalSlides}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg"
                onClick={() => setCurrentSlide(Math.min(totalSlides, currentSlide + 1))}
                disabled={currentSlide === totalSlides}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Right Sidebar - Videos and Slides - Fixed to right edge */}
      <div className="fixed top-0 right-0 w-80 h-screen p-4 space-y-4 bg-transparent z-10">
        {/* Video Panels */}
        <Card className="p-4 bg-white shadow-xl rounded-2xl">
          {/* Teacher Video */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Teacher</span>
            </div>
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
              <VideoTile
                stream={enhancedClassroom?.localStream || null}
                hasVideo={!!enhancedClassroom?.localStream}
                isTeacher={true}
                userLabel={currentUser.name}
                isCameraOff={enhancedClassroom?.isCameraOff || false}
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {formatTime(classTime)}
              </div>
            </div>
          </div>

          {/* Student Video */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Student</span>
            </div>
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <VideoTile
                stream={null}
                hasVideo={false}
                isTeacher={false}
                userLabel="Student"
                isCameraOff={false}
              />
            </div>
          </div>
        </Card>

        {/* Slides Panel */}
        <Card className="flex-1 p-4 bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Slides</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Current slide
            </Badge>
            <span className="ml-2">{currentSlide} / {totalSlides}</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  slide.id === currentSlide
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentSlide(slide.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded flex items-center justify-center text-xs font-medium">
                    {slide.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{slide.title}</div>
                    <div className="text-xs text-gray-500 truncate">{slide.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Vocabulary Introduction. Teacher: Say the words and have the student repeat. Focus on pronunciation. Do this several times.</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => {
                // Return to original state functionality
                console.log('Return to original state');
              }}
            >
              Return to original state
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}