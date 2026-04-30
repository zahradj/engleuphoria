import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useClassroomSync } from "@/hooks/useClassroomSync";
import { useAuth } from "@/contexts/AuthContext";
import { useScreenShare } from "@/hooks/useScreenShare";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { useStudentContext } from "@/hooks/useStudentContext";
import { useWebRTCConnection } from "@/hooks/useWebRTCConnection";
import { ClassroomTopBar } from "./ClassroomTopBar";
import { CommunicationZone } from "./CommunicationZone";
import { MainStage } from "@/components/classroom/stage/MainStage";
import { TeacherControlDock } from "@/components/classroom/stage/TeacherControlDock";
import { SlideNavigator } from "./SlideNavigator";
import { DiceRoller } from "./DiceRoller";
import { StarCelebration } from "./StarCelebration";
import { EmbedLinkDialog } from "./EmbedLinkDialog";
import { AIGameGeneratorModal } from "./AIGameGeneratorModal";
import { FloatingCoPilot } from "@/components/classroom/FloatingCoPilot";
import { ZenModeOverlay } from "@/components/classroom/ZenModeOverlay";
import { PictureInPicture } from "@/components/classroom/PictureInPicture";
import { LessonWrapUpDialog } from "@/components/classroom/LessonWrapUpDialog";
import { TeacherInstructionsSidebar } from "@/components/classroom/TeacherInstructionsSidebar";
import { ConnectionDebugPanel, type ConnectionHealthStatus } from "@/components/classroom/debug/ConnectionDebugPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
import LibraryDrawer from "@/components/lesson-player/LibraryDrawer";
import { useIdleOpacity } from "@/hooks/useIdleOpacity";
import { useClassroomTimer } from "@/hooks/classroom/useClassroomTimer";
import { useSmartTimer } from "@/hooks/classroom/useSmartTimer";
import { whiteboardService, type SmartWorksheet, type NativeGameType, type StageMode } from "@/services/whiteboardService";

type HubType = 'playground' | 'academy' | 'professional';

interface TeacherClassroomProps {
  classId?: string;
  studentName?: string;
  studentId?: string;
  lessonTitle?: string;
  lessonId?: string;
  teacherName?: string;
  hubType?: HubType;
}

