import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HubType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import DynamicSlideRenderer from './DynamicSlideRenderer';
import FeedbackOverlay from './FeedbackOverlay';
import { soundEffectsService } from '@/services/soundEffectsService';
import { supabase } from '@/integrations/supabase/client';
import { X, Volume2, VolumeX, Zap, Star } from 'lucide-react';

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
    mascotEmoji: '🐧',
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
    mascotEmoji: '⚡',
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
    mascotEmoji: '',
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
  const [muted, setMuted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [answerSelected, setAnswerSelected] = useState(false);

  // Feedback overlay state
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackSolution, setFeedbackSolution] = useState('');

  const config = HUB_CONFIGS[hub];
  const skin = HUB_SKINS[hub];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  const isActivitySlide = currentSlide?.slideType === 'activity' || !!currentSlide?.activityType;

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
      <div className={`flex items-center justify-center h-full min-h-screen ${skin.shell}`}>
        <div className="w-full max-w-[500px] mx-auto flex flex-col items-center gap-6 p-10">
          {/* Hub-specific celebration */}
          {hub === 'playground' && (
            <motion.div className="flex gap-2">
              {['🎉', '⭐', '🏆', '⭐', '🎉'].map((e, i) => (
                <motion.span
                  key={i}
                  className="text-4xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                >
                  {e}
                </motion.span>
              ))}
            </motion.div>
          )}
          {hub === 'academy' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-7xl"
              style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.6))' }}
            >
              ⚡
            </motion.div>
          )}
          {hub === 'professional' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Star className="w-8 h-8 text-emerald-600" />
            </motion.div>
          )}

          <h1 className="text-3xl font-bold" style={{ color: skin.xpColor }}>
            {hub === 'playground' ? '🌟 Awesome Job!' : hub === 'academy' ? 'Mission Complete!' : 'Lesson Complete'}
          </h1>
          <div className="text-xl" style={{ color: config.colorPalette.text }}>
            Score: <strong>{lessonScore} XP</strong> · {correctCount} correct
          </div>
          <button
            onClick={onExit}
            className={`px-8 py-3.5 rounded-2xl font-bold text-lg mt-4 w-full text-white ${skin.checkActive}`}
            style={{ boxShadow: skin.checkShadow }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ──────────── Fixed-Height App-Shell ──────────── */
  return (
    <div className={`flex flex-col h-full min-h-[100dvh] ${skin.shell}`} style={{ position: 'relative' }}>

      {/* ── Fixed Top Bar ── */}
      <div className={`fixed top-0 left-0 right-0 z-30 px-4 py-2.5 ${skin.header}`}>
        <div className="w-full max-w-[500px] mx-auto flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors shrink-0"
          >
            <X size={20} style={{ color: config.colorPalette.text }} />
          </button>

          {/* Hub-Skinned Progress Bar */}
          <div className={`flex-1 h-4 rounded-full overflow-hidden ${skin.progressTrack}`}>
            <motion.div
              className={`h-full rounded-full ${skin.progressBar}`}
              style={{ boxShadow: skin.progressGlow }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
            {/* Playground: character on progress bar */}
            {hub === 'playground' && (
              <motion.div
                className="absolute text-sm -mt-5"
                animate={{ left: `calc(${Math.min(progress, 95)}% - 8px)` }}
                transition={{ type: 'spring', stiffness: 50 }}
                style={{ position: 'relative' }}
              >
                🐧
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

          <button onClick={toggleMute} className="opacity-50 hover:opacity-100 shrink-0">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* ── Centered Content Area ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-auto">
        <div className={`w-full max-w-[500px] rounded-[20px] overflow-hidden ${skin.card}`}>
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

      {/* ── Sticky Footer with Smart CHECK Button ── */}
      {!feedbackVisible && (
        <div className={`sticky bottom-0 z-20 px-4 py-3 ${skin.footer}`}>
          <div className="w-full max-w-[500px] mx-auto">
            {isActivitySlide ? (
              <button
                onClick={answerSelected ? handleNextSlide : undefined}
                disabled={!answerSelected}
                className={`w-full py-3.5 rounded-2xl font-bold text-base tracking-wide uppercase transition-all ${
                  answerSelected ? `${skin.checkActive} text-white` : `${skin.checkDisabled}`
                }`}
                style={{
                  boxShadow: answerSelected ? skin.checkShadow : 'none',
                  color: answerSelected ? '#fff' : config.colorPalette.text,
                  opacity: answerSelected ? 1 : 0.5,
                }}
              >
                Check
              </button>
            ) : (
              <button
                onClick={handleNextSlide}
                className={`w-full py-3.5 rounded-2xl font-bold text-base tracking-wide uppercase text-white ${skin.checkActive}`}
                style={{ boxShadow: skin.checkShadow }}
              >
                {currentSlideIndex === totalSlides - 1 ? 'Finish' : 'Continue'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
