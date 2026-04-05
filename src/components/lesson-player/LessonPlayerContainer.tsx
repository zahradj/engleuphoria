import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HubType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import DynamicSlideRenderer from './DynamicSlideRenderer';
import { soundEffectsService } from '@/services/soundEffectsService';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

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

  const config = HUB_CONFIGS[hub];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  const handleCorrectAnswer = useCallback(() => {
    setLessonScore((p) => p + 10);
    setCorrectCount((p) => p + 1);
    if (!muted) soundEffectsService.playCorrect();
  }, [muted]);

  const handleIncorrectAnswer = useCallback(() => {
    if (!muted) soundEffectsService.playIncorrect();
  }, [muted]);

  const handleNextSlide = useCallback(() => {
    if (currentSlideIndex >= totalSlides - 1) {
      completeLesson();
    } else {
      setCurrentSlideIndex((p) => p + 1);
      if (!muted) soundEffectsService.playPageTurn();
    }
  }, [currentSlideIndex, totalSlides, muted]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((p) => p - 1);
      if (!muted) soundEffectsService.playPageTurn();
    }
  }, [currentSlideIndex, muted]);

  const completeLesson = useCallback(async () => {
    setCompleted(true);
    if (!muted) soundEffectsService.playCelebration();
    onComplete?.(lessonScore);

    // Persist to Supabase if we have context
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

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-10" style={{ background: config.colorPalette.background }}>
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
          className="px-8 py-3 rounded-xl font-bold text-lg mt-4"
          style={{ background: config.colorPalette.primary, color: '#fff' }}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: config.colorPalette.background }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: config.colorPalette.highlight }}>
        <button onClick={onExit} className="text-sm font-medium opacity-60 hover:opacity-100">
          ← Exit
        </button>
        <span className="text-sm font-bold" style={{ color: config.colorPalette.primary }}>
          {lessonTitle}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color: config.colorPalette.primary }}>
            {lessonScore} XP
          </span>
          <button onClick={toggleMute} className="opacity-60 hover:opacity-100">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full" style={{ background: config.colorPalette.highlight }}>
        <motion.div
          className="h-full rounded-r-full"
          style={{ background: config.colorPalette.primary }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-auto">
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

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-t" style={{ borderColor: config.colorPalette.highlight }}>
        <button
          onClick={handlePrevSlide}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-30"
          style={{ color: config.colorPalette.text }}
        >
          <ChevronLeft size={18} /> Back
        </button>

        <span className="text-sm opacity-60" style={{ color: config.colorPalette.text }}>
          {currentSlideIndex + 1} / {totalSlides}
        </span>

        <button
          onClick={handleNextSlide}
          className="flex items-center gap-1 px-6 py-2 rounded-lg font-bold text-sm"
          style={{ background: config.colorPalette.primary, color: '#fff' }}
        >
          {currentSlideIndex === totalSlides - 1 ? 'Finish' : 'Next'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