export const TeacherClassroom: React.FC<TeacherClassroomProps> = ({
  classId = "101",
  studentName = "Emma",
  studentId,
  lessonTitle = "Magic Forest: Lesson 1",
  lessonId,
  teacherName = "Teacher",
  hubType = "academy"
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

  // AI Game Generator state
  const [gameGeneratorOpen, setGameGeneratorOpen] = useState(false);
  const [activeWorksheet, setActiveWorksheet] = useState<SmartWorksheet | null>(null);

  // Teacher instructions sidebar
  const [instructionsSidebarOpen, setInstructionsSidebarOpen] = useState(false);

  // Library drawer for live lesson injection
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  // Raw GeneratedSlide[] for premium rendering in the stage
  const [rawSlides, setRawSlides] = useState<any[]>([]);

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

  // Use classId directly as roomName so both teacher and student join the same room
  const roomName = classId;
  const webrtcRoom = `engleuphoria-${classId}`;

  const slides = React.useMemo(() => ([
    { id: '1', title: 'Welcome to the Lesson' },
    { id: '2', title: 'Vocabulary: Animals' },
    { id: '3', title: 'Practice: Matching Game' },
    { id: '4', title: 'Sentence Building' },
    { id: '5', title: 'Speaking Practice' },
    { id: '6', title: 'Quiz Time!' },
    { id: '7', title: 'Great Job! Summary' },
  ]), []);
  const lessonData = React.useMemo(
    () => ({ title: lessonTitle, slides }),
    [lessonTitle, slides]
  );

  const {
    currentSlide,
    lessonSlides: syncedLessonSlides,
    lessonTitle: syncedLessonTitle,
    studentCanDraw,
    isConnected,
    strokes,
    sharedNotes,
    sessionContext,
    activeCanvasTab,
    embeddedUrl,
    stageMode,
    drawingEnabled,
    iframeUnlocked,
    setCurrentSlideIndex,
    setIframeUnlocked,
    updateSlide,
    updateTool,
    setStudentCanDraw,
    endSession,
    addStroke,
    clearCanvas,
    updateSharedDisplay,
    updateSharedNotes,
    updateSessionContext,
    updateCanvasTab,
    setStageMode,
    setDrawingEnabled,
    applyRemoteStageMode,
    applyRemoteDrawingEnabled
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
    lessonData
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

  const teacherUserId = user?.id || sessionStorage.getItem('demo-teacher-id') || 'teacher';
  const [channelStatus, setChannelStatus] = useState<'CONNECTING' | 'SUBSCRIBED' | 'CLOSED' | 'CHANNEL_ERROR' | 'TIMED_OUT'>('CONNECTING');

  useEffect(() => {
    if (!roomName || !teacherUserId) return;

    const unsubStage = whiteboardService.subscribeToStageMode(roomName, ({ mode, senderId }) => {
      if (senderId === teacherUserId || !mode) return;
      applyRemoteStageMode(mode);
    });
    const unsubDrawing = whiteboardService.subscribeToDrawingEnabled(roomName, ({ enabled, senderId }) => {
      if (senderId === teacherUserId || typeof enabled !== 'boolean') return;
      applyRemoteDrawingEnabled(enabled);
    });
    const unsubReward = whiteboardService.subscribeToRewards(roomName, (payload) => {
      if (payload.senderId === teacherUserId || payload.rewardType !== 'star') return;
      setStudentStars(payload.starCount ?? 1);
      setIsMilestone(!!payload.isMilestone);
      setShowStarCelebration(true);
    });
    const unsubStatus = whiteboardService.subscribeToStatus(roomName, (status) => {
      if (status === 'SUBSCRIBED' || status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CONNECTING') {
        setChannelStatus(status as 'CONNECTING' | 'SUBSCRIBED' | 'CLOSED' | 'CHANNEL_ERROR' | 'TIMED_OUT');
      }
    });
    const unsubSlideComplete = whiteboardService.subscribeToSlideCompletion(roomName, (payload) => {
      if (payload.senderId === teacherUserId) return;
      console.log(`[SlideCompletion] ${payload.senderName} completed slide ${payload.slideIndex}`, {
        slideId: payload.slideId,
        accuracy: payload.accuracy,
        timeSpent: payload.timeSpent,
      });
      toast({
        title: `✅ ${payload.senderName} completed activity`,
        description: payload.accuracy != null
          ? `Accuracy: ${payload.accuracy}% • Slide ${payload.slideIndex + 1}`
          : `Slide ${payload.slideIndex + 1} finished`,
        duration: 3000,
      });
    });

    return () => {
      unsubStage();
      unsubDrawing();
      unsubReward();
      unsubStatus();
      unsubSlideComplete();
    };
  }, [roomName, teacherUserId, applyRemoteStageMode, applyRemoteDrawingEnabled]);

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

  const [hasEndedClass, setHasEndedClass] = useState(false);

  const handleEndClass = useCallback(async () => {
    await endSession();
    setHasEndedClass(true);
    setWrapUpOpen(true);
    toast({ title: "Class Ended", description: "Please complete the lesson feedback report." });
  }, [toast, endSession]);

  const handleWrapUpChange = useCallback((open: boolean) => {
    setWrapUpOpen(open);
    if (!open && hasEndedClass) {
      navigate('/teacher');
    }
  }, [hasEndedClass, navigate]);

  useEffect(() => { media.join(); return () => { media.leave(); }; }, []);

  // WebRTC peer connection
  const { participants, isConnected: rtcConnected, connect: rtcConnect, disconnect: rtcDisconnect } = useWebRTCConnection({
    roomId: webrtcRoom,
    userId: user?.id || sessionStorage.getItem('demo-teacher-id') || '',
    localStream: media.stream,
    enabled: media.isConnected
  });

  // Notify when student joins
  const prevParticipantCount = React.useRef(0);
  useEffect(() => {
    if (participants.length > prevParticipantCount.current && prevParticipantCount.current >= 0) {
      if (prevParticipantCount.current > 0) {
        toast({ title: "👋 Student Joined", description: "A student has joined the classroom", className: "bg-green-900 border-green-700" });
      }
    }
    prevParticipantCount.current = participants.length;
  }, [participants.length]);

  const toggleMute = useCallback(() => { media.toggleMicrophone(); }, [media]);
  const toggleCamera = useCallback(() => { media.toggleCamera(); }, [media]);

  const handleGiveStar = useCallback(async () => {
    const newStarCount = studentStars + 1;
    setStudentStars(newStarCount);
    const milestone = newStarCount % 5 === 0;
    setIsMilestone(milestone);
    setShowStarCelebration(true);
    // Instant broadcast to student via the unified classroom channel
    void whiteboardService.sendReward(roomName, {
      rewardType: 'star',
      starCount: newStarCount,
      isMilestone: milestone,
      senderId: teacherUserId,
    }).catch((e) => console.error('Star broadcast failed:', e));
    await updateSharedDisplay({ starCount: newStarCount, showStarCelebration: true, isMilestone: milestone });
    setTimeout(async () => { await updateSharedDisplay({ showStarCelebration: false }); }, 1000);
  }, [studentStars, updateSharedDisplay, roomName, teacherUserId]);

  const handleOpenTimer = useCallback(() => { setTimerDialogOpen(true); }, []);
  const handleRollDice = useCallback(() => { setDiceDialogOpen(true); }, []);
  const handleSendSticker = useCallback((emoji: string = '😊') => {
    void whiteboardService.sendReward(roomName, {
      rewardType: 'sticker',
      sticker: emoji,
      senderId: teacherUserId,
    }).catch((e) => console.error('Sticker broadcast failed:', e));
    toast({ title: `${emoji} Sticker Sent!`, description: "Sticker sent to the student's screen" });
  }, [toast, roomName, teacherUserId]);

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
    await updateSharedDisplay({ embeddedUrl: url });
    await setStageMode('web');
    await updateCanvasTab('web');
    toast({ title: "Content Embedded", description: "External content is now visible to students", className: "bg-teal-900 border-teal-700" });
  }, [toast, updateSharedDisplay, updateCanvasTab, setStageMode]);

  const handleCloseEmbed = useCallback(async () => {
    await updateSharedDisplay({ embeddedUrl: null });
    await setStageMode('slide');
    await updateCanvasTab('slides');
  }, [updateSharedDisplay, updateCanvasTab, setStageMode]);

  const broadcastSlideIndex = useCallback(async (index: number) => {
    setCurrentSlideIndex(index);
    await whiteboardService.sendSlideSync(roomName, { index, senderId: teacherUserId });
  }, [roomName, setCurrentSlideIndex, teacherUserId]);

  const handlePrevSlide = useCallback(async () => {
    const newIndex = Math.max(0, currentSlide - 1);
    await updateSlide(newIndex);
    await broadcastSlideIndex(newIndex);
  }, [broadcastSlideIndex, currentSlide, updateSlide]);
  const displayedSlides = syncedLessonSlides.length > 0 ? syncedLessonSlides : slides;
  const activeLessonTitle = syncedLessonTitle || lessonTitle;

  const handleNextSlide = useCallback(async () => {
    const newIndex = Math.min(displayedSlides.length - 1, currentSlide + 1);
    await updateSlide(newIndex);
    await broadcastSlideIndex(newIndex);
  }, [broadcastSlideIndex, currentSlide, displayedSlides.length, updateSlide]);
  const handleSlideSelect = useCallback(async (index: number) => {
    await updateSlide(index);
    await broadcastSlideIndex(index);
  }, [broadcastSlideIndex, updateSlide]);

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

  const hubBg = hubType === 'playground'
    ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    : hubType === 'professional'
    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-mint-50'
    : 'bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50';

  const showDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

  const realtimeHealth: ConnectionHealthStatus =
    channelStatus === 'SUBSCRIBED'
      ? 'connected'
      : channelStatus === 'CONNECTING'
      ? 'connecting'
      : 'disconnected';

  return (
    <div className={`h-screen w-full ${hubBg} text-gray-900 flex flex-col overflow-hidden relative`}>
      <div className="fixed top-3 right-3 z-[110] flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 shadow-sm ring-1 ring-border backdrop-blur-md">
        <div className={`h-2.5 w-2.5 rounded-full ${channelStatus === 'SUBSCRIBED' ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
        <span className="text-[11px] font-medium text-foreground">Realtime</span>
      </div>

      {/* Teacher-only: live diagnostics for realtime + WebRTC */}
      <ConnectionDebugPanel
        realtimeStatus={realtimeHealth}
        signalingReady={channelStatus === 'SUBSCRIBED'}
        peerConnected={rtcConnected}
        roomId={roomName}
      />

      {/* Debug Room ID Label */}
      {showDebug && (
        <div className="fixed bottom-2 left-2 z-[100] bg-black/50 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-sm">
          Room: {roomName} | WebRTC: {webrtcRoom}
        </div>
      )}
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
              isConnected={rtcConnected}
              stream={participants[0]?.stream || null}
            />
          </>
        )}
      </AnimatePresence>

      {/* Top Control Bar (hidden in Zen) */}
      {!isZenMode && (
        <div style={topBarIdle.style} onMouseMove={topBarIdle.onMouseMove} onMouseEnter={topBarIdle.onMouseEnter}>
          <ClassroomTopBar
            lessonTitle={activeLessonTitle}
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
            hubType={hubType}
            rtcConnected={rtcConnected}
            localStream={media.stream}
            onSwitchCamera={media.switchCamera}
            onSwitchMicrophone={media.switchMicrophone}
            onReconnect={async () => {
              await rtcDisconnect();
              await rtcConnect();
              toast({ title: "🔄 Reconnecting...", description: "Attempting to reconnect video" });
            }}
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
              remoteStream={participants[0]?.stream || null}
              isVideoConnected={media.isConnected}
              isLocalCameraOff={media.isCameraOff}
              isRemoteConnected={rtcConnected}
              studentMicMuted={!!(sessionContext as any)?.studentMicMuted}
              studentCameraOff={!!(sessionContext as any)?.studentCameraOff}
              onToggleStudentMic={async () => {
                const next = !((sessionContext as any)?.studentMicMuted);
                await updateSessionContext({ ...(sessionContext || {}), studentMicMuted: next });
                toast({ title: next ? "🔇 Student muted" : "🔊 Student unmuted", description: next ? "The student's microphone has been muted" : "The student can speak again" });
              }}
              onToggleStudentCamera={async () => {
                const next = !((sessionContext as any)?.studentCameraOff);
                await updateSessionContext({ ...(sessionContext || {}), studentCameraOff: next });
                toast({ title: next ? "📷 Student camera off" : "📹 Student camera on", description: next ? "The student's camera has been turned off" : "The student's camera is back on" });
              }}
            />
          </div>
        )}

        {/* Center: Unified Main Stage */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          <MainStage
            mode={stageMode}
            slides={displayedSlides}
            currentSlideIndex={currentSlide}
            embeddedUrl={embeddedUrl}
            drawingEnabled={drawingEnabled}
            activeTool={(activeTool === 'pen' || activeTool === 'eraser' || activeTool === 'highlighter' || activeTool === 'pointer') ? activeTool : 'pen'}
            activeColor={activeColor}
            strokes={strokes}
            roomId={roomName}
            userId={user?.id || sessionStorage.getItem('demo-teacher-id') || ''}
            userName={teacherName}
            role="teacher"
            iframeUnlocked={iframeUnlocked}
            rawSlides={rawSlides}
            hubType={hubType}
            onAddStroke={addStroke}
          />
          <TeacherControlDock
            mode={stageMode}
            onModeChange={async (m) => {
              await setStageMode(m);
              if (m === 'web') {
                await updateCanvasTab('web');
              } else if (m === 'slide') {
                await updateCanvasTab('slides');
              } else {
                await updateCanvasTab('whiteboard');
              }
            }}
            embeddedUrl={embeddedUrl}
            onEmbedUrl={async (url) => {
              await updateSharedDisplay({ embeddedUrl: url });
              await setStageMode('web');
              await updateCanvasTab('web');
            }}
            drawingEnabled={drawingEnabled}
            onToggleDrawing={async (enabled) => {
              await setDrawingEnabled(enabled);
              await setStudentCanDraw(enabled); // keep legacy flag in sync
            }}
            activeTool={(activeTool === 'pen' || activeTool === 'eraser' || activeTool === 'highlighter' || activeTool === 'pointer') ? activeTool : 'pen'}
            onToolChange={(t) => handleToolChange(t)}
            activeColor={activeColor}
            onColorChange={setActiveColor}
            currentSlideIndex={currentSlide}
            totalSlides={displayedSlides.length}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
            onClearCanvas={handleClearCanvas}
            iframeUnlocked={iframeUnlocked}
            onToggleIframeUnlock={setIframeUnlocked}
            onGiveStar={handleGiveStar}
            onOpenTimer={handleOpenTimer}
            onRollDice={handleRollDice}
            onSendSticker={handleSendSticker}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>

        {/* Right: Slide Navigator — hidden by teacher request to maximize lesson frame */}
      </div>

      {/* Teacher Instructions Sidebar (hidden in Zen) */}
      {!isZenMode && (
        <TeacherInstructionsSidebar
          lessonTitle={lessonTitle}
          isOpen={instructionsSidebarOpen}
          onToggle={() => setInstructionsSidebarOpen(!instructionsSidebarOpen)}
        />
      )}

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
        onOpenChange={handleWrapUpChange}
        lessonId={lessonId}
        studentId={studentId}
        teacherId={user?.id}
        sharedNotes={sharedNotes}
      />

      {/* Dice Roller Dialog */}
      <DiceRoller open={diceDialogOpen} onOpenChange={setDiceDialogOpen} roomId={roomName} senderId={teacherUserId} />

      {/* Embed Link Dialog */}
      <EmbedLinkDialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen} onEmbed={handleEmbed} />

      {/* Timer Dialog */}
      <Dialog open={timerDialogOpen} onOpenChange={setTimerDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">Activity Timer</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 gap-4">
            <div className="text-6xl font-mono font-bold text-blue-600">
              {Math.floor(timerValue / 60).toString().padStart(2, '0')}:
              {(timerValue % 60).toString().padStart(2, '0')}
            </div>
            {!timerRunning && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Set time (seconds):</span>
                <Input
                  type="number"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Math.max(1, parseInt(e.target.value) || 60))}
                  className="w-20 bg-gray-50 border-gray-200 text-center"
                  min={1}
                />
              </div>
            )}
            <div className="flex gap-2">
              {!timerRunning ? (
                <Button onClick={startTimer} className="bg-blue-600 hover:bg-blue-700">Start Timer</Button>
              ) : (
                <>
                  <Button onClick={() => setTimerRunning(false)} variant="outline" className="border-gray-200">Pause</Button>
                  <Button onClick={resetTimer} variant="destructive">Reset</Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Library Drawer for live lesson injection */}
      <LibraryDrawer
        open={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        slideFormat="raw"
        onSelectLesson={async (selectedSlides, title) => {
          setIsLibraryOpen(false);
          const liveSlides = selectedSlides.map((s: any, i: number) => ({
            ...s,
            id: String(s?.id ?? i + 1),
            title: String(s?.title || `Slide ${i + 1}`),
            imageUrl: s?.imageUrl || s?.image_url || s?.generated_image_url || undefined,
          }));
          setRawSlides(liveSlides);
          await updateSharedDisplay({ lessonSlides: liveSlides, lessonTitle: title, embeddedUrl: null });
          await updateSlide(0);
          await broadcastSlideIndex(0);
          await setStageMode('slide');
          await updateCanvasTab('slides');
          toast({
            title: "📚 Lesson Loaded!",
            description: `"${title}" is now on screen.`,
            className: "bg-indigo-900 border-indigo-700",
          });
        }}
      />
    </div>
  );
};
