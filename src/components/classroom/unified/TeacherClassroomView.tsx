import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoTile } from "./components/VideoTile";
import { ESLWhiteboard } from "@/components/classroom/ESLWhiteboard";
import { ChevronLeft, ChevronRight, List, Grid, Play, Pause, Clock, Volume2, VolumeX, Camera, CameraOff, Mic, MicOff, FileText, PenTool } from "lucide-react";

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
  const [isPresenting, setIsPresenting] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState("slides");
  const [videoControls, setVideoControls] = useState({
    teacherMuted: false,
    teacherCameraOff: false,
    studentMuted: false,
    studentCameraOff: false
  });
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

  // Auto-advance slides effect
  useEffect(() => {
    if (isPresenting) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => prev < totalSlides ? prev + 1 : prev);
      }, 30000); // 30 seconds per slide
      return () => clearInterval(interval);
    }
  }, [isPresenting, totalSlides]);

  return (
    <div className="min-h-screen w-full grid grid-cols-[minmax(0,1fr)_minmax(24rem,36rem)] gap-0 p-0 md:gap-2 md:px-2 relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-100/30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-1000" />
      
      {/* Enhanced Status Bar */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <Card className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-blue-200/50 shadow-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-green-700">Live Session</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>{formatTime(classTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isPresenting ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPresenting(!isPresenting)}
                className="h-7 px-3 text-xs"
              >
                {isPresenting ? <Pause size={12} /> : <Play size={12} />}
                {isPresenting ? 'Pause' : 'Present'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Main Content Area with Tabs */}
      <div className="z-10 relative w-full min-h-full">
        <Card className="w-full min-h-full bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl md:rounded-r-none border border-blue-200/30 transition-all duration-500 hover:shadow-3xl">
          <Tabs value={activeContentTab} onValueChange={setActiveContentTab} className="w-full h-full flex flex-col">
            <div className="px-6 pt-6 pb-2 border-b border-gray-100">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="slides" className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Slides</span>
                </TabsTrigger>
                <TabsTrigger value="whiteboard" className="flex items-center gap-2">
                  <PenTool size={16} />
                  <span>Whiteboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="slides" className="flex-1 m-0 overflow-y-auto">
              <div className="h-full flex items-center justify-center px-6 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-y-auto">
          {/* Lesson Content - Enhanced Question Words Visual */}
          <div className="h-full px-6 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative flex items-center justify-center overflow-hidden">
            {/* Enhanced floating number indicator */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-xl transform hover:scale-110 transition-all duration-300 animate-fade-in">
              <span className="animate-pulse">{currentSlide}</span>
            </div>
            
            {/* Slide progress indicator */}
            <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
              <span className="text-sm font-medium text-gray-700">{currentSlide} / {totalSlides}</span>
            </div>
            
            {/* Enhanced Main visual content - Question Words */}
            <div className="w-full h-full flex items-start justify-center relative pt-8">
              <div className="grid grid-cols-3 gap-8 w-full max-w-4xl place-items-center animate-fade-in mx-auto">
                {/* Who circle - Enhanced */}
                <div className="relative group">
                  <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl transform rotate-[-5deg] transition-all duration-500 group-hover:rotate-0 group-hover:scale-110">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                        <div className="w-8 h-8 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-2xl font-bold text-green-800">Who?</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                </div>

                {/* Enhanced Question Words Center */}
                <div className="flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-800 mb-2 animate-bounce">Question</div>
                      <div className="text-2xl font-bold text-orange-800">words</div>
                      <div className="mt-2 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-orange-800 rounded-full animate-ping"></div>
                        <div className="w-2 h-2 bg-orange-800 rounded-full animate-ping animation-delay-200"></div>
                        <div className="w-2 h-2 bg-orange-800 rounded-full animate-ping animation-delay-400"></div>
                      </div>
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
      
      {/* Video and Slides Column */}
      <div className="h-full flex flex-col gap-2 md:gap-4 z-10 p-2 md:p-0">
        {/* Enhanced Video Panels */}
        <Card className="p-4 md:p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl md:rounded-l-none border border-blue-200/30 animate-fade-in">
          {/* Enhanced Teacher Video */}
          <div className="mb-6 relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-base font-medium text-gray-700">Teacher</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setVideoControls(prev => ({ ...prev, teacherMuted: !prev.teacherMuted }))}
                >
                  {videoControls.teacherMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setVideoControls(prev => ({ ...prev, teacherCameraOff: !prev.teacherCameraOff }))}
                >
                  {videoControls.teacherCameraOff ? <CameraOff size={16} /> : <Camera size={16} />}
                </Button>
              </div>
            </div>
            <div className="aspect-[16/9] w-full bg-gray-900 rounded-xl overflow-hidden relative border-2 border-green-500/30 transition-all duration-300 hover:border-green-500/60">
              <VideoTile
                stream={enhancedClassroom?.localStream || null}
                hasVideo={!!enhancedClassroom?.localStream}
                isTeacher={true}
                userLabel={currentUser.name}
                isCameraOff={enhancedClassroom?.isCameraOff || videoControls.teacherCameraOff}
              />
              <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded backdrop-blur-sm">
                {formatTime(classTime)}
              </div>
              {/* Enhanced video status indicators */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                {videoControls.teacherMuted && (
                  <div className="bg-red-500 text-white p-2 rounded-full">
                    <MicOff size={14} />
                  </div>
                )}
                {videoControls.teacherCameraOff && (
                  <div className="bg-gray-500 text-white p-2 rounded-full">
                    <CameraOff size={14} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Student Video */}
          <div className="relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-base font-medium text-gray-700">Student</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setVideoControls(prev => ({ ...prev, studentMuted: !prev.studentMuted }))}
                >
                  {videoControls.studentMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setVideoControls(prev => ({ ...prev, studentCameraOff: !prev.studentCameraOff }))}
                >
                  {videoControls.studentCameraOff ? <CameraOff size={16} /> : <Camera size={16} />}
                </Button>
              </div>
            </div>
            <div className="aspect-[16/9] w-full bg-gray-100 rounded-xl overflow-hidden border-2 border-blue-500/30 transition-all duration-300 hover:border-blue-500/60 relative">
              <VideoTile
                stream={null}
                hasVideo={false}
                isTeacher={false}
                userLabel="Student"
                isCameraOff={videoControls.studentCameraOff}
              />
              {/* Student video status indicators */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                {videoControls.studentMuted && (
                  <div className="bg-red-500 text-white p-2 rounded-full">
                    <MicOff size={14} />
                  </div>
                )}
                {videoControls.studentCameraOff && (
                  <div className="bg-gray-500 text-white p-2 rounded-full">
                    <CameraOff size={14} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Slides Panel */}
        <Card className="flex-1 p-3 md:p-4 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl md:rounded-l-none border border-blue-200/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Slides
            </h3>
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