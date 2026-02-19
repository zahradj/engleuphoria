import { useState, useEffect, useCallback, useRef } from 'react';
import { classroomSyncService, ClassroomSession } from '@/services/classroomSyncService';
import { whiteboardService, WhiteboardStroke } from '@/services/whiteboardService';

interface UseClassroomSyncOptions {
  roomId: string;
  userId: string;
  userName: string;
  role: 'teacher' | 'student';
  lessonData?: {
    title: string;
    slides: Array<{ id: string; title: string; imageUrl?: string }>;
  };
}

interface UseClassroomSyncReturn {
  // Session state
  session: ClassroomSession | null;
  currentSlide: number;
  activeTool: string;
  studentCanDraw: boolean;
  lessonSlides: Array<{ id: string; title: string; imageUrl?: string; type?: string; quizQuestion?: string; quizOptions?: Array<{ id: string; text: string; isCorrect: boolean }>; pollQuestion?: string; pollOptions?: Array<{ id: string; text: string }> }>;
  lessonTitle: string;
  isConnected: boolean;
  
  // Quiz state
  quizActive: boolean;
  quizLocked: boolean;
  quizRevealAnswer: boolean;
  currentQuizSlideId: string | null;
  
  // Poll state
  pollActive: boolean;
  pollShowResults: boolean;
  currentPollSlideId: string | null;
  
  // Shared display state for students
  embeddedUrl: string | null;
  isScreenSharing: boolean;
  starCount: number;
  showStarCelebration: boolean;
  isMilestone: boolean;
  timerValue: number | null;
  timerRunning: boolean;
  diceValue: number | null;
  // Phase 7: Shared notes & context
  sharedNotes: string;
  sessionContext: Record<string, any>;
  // Phase 8: Canvas tab sync
  activeCanvasTab: string;
  // Whiteboard state
  strokes: WhiteboardStroke[];
  
  // Teacher actions
  updateSlide: (index: number) => Promise<void>;
  updateTool: (tool: string) => Promise<void>;
  setStudentCanDraw: (canDraw: boolean) => Promise<void>;
  endSession: () => Promise<void>;
  
  // Whiteboard actions
  addStroke: (stroke: Omit<WhiteboardStroke, 'id' | 'roomId' | 'timestamp'>) => Promise<void>;
  clearCanvas: () => Promise<void>;
  
  // Shared display update (teacher only)
  updateSharedDisplay: (updates: {
    embeddedUrl?: string | null;
    isScreenSharing?: boolean;
    starCount?: number;
    showStarCelebration?: boolean;
    isMilestone?: boolean;
    timerValue?: number | null;
    timerRunning?: boolean;
    diceValue?: number | null;
  }) => Promise<void>;

  // Phase 7: Shared notes & context actions
  updateSharedNotes: (notes: string) => Promise<void>;
  updateSessionContext: (context: Record<string, any>) => Promise<void>;
  // Phase 8: Canvas tab
  updateCanvasTab: (tab: string) => Promise<void>;
}

