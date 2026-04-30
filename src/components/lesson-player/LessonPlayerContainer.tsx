import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HubType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import DynamicSlideRenderer from './DynamicSlideRenderer';
import FeedbackOverlay from './FeedbackOverlay';
import LessonRewardPage from './LessonRewardPage';
import PipMascot from './PipMascot';
import { soundEffectsService } from '@/services/soundEffectsService';
import { triggerCelebration } from '@/services/celebration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Volume2, VolumeX, Zap, Star, ChevronLeft, ChevronRight, Focus } from 'lucide-react';
import PhaseTracker from './PhaseTracker';
import { useLessonAutoSave, readLessonBookmark, clearLessonBookmark } from '@/hooks/useLessonAutoSave';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/* ── Hub Skin Configuration ── */
const HUB_SKINS = {
  playground: {
    shell: 'bg-gradient-to-b from-amber-50 to-orange-50',
    header: 'bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-md',
    footer: 'bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-md',
    card: 'bg-white/90 border-2 border-amber-200/60 shadow-[0_20px_60px_rgba(255,159,28,0.15)]',
    progressTrack: 'bg-amber-200/50',
    progressBar: 'bg-gradient-to-r from-amber-400 to-orange-400',
    progressGlow: '0 0 12px rgba(255, 191, 0, 0.5)',
    checkActive: 'bg-gradient-to-r from-emerald-400 to-green-500',
    checkShadow: '0 4px 0 #16a34a',
    checkDisabled: 'bg-amber-200/60',
    xpColor: '#FF9F1C',
  },
  academy: {
    shell: 'bg-gradient-to-b from-indigo-950 to-slate-950',
    header: 'bg-indigo-950/80 backdrop-blur-xl border-b border-indigo-500/20',
    footer: 'bg-indigo-950/80 backdrop-blur-xl border-t border-indigo-500/20',
    card: 'bg-indigo-900/60 border border-indigo-500/30 shadow-[0_20px_60px_rgba(99,102,241,0.2)]',
    progressTrack: 'bg-indigo-800/40',
    progressBar: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500',
    progressGlow: '0 0 16px rgba(139, 92, 246, 0.6)',
    checkActive: 'bg-gradient-to-r from-indigo-500 to-violet-500',
    checkShadow: '0 4px 0 #4338ca',
    checkDisabled: 'bg-indigo-800/40',
    xpColor: '#A855F7',
  },
  professional: {
    shell: 'bg-gradient-to-b from-slate-50 to-gray-100',
    header: 'bg-white/90 backdrop-blur-md border-b border-slate-200',
    footer: 'bg-white/90 backdrop-blur-md border-t border-slate-200',
    card: 'bg-white border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)]',
    progressTrack: 'bg-slate-200',
    progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    progressGlow: 'none',
    checkActive: 'bg-slate-900',
    checkShadow: '0 4px 0 #1e293b',
    checkDisabled: 'bg-slate-200',
    xpColor: '#10B981',
  },
} as const;

