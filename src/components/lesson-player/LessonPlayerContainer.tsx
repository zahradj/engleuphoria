import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HubType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import DynamicSlideRenderer from './DynamicSlideRenderer';
import FeedbackOverlay from './FeedbackOverlay';
import { soundEffectsService } from '@/services/soundEffectsService';
import { supabase } from '@/integrations/supabase/client';
import { X, Volume2, VolumeX } from 'lucide-react';

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
  const [muted, setMuted] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Feedback overlay state
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackSolution, setFeedbackSolution] = useState('');

  const config = HUB_CONFIGS[hub];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  const isActivitySlide = currentSlide?.slideType === 'activity' || !!currentSlide?.activityType;

  const handleCorrectAnswer = useCallback(() => {
    setLessonScore((p) => p + 10);
    setCorrectCount((p) => p + 1);
    setFeedbackCorrect(true);
    setFeedbackSolution('');
    setFeedbackVisible(true);
    if (!muted) soundEffectsService.playCorrect();
  }, [muted]);

  const handleIncorrectAnswer = useCallback(() => {
    setFeedbackCorrect(false);
    const answer = currentSlide?.content?.correctAnswer || currentSlide?.interaction?.data?.correct_answer || '';
    setFeedbackSolution(answer);
    setFeedbackVisible(true);
    if (!muted) soundEffectsService.playIncorrect();
  }, [muted, currentSlide]);

  const handleNextSlide = useCallback(() => {
    setFeedbackVisible(false);
    if (currentSlideIndex >= totalSlides - 1) {
      completeLesson();
    } else {
      setCurrentSlideIndex((p) => p + 1);
      if (!muted) soundEffectsService.playPageTurn();
    }
  }, [currentSlideIndex, totalSlides, muted]);

  const completeLesson = useCallback(async () => {
    setCompleted(true);
    if (!muted) soundEffectsService.playCelebration();
    onComplete?.(lessonScore);

    if (studentId && lessonId) {
      try {
        await supabase.from('student_progress').upsert({
          student_id: studentId,
          lesson_id: lessonId,
          score: lessonScore,
          completed: true,
          completed_at: new Date().toISOString(),
        } as any);
      } catch (err) {
        console.warn('Could not persist lesson score:', err);
      }
    }
  }, [lessonScore, studentId, lessonId, onComplete, muted]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEffectsService.setMuted(next);
  };

  /* ──────────── Completion Screen ──────────── */
  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: config.colorPalette.background }}>
        <div className="w-full max-w-[600px] mx-auto flex flex-col items-center gap-6 p-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl">
            {hub === 'playground' ? '🏆' : hub === 'academy' ? '⚡' : '✅'}
          </motion.div>
          <h1 className="text-3xl font-bold" style={{ color: config.colorPalette.primary }}>
            Lesson Complete!
          </h1>
          <div className="text-xl" style={{ color: config.colorPalette.text }}>
            Score: <strong>{lessonScore} XP</strong> · {correctCount} correct answers
          </div>
          <button
            onClick={onExit}
            className="px-8 py-3 rounded-xl font-bold text-lg mt-4 w-full"
            style={{ background: config.colorPalette.primary, color: '#fff' }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ──────────── App-Shell Layout ──────────── */
  return (
    <div className="flex flex-col min-h-screen" style={{ background: config.colorPalette.background }}>

      {/* ── Fixed Top Bar ── */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-2.5 backdrop-blur-md bg-white/80 dark:bg-black/60 border-b border-black/5">
        <div className="w-full max-w-[600px] mx-auto flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          >
            <X size={20} style={{ color: config.colorPalette.text }} />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: config.colorPalette.highlight }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#58CC02' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <span className="text-xs font-bold min-w-[48px] text-center" style={{ color: config.colorPalette.primary }}>
            {lessonScore} XP
          </span>
          <button onClick={toggleMute} className="opacity-60 hover:opacity-100">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div
          className="w-full max-w-[600px] rounded-[20px] overflow-hidden"
          style={{
            background: hub === 'academy'
              ? 'rgba(30, 27, 75, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            border: hub === 'academy' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
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

      {/* ── Sticky Footer ── */}
      {!feedbackVisible && (
        <div className="sticky bottom-0 z-20 px-4 py-3 backdrop-blur-md bg-white/80 dark:bg-black/60 border-t border-black/5">
          <div className="w-full max-w-[600px] mx-auto">
            <button
              onClick={isActivitySlide ? undefined : handleNextSlide}
              disabled={isActivitySlide}
              className="w-full py-3.5 rounded-2xl font-bold text-base tracking-wide uppercase transition-all disabled:opacity-40"
              style={{
                background: isActivitySlide ? config.colorPalette.highlight : '#58CC02',
                color: isActivitySlide ? config.colorPalette.text : '#fff',
                boxShadow: isActivitySlide ? 'none' : '0 4px 0 #46a302',
              }}
            >
              {isActivitySlide
                ? 'Answer to continue'
                : currentSlideIndex === totalSlides - 1
                  ? 'Finish'
                  : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
