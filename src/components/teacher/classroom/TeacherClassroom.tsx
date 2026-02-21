import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useClassroomSync } from "@/hooks/useClassroomSync";
import { useAuth } from "@/contexts/AuthContext";
import { useScreenShare } from "@/hooks/useScreenShare";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { useStudentContext } from "@/hooks/useStudentContext";
import { ClassroomTopBar } from "./ClassroomTopBar";
import { CommunicationZone } from "./CommunicationZone";
import { CenterStage } from "./CenterStage";
import { SlideNavigator } from "./SlideNavigator";
import { DiceRoller } from "./DiceRoller";
import { StarCelebration } from "./StarCelebration";
import { EmbedLinkDialog } from "./EmbedLinkDialog";
import { FloatingCoPilot } from "@/components/classroom/FloatingCoPilot";
import { ZenModeOverlay } from "@/components/classroom/ZenModeOverlay";
import { PictureInPicture } from "@/components/classroom/PictureInPicture";
import { LessonWrapUpDialog } from "@/components/classroom/LessonWrapUpDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";
import { useIdleOpacity } from "@/hooks/useIdleOpacity";
import { useClassroomTimer } from "@/hooks/classroom/useClassroomTimer";
import { useSmartTimer } from "@/hooks/classroom/useSmartTimer";

interface TeacherClassroomProps {
  classId?: string;
  studentName?: string;
  studentId?: string;
  lessonTitle?: string;
  lessonId?: string;
  teacherName?: string;
}