interface LessonPlayerContainerProps {
  slides: GeneratedSlide[];
  hub: HubType;
  lessonTitle: string;
  lessonId?: string;
  studentId?: string;
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

export default function LessonPlayerContainer({
  slides,
  hub,
  lessonTitle,
  lessonId,
  studentId,
  onComplete,
  onExit,
}: LessonPlayerContainerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lessonScore, setLessonScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [muted, setMuted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Stars remaining (used by the resume bookmark — defaults to 3 hearts/lives)
  const [starsRemaining] = useState(3);

  // Resume prompt — shown once per mount, only if a saved bookmark exists for an incomplete lesson
  const [resumePrompt, setResumePrompt] = useState<{ slide: number; stars: number } | null>(null);
  const resumeChecked = useRef(false);
  useEffect(() => {
    if (resumeChecked.current) return;
    resumeChecked.current = true;
    const bookmark = readLessonBookmark(lessonId);
    if (bookmark && bookmark.slide_index > 0 && bookmark.slide_index < slides.length - 1) {
      setResumePrompt({ slide: bookmark.slide_index, stars: bookmark.stars_remaining });
    }
  }, [lessonId, slides.length]);

  // Auto-save bookmark on every slide change
  useLessonAutoSave({
    lessonId,
    studentId,
    slideIndex: currentSlideIndex,
    starsRemaining,
    totalSlides: slides.length,
    completed,
  });

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackSolution, setFeedbackSolution] = useState('');

  const config = HUB_CONFIGS[hub];
  const skin = HUB_SKINS[hub];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  const isActivitySlide = currentSlide?.slideType === 'activity' || !!currentSlide?.activityType;

  useEffect(() => {
    const qCount = slides.filter(s => s.slideType === 'activity' || !!s.activityType).length;
    setTotalQuestions(qCount);
  }, [slides]);

  useEffect(() => {
    if (completed) triggerCelebration(hub);
  }, [completed, hub]);

  const handleCorrectAnswer = useCallback(() => {
    setLessonScore((p) => p + 10);
    setCorrectCount((p) => p + 1);
    setAnswerSelected(true);
    setFeedbackCorrect(true);
    setFeedbackSolution('');
    setFeedbackVisible(true);
    if (!muted) soundEffectsService.playCorrect();
  }, [muted]);

  const handleIncorrectAnswer = useCallback(() => {
    setAnswerSelected(true);
    setFeedbackCorrect(false);
    const answer = currentSlide?.content?.correctAnswer || currentSlide?.interaction?.data?.correct_answer || '';
    setFeedbackSolution(answer);
    setFeedbackVisible(true);
    if (!muted) soundEffectsService.playIncorrect();
  }, [muted, currentSlide]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((p) => p - 1);
      setAnswerSelected(false);
      setFeedbackVisible(false);
      if (!muted) soundEffectsService.playPageTurn();
    }
  }, [currentSlideIndex, muted]);

  const handleNextSlide = useCallback(() => {
    setFeedbackVisible(false);
    setAnswerSelected(false);
    if (currentSlideIndex >= totalSlides - 1) {
      completeLesson();
    } else {
      setCurrentSlideIndex((p) => p + 1);
      if (!muted) soundEffectsService.playPageTurn();
    }
  }, [currentSlideIndex, totalSlides, muted]);

  const completeLesson = useCallback(() => {
    setCompleted(true);
    if (!muted) soundEffectsService.playCelebration();
    onComplete?.(lessonScore);
  }, [lessonScore, onComplete, muted]);

  const claimRewards = useCallback(async () => {
    // Persist completion to Supabase. Throws on failure so reward page can toast it.
    if (!studentId || !lessonId) {
      // No persistence target — treat as success (e.g. preview / unauthenticated demo)
      return;
    }
    // student_lesson_progress.lesson_id is uuid — bail gracefully on non-uuid ids
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lessonId);
    if (!isUuid) return;

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const { error } = await supabase.from('student_lesson_progress').upsert(
      {
        user_id: studentId,
        lesson_id: lessonId,
        status: 'completed',
        score: lessonScore,
        time_spent_seconds: timeSpent,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'user_id,lesson_id' } as any
    );
    if (error) {
      console.error('claimRewards save failed:', error);
      throw new Error(error.message || 'Failed to save progress');
    }
  }, [studentId, lessonId, lessonScore]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEffectsService.setMuted(next);
  };

  /* ──────────── Reward Page ──────────── */
  if (completed) {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    return (
      <LessonRewardPage
        hub={hub}
        xpEarned={lessonScore}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        timeSpentSeconds={timeSpent}
        onClaim={claimRewards}
        onExit={onExit || (() => {})}
      />
    );
  }

  /* ──────────── App-Shell — wider max-w ──────────── */
  return (
    <div className={`flex flex-col h-full min-h-[100dvh] ${skin.shell}`} style={{ position: 'relative' }}>

      {/* Spotlight overlay */}
      {spotlightActive && (
        <div
          className="fixed inset-0 z-15 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 320px, rgba(0,0,0,0.45) 320px)',
          }}
        />
      )}

      {/* ── Fixed Top Bar ── */}
      <div className={`fixed top-0 left-0 right-0 z-30 px-4 py-2.5 ${skin.header}`}>
        <div className="w-full max-w-[720px] mx-auto flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors shrink-0"
          >
            <X size={20} style={{ color: config.colorPalette.text }} />
          </button>

          {/* Progress Bar */}
          <div className={`flex-1 h-4 rounded-full overflow-hidden relative ${skin.progressTrack}`}>
            <motion.div
              className={`h-full rounded-full ${skin.progressBar}`}
              style={{ boxShadow: skin.progressGlow }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
            {hub === 'playground' && (
              <motion.div
                className="absolute top-[-6px]"
                animate={{ left: `calc(${Math.min(progress, 90)}% - 12px)` }}
                transition={{ type: 'spring', stiffness: 50 }}
              >
                <PipMascot size={24} animation="bounce" />
              </motion.div>
            )}
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1 shrink-0">
            {hub === 'academy' ? (
              <Zap size={14} style={{ color: skin.xpColor }} />
            ) : hub === 'playground' ? (
              <Star size={14} style={{ color: skin.xpColor }} />
            ) : null}
            <span className="text-xs font-bold" style={{ color: skin.xpColor }}>
              {lessonScore}
            </span>
          </div>

          {/* Spotlight toggle */}
          <button
            onClick={() => setSpotlightActive((p) => !p)}
            className={`opacity-50 hover:opacity-100 shrink-0 transition-opacity ${spotlightActive ? '!opacity-100' : ''}`}
            title="Toggle focus mode"
          >
            <Focus size={16} />
          </button>

          <button onClick={toggleMute} className="opacity-50 hover:opacity-100 shrink-0">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
        {/* 6-Step Phase Tracker — locked progression map */}
        <div className="w-full max-w-[720px] mx-auto mt-2">
          <PhaseTracker
            slides={slides as any}
            currentIndex={currentSlideIndex}
            onJumpToPhase={(idx) => {
              setCurrentSlideIndex(idx);
              setAnswerSelected(false);
              setFeedbackVisible(false);
            }}
            accentClass={
              hub === 'playground'
                ? 'bg-orange-500 text-white ring-orange-200'
                : hub === 'academy'
                ? 'bg-violet-500 text-white ring-violet-300'
                : 'bg-emerald-600 text-white ring-emerald-200'
            }
          />
        </div>
      </div>

      {/* ── Centered Content Area ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-auto" style={{ paddingTop: 124, paddingBottom: 88 }}>
        <div className={`w-full max-w-[720px] rounded-[20px] overflow-hidden relative z-20 ${skin.card}`}>
          <AnimatePresence mode="wait">
            <DynamicSlideRenderer
              key={currentSlide.id}
              slide={currentSlide}
              hub={hub}
              onCorrectAnswer={handleCorrectAnswer}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ── Feedback Overlay ── */}
      <FeedbackOverlay
        visible={feedbackVisible}
        correct={feedbackCorrect}
        solution={feedbackSolution}
        hub={hub}
        onContinue={handleNextSlide}
      />

      {/* ── Fixed Bottom Footer ── */}
      {!feedbackVisible && (
        <div className={`fixed bottom-0 left-0 right-0 z-20 px-4 py-3 ${skin.footer}`}>
          <div className="w-full max-w-[720px] mx-auto flex items-center justify-between gap-3">
            {/* Back Button */}
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm tracking-wide uppercase transition-all ${
                currentSlideIndex === 0
                  ? `${skin.checkDisabled} opacity-40 cursor-not-allowed`
                  : `${skin.checkActive} text-white`
              }`}
              style={{
                boxShadow: currentSlideIndex === 0 ? 'none' : skin.checkShadow,
                color: currentSlideIndex === 0 ? config.colorPalette.text : '#fff',
              }}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            {/* Slide indicator */}
            <span className="text-xs font-medium opacity-60">
              {currentSlideIndex + 1} / {totalSlides}
            </span>

            {/* Next Button */}
            <button
              onClick={handleNextSlide}
              className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm tracking-wide uppercase transition-all ${skin.checkActive} text-white`}
              style={{
                boxShadow: skin.checkShadow,
                color: '#fff',
              }}
            >
              {currentSlideIndex === totalSlides - 1 ? 'Finish' : 'Next'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
