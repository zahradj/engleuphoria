import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoTile } from "./components/VideoTile";
import { ESLWhiteboard } from "@/components/classroom/ESLWhiteboard";
import { LessonRenderer } from "./library/LessonRenderer";
import { AnnotationToolbar } from "@/components/classroom/teaching-material/AnnotationToolbar";
import { AnnotationCanvas } from "@/components/classroom/teaching-material/AnnotationCanvas";
import { ChevronLeft, ChevronRight, List, Grid, Play, Pause, Clock, Volume2, VolumeX, Camera, CameraOff, Mic, MicOff, FileText, PenTool, Sparkles } from "lucide-react";

interface TeacherClassroomViewProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  enhancedClassroom?: any;
  classTime: number;
  activeLesson?: {
    moduleNumber: number;
    lessonNumber: number;
    studentId: string;
  } | null;
  onLessonComplete?: (moduleNumber: number, lessonNumber: number, studentId: string) => void;
}

export function TeacherClassroomView({
  currentUser,
  enhancedClassroom,
  classTime,
  activeLesson,
  onLessonComplete
}: TeacherClassroomViewProps) {
  console.log('TeacherClassroomView activeLesson prop:', activeLesson);
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

// Annotations
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [annotationTool, setAnnotationTool] = useState<"pen" | "eraser" | "rectangle" | "circle">("pen");
  const [annotationColor, setAnnotationColor] = useState<string>("#9B87F5");
  const { canvasElement, clearCanvas: clearAnnotations, saveAnnotations, loadAnnotations } = AnnotationCanvas({
    isAnnotationMode,
    annotationTool,
    color: annotationColor,
    currentPage: 1,
    totalPages: 1
  });

  const totalSlides = 45;

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const slides = [{
    id: 7,
    title: "Question words",
    content: "Current slide",
    status: "current"
  }, {
    id: 8,
    title: "Vocabulary Introduction",
    content: "Teacher instructions",
    status: "upcoming"
  }, {
    id: 9,
    title: "Practice Activity",
    content: "Memory game",
    status: "upcoming"
  }, {
    id: 10,
    title: "Question Formation",
    content: "Fill in blanks",
    status: "upcoming"
  }, {
    id: 11,
    title: "Speaking Practice",
    content: "Role play",
    status: "upcoming"
  }, {
    id: 12,
    title: "Review",
    content: "Summary",
    status: "upcoming"
  }];

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
    <div className="min-h-screen w-full grid grid-cols-[minmax(0,1fr)_minmax(24rem,36rem)] gap-0 p-0 md:gap-3 md:px-3 relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/30 to-purple-100/40 backdrop-blur-sm pointer-events-none" />
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl"
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Enhanced Status Bar with Glassmorphism */}
      <motion.div 
        className="absolute top-6 right-6 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center gap-4 text-sm">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded-full">Live Session</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-slate-600 bg-slate-100/50 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Clock size={14} />
              <span className="font-medium">{formatTime(classTime)}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant={isPresenting ? "default" : "outline"} 
                size="sm" 
                onClick={() => setIsPresenting(!isPresenting)} 
                className="h-8 px-4 text-xs bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/40 transition-all duration-300"
              >
                {isPresenting ? <Pause size={12} className="mr-1" /> : <Play size={12} className="mr-1" />}
                {isPresenting ? 'Pause' : 'Present'}
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
      
      {/* Enhanced Main Content Area with Modern Design */}
      <motion.div 
        className="z-10 relative w-full min-h-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="w-full min-h-full bg-white/25 backdrop-blur-xl shadow-2xl rounded-3xl md:rounded-r-none border border-white/20 transition-all duration-500 hover:shadow-3xl hover:bg-white/30">
          <Tabs value={activeContentTab} className="w-full h-full flex flex-col">
            <motion.div 
              className="px-6 pt-6 pb-2 border-b border-white/20"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-md border border-white/30">
                <TabsTrigger 
                  value="slides" 
                  className="flex items-center gap-2 data-[state=active]:bg-white/40 data-[state=active]:text-slate-700 transition-all duration-300" 
                  onClick={() => setActiveContentTab("slides")}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FileText size={16} />
                  </motion.div>
                  <span>Slides</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="whiteboard" 
                  className="flex items-center gap-2 data-[state=active]:bg-white/40 data-[state=active]:text-slate-700 transition-all duration-300" 
                  onClick={() => setActiveContentTab("whiteboard")}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <PenTool size={16} />
                  </motion.div>
                  <span>Whiteboard</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>
            
            <TabsContent value="slides" className="flex-1 m-0">
              <div className="h-full p-6">
                {/* Show active lesson or default slides */}
                {activeLesson ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-6 h-6 text-purple-500" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Module {activeLesson.moduleNumber}, Lesson {activeLesson.lessonNumber}
                          </h3>
                          <p className="text-sm text-slate-600">Interactive ESL Lesson</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant={isAnnotationMode ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setIsAnnotationMode(!isAnnotationMode)}
                          className="bg-white/30 backdrop-blur-sm border-white/30"
                        >
                          {isAnnotationMode ? 'Stop Annotating' : 'Annotate'}
                        </Button>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                            Live Lesson
                          </Badge>
                        </motion.div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="relative h-[calc(100%-6rem)] bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {isAnnotationMode && (
                        <div className="absolute top-2 left-2 z-20">
                          <AnnotationToolbar
                            annotationTool={annotationTool}
                            setAnnotationTool={setAnnotationTool}
                            color={annotationColor}
                            setColor={setAnnotationColor}
                            onClearAnnotations={clearAnnotations}
                            onSaveAnnotations={saveAnnotations}
                            onLoadAnnotations={loadAnnotations}
                          />
                        </div>
                      )}
                      <div className="relative w-full h-full">
                        <LessonRenderer
                          moduleNumber={activeLesson.moduleNumber}
                          lessonNumber={activeLesson.lessonNumber}
                          studentId={activeLesson.studentId}
                          onComplete={(data) => {
                            onLessonComplete?.(activeLesson.moduleNumber, activeLesson.lessonNumber, activeLesson.studentId);
                          }}
                          mode="fullscreen"
                        />
                        {canvasElement}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-slate-800">Lesson Slides</h3>
                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))} className="bg-white/30 backdrop-blur-sm border-white/30">
                            <ChevronLeft size={16} />
                          </Button>
                        </motion.div>
                        <span className="text-sm text-slate-600 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                          {currentSlide} / {totalSlides}
                        </span>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" onClick={() => setCurrentSlide(Math.min(totalSlides, currentSlide + 1))} className="bg-white/30 backdrop-blur-sm border-white/30">
                            <ChevronRight size={16} />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="grid gap-3 h-full overflow-y-auto">
                      {slides.map((slide, index) => (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className={`p-4 cursor-pointer transition-all duration-300 backdrop-blur-sm border-white/30 ${
                            slide.status === 'current' 
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20' 
                              : 'bg-white/20 hover:bg-white/30 hover:border-blue-400/30 hover:shadow-md'
                          }`} onClick={() => setCurrentSlide(slide.id)}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-800">{slide.title}</h4>
                                <p className="text-sm text-slate-600">{slide.content}</p>
                              </div>
                              <Badge variant={slide.status === 'current' ? 'default' : 'secondary'} className={
                                slide.status === 'current' 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                                  : 'bg-white/40 backdrop-blur-sm'
                              }>
                                {slide.status}
                              </Badge>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="whiteboard" className="flex-1 m-0">
              <div className="h-full">
                <ESLWhiteboard className="h-full" isCollaborative={true} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
      
      {/* Enhanced Video Column with Modern Design */}
      <motion.div 
        className="h-full flex flex-col gap-3 md:gap-4 z-10 p-2 md:p-0"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Modern Video Panels with Glassmorphism */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 md:p-6 bg-white/25 backdrop-blur-xl shadow-2xl rounded-2xl md:rounded-l-none border border-white/20 hover:bg-white/30 transition-all duration-500">
            {/* Enhanced Teacher Video */}
            <div className="mb-6 relative group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-base font-medium text-gray-700">Teacher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setVideoControls(prev => ({
                    ...prev,
                    teacherMuted: !prev.teacherMuted
                  }))}>
                    {videoControls.teacherMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setVideoControls(prev => ({
                    ...prev,
                    teacherCameraOff: !prev.teacherCameraOff
                  }))}>
                    {videoControls.teacherCameraOff ? <CameraOff size={16} /> : <Camera size={16} />}
                  </Button>
                </div>
              </div>
              <div className="aspect-[16/9] w-full bg-gray-900 rounded-xl overflow-hidden relative border-2 border-green-500/30 transition-all duration-300 hover:border-green-500/60">
                <VideoTile stream={enhancedClassroom?.localStream || null} hasVideo={!!enhancedClassroom?.localStream} isTeacher={true} userLabel={currentUser.name} isCameraOff={enhancedClassroom?.isCameraOff || videoControls.teacherCameraOff} />
                <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded backdrop-blur-sm">
                  {formatTime(classTime)}
                </div>
                {/* Enhanced video status indicators */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {videoControls.teacherMuted && <div className="bg-red-500 text-white p-2 rounded-full">
                      <MicOff size={14} />
                    </div>}
                  {videoControls.teacherCameraOff && <div className="bg-gray-500 text-white p-2 rounded-full">
                      <CameraOff size={14} />
                    </div>}
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
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setVideoControls(prev => ({
                    ...prev,
                    studentMuted: !prev.studentMuted
                  }))}>
                    {videoControls.studentMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setVideoControls(prev => ({
                    ...prev,
                    studentCameraOff: !prev.studentCameraOff
                  }))}>
                    {videoControls.studentCameraOff ? <CameraOff size={16} /> : <Camera size={16} />}
                  </Button>
                </div>
              </div>
              <div className="aspect-[16/9] w-full bg-gray-100 rounded-xl overflow-hidden border-2 border-blue-500/30 transition-all duration-300 hover:border-blue-500/60 relative">
                <VideoTile stream={null} hasVideo={false} isTeacher={false} userLabel="Student" isCameraOff={videoControls.studentCameraOff} />
                {/* Student video status indicators */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {videoControls.studentMuted && <div className="bg-red-500 text-white p-2 rounded-full">
                      <MicOff size={14} />
                    </div>}
                  {videoControls.studentCameraOff && <div className="bg-gray-500 text-white p-2 rounded-full">
                      <CameraOff size={14} />
                    </div>}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}