export const TeacherClassroom: React.FC<TeacherClassroomProps> = ({
  classId = "101",
  studentName = "Emma",
  studentId,
  lessonTitle = "Magic Forest: Lesson 1",
  lessonId,
  teacherName = "Teacher"
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const media = useLocalMedia();
  const [participantCount, setParticipantCount] = useState(2);
  const [activeTool, setActiveTool] = useState('pointer');
  const [activeColor, setActiveColor] = useState('#FF6B6B');
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [diceDialogOpen, setDiceDialogOpen] = useState(false);
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(60);
  const [wrapUpOpen, setWrapUpOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [zenElapsed, setZenElapsed] = useState(0);

  // Star celebration state
  const [studentStars, setStudentStars] = useState(0);
  const [showStarCelebration, setShowStarCelebration] = useState(false);
  const [isMilestone, setIsMilestone] = useState(false);

  // Embed link state
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [embeddedUrl, setEmbeddedUrl] = useState<string | null>(null);

  // Smart timer for Professional Buffer
  const sessionDuration: 25 | 55 = 25; // TODO: derive from booking data
  const { classTime } = useClassroomTimer();
  const smartTimer = useSmartTimer(classTime, sessionDuration);
  const wrapUpAutoOpenedRef = React.useRef(false);

  // Auto-hide for top bar and sidebars
  const topBarIdle = useIdleOpacity({ idleTimeout: 3000, idleOpacity: 0.4 });
  const sidebarIdle = useIdleOpacity({ idleTimeout: 4000, idleOpacity: 0.3 });

  // Context Handshake
  const { context: studentContext } = useStudentContext(studentId);

  const roomName = `MySchool_Class_${classId}`;

  const slides = [
    { id: '1', title: 'Welcome to the Lesson' },
    { id: '2', title: 'Vocabulary: Animals' },
    { id: '3', title: 'Practice: Matching Game' },
    { id: '4', title: 'Sentence Building' },
    { id: '5', title: 'Speaking Practice' },
    { id: '6', title: 'Quiz Time!' },
    { id: '7', title: 'Great Job! Summary' },
  ];

  const {
    currentSlide,
    studentCanDraw,
    isConnected,
    strokes,
    sharedNotes,
    sessionContext,
    activeCanvasTab,
    updateSlide,
    updateTool,
    setStudentCanDraw,
    endSession,
    addStroke,
    clearCanvas,
    updateSharedDisplay,
    updateSharedNotes,
    updateSessionContext,
    updateCanvasTab
  } = useClassroomSync({
    roomId: roomName,
    userId: user?.id || (() => {
      const stored = sessionStorage.getItem('demo-teacher-id');
      if (stored) return stored;
      const id = crypto.randomUUID();
      sessionStorage.setItem('demo-teacher-id', id);
      return id;
    })(),
    userName: teacherName,
    role: 'teacher',
    lessonData: { title: lessonTitle, slides }
  });

  // Save student context to session when available
  useEffect(() => {
    if (studentContext && isConnected) {
      updateSessionContext({
        studentName: studentContext.studentName,
        level: studentContext.level,
        cefrLevel: studentContext.cefrLevel,
        lastMistake: studentContext.lastMistake,
        interests: studentContext.interests,
        mistakeHistory: studentContext.mistakeHistory,
        summary: studentContext.summary
      });
    }
  }, [studentContext, isConnected]);

  // Screen share hook
  const {
    isSharing: isScreenSharing,
    stream: screenShareStream,
    startScreenShare,
    stopScreenShare
  } = useScreenShare({
    onStreamStart: () => toast({ title: "Screen Sharing Started", description: "Your screen is now visible to students", className: "bg-indigo-900 border-indigo-700" }),
    onStreamEnd: () => toast({ title: "Screen Sharing Stopped", description: "Screen sharing has ended" }),
    onError: (error) => toast({ title: "Screen Share Error", description: error.message, variant: "destructive" })
  });

  // Zen mode keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setIsZenMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-open wrap-up dialog at urgent phase
  useEffect(() => {
    if (smartTimer.shouldPulseWrapUp && !wrapUpAutoOpenedRef.current && !wrapUpOpen) {
      wrapUpAutoOpenedRef.current = true;
      setWrapUpOpen(true);
    }
  }, [smartTimer.shouldPulseWrapUp, wrapUpOpen]);

  // Zen mode elapsed timer
  useEffect(() => {
    if (!isZenMode) return;
    const interval = setInterval(() => setZenElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isZenMode]);

  const handleEndClass = useCallback(async () => {
    await endSession();
    toast({ title: "Class Ended", description: "The class session has been ended." });
    navigate('/admin');
  }, [navigate, toast, endSession]);

  useEffect(() => { media.join(); return () => { media.leave(); }; }, []);

  const toggleMute = useCallback(() => { media.toggleMicrophone(); }, [media]);
  const toggleCamera = useCallback(() => { media.toggleCamera(); }, [media]);

  const handleGiveStar = useCallback(async () => {
    const newStarCount = studentStars + 1;
    setStudentStars(newStarCount);
    const milestone = newStarCount % 5 === 0;
    setIsMilestone(milestone);
    setShowStarCelebration(true);
    await updateSharedDisplay({ starCount: newStarCount, showStarCelebration: true, isMilestone: milestone });
    setTimeout(async () => { await updateSharedDisplay({ showStarCelebration: false }); }, milestone ? 6500 : 3500);
  }, [studentStars, updateSharedDisplay]);

  const handleOpenTimer = useCallback(() => { setTimerDialogOpen(true); }, []);
  const handleRollDice = useCallback(() => { setDiceDialogOpen(true); }, []);
  const handleSendSticker = useCallback(() => { toast({ title: "😊 Sticker Sent!", description: "Sticker sent to the student's screen" }); }, [toast]);

  const handleToggleStudentDrawing = useCallback(async () => {
    await setStudentCanDraw(!studentCanDraw);
    toast({
      title: studentCanDraw ? "Drawing Disabled" : "Drawing Enabled",
      description: studentCanDraw ? "Students can no longer draw on the canvas" : "Students can now draw on the shared canvas!",
      className: studentCanDraw ? "" : "bg-green-900 border-green-700",
    });
  }, [studentCanDraw, setStudentCanDraw, toast]);

  const handleShareScreen = useCallback(async () => { await startScreenShare('screen'); await updateSharedDisplay({ isScreenSharing: true }); }, [startScreenShare, updateSharedDisplay]);
  const handleStopScreenShare = useCallback(async () => { stopScreenShare(); await updateSharedDisplay({ isScreenSharing: false }); }, [stopScreenShare, updateSharedDisplay]);
  const handleEmbedLink = useCallback(() => { setEmbedDialogOpen(true); }, []);

  const handleEmbed = useCallback(async (url: string) => {
    setEmbeddedUrl(url);
    await updateSharedDisplay({ embeddedUrl: url });
    await updateCanvasTab('web');
    toast({ title: "Content Embedded", description: "External content is now visible to students", className: "bg-teal-900 border-teal-700" });
  }, [toast, updateSharedDisplay, updateCanvasTab]);

  const handleCloseEmbed = useCallback(async () => {
    setEmbeddedUrl(null);
    await updateSharedDisplay({ embeddedUrl: null });
    await updateCanvasTab('slides');
  }, [updateSharedDisplay, updateCanvasTab]);

  const handlePrevSlide = useCallback(async () => { await updateSlide(Math.max(0, currentSlide - 1)); }, [currentSlide, updateSlide]);
  const handleNextSlide = useCallback(async () => { await updateSlide(Math.min(slides.length - 1, currentSlide + 1)); }, [currentSlide, slides.length, updateSlide]);
  const handleSlideSelect = useCallback(async (index: number) => { await updateSlide(index); }, [updateSlide]);

  const handleToolChange = useCallback(async (tool: string) => {
    setActiveTool(tool);
    await updateTool(tool);
  }, [updateTool]);

  const handleClearCanvas = useCallback(async () => {
    await clearCanvas();
    toast({ title: "Canvas Cleared", description: "The whiteboard has been cleared." });
  }, [clearCanvas, toast]);

  const handleCanvasTabChange = useCallback(async (tab: string) => {
    await updateCanvasTab(tab);
  }, [updateCanvasTab]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue(prev => {
          if (prev <= 1) { setTimerRunning(false); toast({ title: "⏰ Time's Up!", description: "The timer has finished." }); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerValue, toast]);

  const startTimer = () => { setTimerValue(timerSeconds); setTimerRunning(true); };
  const resetTimer = () => { setTimerRunning(false); setTimerValue(timerSeconds); };

  return (
    <div className="h-screen w-full bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      {/* Star Celebration Overlay */}
      <StarCelebration
        isVisible={showStarCelebration}
        starCount={studentStars}
        studentName={studentName}
        isMilestone={isMilestone}
        onComplete={() => setShowStarCelebration(false)}
      />

      {/* Zen Mode Overlay */}
      <AnimatePresence>
        {isZenMode && (
          <>
            <ZenModeOverlay
              elapsed={zenElapsed}
              isMuted={media.isMuted}
              isCameraOff={media.isCameraOff}
              onToggleMute={toggleMute}
              onToggleCamera={toggleCamera}
              onExitZen={() => setIsZenMode(false)}
            />
            <PictureInPicture
              name={studentName || 'Student'}
              isConnected={isConnected}
            />
          </>
        )}
      </AnimatePresence>

      {/* Top Control Bar (hidden in Zen) */}
      {!isZenMode && (
        <div style={topBarIdle.style} onMouseMove={topBarIdle.onMouseMove} onMouseEnter={topBarIdle.onMouseEnter}>
          <ClassroomTopBar
            lessonTitle={lessonTitle}
            roomName={roomName}
            participantCount={participantCount}
            isMuted={media.isMuted}
            isCameraOff={media.isCameraOff}
            onToggleMute={toggleMute}
            onToggleCamera={toggleCamera}
            onEndClass={handleEndClass}
            onOpenWrapUp={() => setWrapUpOpen(true)}
            studentStars={studentStars}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode(!isZenMode)}
            shouldPulseWrapUp={smartTimer.shouldPulseWrapUp}
            elapsedSeconds={classTime}
            sessionDuration={sessionDuration}
          />
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Communication Zone */}
        {!isZenMode && (
          <div style={sidebarIdle.style} onMouseMove={sidebarIdle.onMouseMove} onMouseEnter={sidebarIdle.onMouseEnter}>
            <CommunicationZone
              studentName={studentName}
              teacherName={teacherName}
              onGiveStar={handleGiveStar}
              onOpenTimer={handleOpenTimer}
              onRollDice={handleRollDice}
              onSendSticker={handleSendSticker}
              studentCanDraw={studentCanDraw}
              onToggleStudentDrawing={handleToggleStudentDrawing}
              onShareScreen={handleShareScreen}
              onEmbedLink={handleEmbedLink}
              isScreenSharing={isScreenSharing}
              onStopScreenShare={handleStopScreenShare}
              screenShareStream={screenShareStream}
              localStream={media.stream}
              isVideoConnected={media.isConnected}
              isLocalCameraOff={media.isCameraOff}
            />
          </div>
        )}

        {/* Center: Main Stage with Tabbed Canvas */}
        <div className="flex-1 relative">
          <CenterStage
            slides={slides}
            currentSlideIndex={currentSlide}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
            activeTool={activeTool}
            onToolChange={handleToolChange}
            activeColor={activeColor}
            onColorChange={setActiveColor}
            strokes={strokes}
            roomId={roomName}
            userId={user?.id || sessionStorage.getItem('demo-teacher-id') || crypto.randomUUID()}
            userName={teacherName}
            onAddStroke={addStroke}
            onClearCanvas={handleClearCanvas}
            activeCanvasTab={activeCanvasTab}
            onCanvasTabChange={handleCanvasTabChange}
            embeddedUrl={embeddedUrl}
            onCloseEmbed={handleCloseEmbed}
            sessionContext={sessionContext}
          />
        </div>

        {/* Right: Slide Navigator */}
        {!isZenMode && (
          <div style={sidebarIdle.style} onMouseMove={sidebarIdle.onMouseMove} onMouseEnter={sidebarIdle.onMouseEnter}>
            <SlideNavigator
              slides={slides}
              currentSlideIndex={currentSlide}
              onSlideSelect={handleSlideSelect}
              lessonTitle={lessonTitle}
              isCollapsed={rightSidebarCollapsed}
              onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            />
          </div>
        )}
      </div>

      {/* Floating AI Co-Pilot (hidden in Zen) */}
      {!isZenMode && (
        <FloatingCoPilot
          lessonTitle={lessonTitle}
          isTeacher={true}
          sharedNotes={sharedNotes}
          sessionContext={sessionContext}
          onNotesChange={updateSharedNotes}
          roomId={roomName}
          userId={user?.id || sessionStorage.getItem('demo-teacher-id') || ''}
          userName={teacherName}
        />
      )}

      {/* Lesson Wrap-Up Dialog */}
      <LessonWrapUpDialog
        open={wrapUpOpen}
        onOpenChange={setWrapUpOpen}
        lessonId={lessonId}
        studentId={studentId}
        teacherId={user?.id}
        sharedNotes={sharedNotes}
      />

      {/* Dice Roller Dialog */}
      <DiceRoller open={diceDialogOpen} onOpenChange={setDiceDialogOpen} />

      {/* Embed Link Dialog */}
      <EmbedLinkDialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen} onEmbed={handleEmbed} />

      {/* Timer Dialog */}
      <Dialog open={timerDialogOpen} onOpenChange={setTimerDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">Activity Timer</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 gap-4">
            <div className="text-6xl font-mono font-bold text-blue-400">
              {Math.floor(timerValue / 60).toString().padStart(2, '0')}:
              {(timerValue % 60).toString().padStart(2, '0')}
            </div>
            {!timerRunning && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Set time (seconds):</span>
                <Input
                  type="number"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Math.max(1, parseInt(e.target.value) || 60))}
                  className="w-20 bg-gray-800 border-gray-700 text-center"
                  min={1}
                />
              </div>
            )}
            <div className="flex gap-2">
              {!timerRunning ? (
                <Button onClick={startTimer} className="bg-blue-600 hover:bg-blue-700">Start Timer</Button>
              ) : (
                <>
                  <Button onClick={() => setTimerRunning(false)} variant="outline" className="border-gray-700">Pause</Button>
                  <Button onClick={resetTimer} variant="destructive">Reset</Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