export const useClassroomSync = ({
  roomId,
  userId,
  userName,
  role,
  lessonData
}: UseClassroomSyncOptions): UseClassroomSyncReturn => {
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const strokeCleanupRef = useRef<(() => void) | null>(null);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      if (role === 'teacher' && lessonData) {
        // Teacher creates/updates session
        const newSession = await classroomSyncService.createOrUpdateSession(
          roomId,
          userId,
          lessonData
        );
        if (newSession) {
          setSession(newSession);
          setIsConnected(true);
        }
      } else {
        // Student fetches existing session
        const existingSession = await classroomSyncService.getActiveSession(roomId);
        if (existingSession) {
          setSession(existingSession);
          setIsConnected(true);
        }
      }
    };

    initSession();
  }, [roomId, userId, role, lessonData]);

  // Subscribe to session updates
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = classroomSyncService.subscribeToSession(
      roomId,
      (updatedSession) => {
        setSession(updatedSession);
      }
    );

    cleanupRef.current = unsubscribe;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [roomId]);

  // Subscribe to whiteboard strokes
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = whiteboardService.subscribeToStrokes(
      roomId,
      (stroke) => {
        if (stroke.id === 'clear') {
          setStrokes([]);
        } else {
          setStrokes(prev => [...prev, stroke]);
        }
      }
    );

    strokeCleanupRef.current = unsubscribe;

    return () => {
      if (strokeCleanupRef.current) {
        strokeCleanupRef.current();
      }
    };
  }, [roomId]);

  // Teacher actions
  const updateSlide = useCallback(async (index: number) => {
    if (role !== 'teacher') return;
    try {
      await classroomSyncService.updateSession(roomId, { currentSlideIndex: index });
      setSession(prev => prev ? { ...prev, currentSlideIndex: index } : null);
    } catch (error) {
      console.error('Failed to update slide:', error);
    }
  }, [roomId, role]);

  const updateTool = useCallback(async (tool: string) => {
    if (role !== 'teacher') return;
    try {
      await classroomSyncService.updateSession(roomId, { activeTool: tool });
      setSession(prev => prev ? { ...prev, activeTool: tool } : null);
    } catch (error) {
      console.error('Failed to update tool:', error);
    }
  }, [roomId, role]);

  const setStudentCanDraw = useCallback(async (canDraw: boolean) => {
    if (role !== 'teacher') return;
    try {
      await classroomSyncService.updateSession(roomId, { studentCanDraw: canDraw });
      setSession(prev => prev ? { ...prev, studentCanDraw: canDraw } : null);
    } catch (error) {
      console.error('Failed to update drawing permission:', error);
    }
  }, [roomId, role]);

  const endSession = useCallback(async () => {
    if (role !== 'teacher') return;
    try {
      await classroomSyncService.endSession(roomId);
      setSession(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }, [roomId, role]);

  // Whiteboard actions
  const addStroke = useCallback(async (stroke: Omit<WhiteboardStroke, 'id' | 'roomId' | 'timestamp'>) => {
    // Check if user can draw
    const canDraw = role === 'teacher' || (session?.studentCanDraw ?? false);
    if (!canDraw) {
      console.warn('Drawing not permitted');
      return;
    }

    try {
      await whiteboardService.saveStroke(roomId, {
        ...stroke,
        roomId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to add stroke:', error);
    }
  }, [roomId, role, session?.studentCanDraw]);

  const clearCanvas = useCallback(async () => {
    try {
      await whiteboardService.clearWhiteboard(roomId);
      setStrokes([]);
    } catch (error) {
      console.error('Failed to clear canvas:', error);
    }
  }, [roomId]);

  const updateSharedDisplay = useCallback(async (updates: {
    embeddedUrl?: string | null;
    isScreenSharing?: boolean;
    starCount?: number;
    showStarCelebration?: boolean;
    isMilestone?: boolean;
    timerValue?: number | null;
    timerRunning?: boolean;
    diceValue?: number | null;
  }) => {
    if (role !== 'teacher') return;
    try {
      await classroomSyncService.updateSession(roomId, updates);
      setSession(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Failed to update shared display:', error);
    }
  }, [roomId, role]);

  const updateSharedNotes = useCallback(async (notes: string) => {
    try {
      await classroomSyncService.updateSession(roomId, { sharedNotes: notes });
      setSession(prev => prev ? { ...prev, sharedNotes: notes } : null);
    } catch (error) {
      console.error('Failed to update shared notes:', error);
    }
  }, [roomId]);

  const updateSessionContext = useCallback(async (context: Record<string, any>) => {
    try {
      await classroomSyncService.updateSession(roomId, { sessionContext: context });
      setSession(prev => prev ? { ...prev, sessionContext: context } : null);
    } catch (error) {
      console.error('Failed to update session context:', error);
    }
  }, [roomId]);

  const updateCanvasTab = useCallback(async (tab: string) => {
    if (role !== 'teacher') return;
    try {
      await classroomSyncService.updateSession(roomId, { activeCanvasTab: tab });
      setSession(prev => prev ? { ...prev, activeCanvasTab: tab } : null);
    } catch (error) {
      console.error('Failed to update canvas tab:', error);
    }
  }, [roomId, role]);

  return {
    session,
    currentSlide: session?.currentSlideIndex ?? 0,
    activeTool: session?.activeTool ?? 'pointer',
    studentCanDraw: session?.studentCanDraw ?? false,
    lessonSlides: session?.lessonSlides ?? [],
    lessonTitle: session?.lessonTitle ?? 'Untitled Lesson',
    isConnected,
    quizActive: session?.quizActive ?? false,
    quizLocked: session?.quizLocked ?? false,
    quizRevealAnswer: session?.quizRevealAnswer ?? false,
    currentQuizSlideId: session?.currentQuizSlideId ?? null,
    pollActive: session?.pollActive ?? false,
    pollShowResults: session?.pollShowResults ?? false,
    currentPollSlideId: session?.currentPollSlideId ?? null,
    embeddedUrl: session?.embeddedUrl ?? null,
    isScreenSharing: session?.isScreenSharing ?? false,
    starCount: session?.starCount ?? 0,
    showStarCelebration: session?.showStarCelebration ?? false,
    isMilestone: session?.isMilestone ?? false,
    timerValue: session?.timerValue ?? null,
    timerRunning: session?.timerRunning ?? false,
    diceValue: session?.diceValue ?? null,
    sharedNotes: session?.sharedNotes ?? '',
    sessionContext: session?.sessionContext ?? {},
    activeCanvasTab: session?.activeCanvasTab ?? 'slides',
    strokes,
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
  };
};
