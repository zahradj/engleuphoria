import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ChatBubble from './ChatBubble';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VocabularyImage } from '@/components/ui/VocabularyImage';
import { buildPlacementBank, resolveSkill, taskInstructionKeyFor, type Hub, type BankQuestion } from './questionBanks';

export interface TestResult {
  questionIndex: number;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
  difficulty: number;
  targetLevel?: string;
}

type Question = BankQuestion;

interface TestPhaseProps {
  age: number;
  hub?: Hub;
  onComplete: (results: TestResult[]) => void;
}

const TestPhase = ({ age, hub, onComplete }: TestPhaseProps) => {
  // Strict age brackets: 4-9 → playground, 10-17 → academy, 18+ → professional.
  const resolvedHub: Hub = hub ?? (age > 0 && age < 10 ? 'playground' : age >= 18 ? 'professional' : 'academy');
  const isPlayground = resolvedHub === 'playground';
  const questions = useMemo(() => buildPlacementBank(resolvedHub, 15), [resolvedHub]);
  const TOTAL_QUESTIONS = questions.length;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [phase, setPhase] = useState<'typing' | 'answering' | 'feedback'>('typing');
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [messages, setMessages] = useState<Array<{ role: 'guide' | 'user'; text: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listening question state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const audioCacheRef = useRef<Map<number, string>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase]);

  // Reset listening lock whenever the question advances
  useEffect(() => {
    setHasPlayedOnce(false);
    setIsPlaying(false);
    setIsLoadingAudio(false);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }, [currentQIndex]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      audioCacheRef.current.forEach((url) => URL.revokeObjectURL(url));
      audioCacheRef.current.clear();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const handlePlayAudio = async () => {
    const q = questions[currentQIndex];
    if (!q?.audio_script || isPlaying || isLoadingAudio) return;

    const FAILURE_MSG = 'Failed to load audio. Please check your connection or try again.';
    setIsLoadingAudio(true);

    try {
      let url = audioCacheRef.current.get(currentQIndex);
      if (!url) {
        // Bypass supabase.functions.invoke() because it can mis-parse binary
        // audio responses as JSON. Direct fetch guarantees a clean blob.
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token ?? SUPABASE_KEY;

        const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ text: q.audio_script, voiceId: q.voice_id }),
        });

        const contentType = response.headers.get('content-type') || '';
        console.log('[Placement audio] response', {
          questionIndex: currentQIndex,
          status: response.status,
          contentType,
        });

        if (!response.ok || contentType.includes('application/json')) {
          // Edge function returned a JSON error payload (or HTTP failure).
          let msg = FAILURE_MSG;
          try {
            const payload = await response.json();
            console.error('[Placement audio] error payload', { questionIndex: currentQIndex, payload });
            if (typeof payload?.error === 'string') msg = payload.error;
          } catch {
            /* ignore parse error */
          }
          throw new Error(msg);
        }

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
          console.error('[Placement audio] empty blob', { questionIndex: currentQIndex });
          throw new Error(FAILURE_MSG);
        }

        // Force the MIME type to audio/mpeg in case the server omitted it.
        const audioBlob = blob.type.startsWith('audio/')
          ? blob
          : new Blob([blob], { type: 'audio/mpeg' });

        url = URL.createObjectURL(audioBlob);
        audioCacheRef.current.set(currentQIndex, url);
      }

      const audio = new Audio(url);
      currentAudioRef.current = audio;

      audio.addEventListener('canplaythrough', () => {
        setIsLoadingAudio(false);
        setIsPlaying(true);
      }, { once: true });

      audio.onended = () => {
        setIsPlaying(false);
        setHasPlayedOnce(true);
      };

      audio.onerror = (e) => {
        console.error('[Placement audio] element error', { questionIndex: currentQIndex, error: e });
        setIsPlaying(false);
        setIsLoadingAudio(false);
        toast.error(FAILURE_MSG);
      };

      try {
        await audio.play();
        setHasPlayedOnce(true);
      } catch (playErr) {
        console.error('[Placement audio] play() rejected', { questionIndex: currentQIndex, voiceId: q.voice_id, err: playErr });
        setIsPlaying(false);
        setIsLoadingAudio(false);
        toast.error(FAILURE_MSG);
      }
    } catch (err) {
      console.error('[Placement audio]', { questionIndex: currentQIndex, voiceId: q.voice_id, err });
      setIsPlaying(false);
      setIsLoadingAudio(false);
      const msg = err instanceof Error && err.message ? err.message : FAILURE_MSG;
      toast.error(msg);
    }
  };

  const currentQuestion = questions[currentQIndex];

  const handleAnswer = (index: number) => {
    if (phase !== 'answering') return;
    setSelectedAnswer(index);

    const isCorrect = index === currentQuestion.correctIndex;
    const result: TestResult = {
      questionIndex: currentQIndex,
      selectedOption: index,
      correctOption: currentQuestion.correctIndex,
      isCorrect,
      difficulty: currentQuestion.difficulty,
      targetLevel: currentQuestion.targetLevel,
    };
    setResults(prev => [...prev, result]);
    setMessages(prev => [...prev, { role: 'user', text: currentQuestion.options[index] }]);
    setPhase('feedback');
  };

  const handleFeedbackComplete = () => {
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    const fb = isCorrect ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect;
    setMessages(prev => [...prev, { role: 'guide', text: fb }]);

    const answeredCount = results.length;

    if (answeredCount >= TOTAL_QUESTIONS) {
      setTimeout(() => onComplete(results), 600);
    } else {
      setSelectedAnswer(-1);
      setCurrentQIndex(prev => prev + 1);
      setPhase('typing');
    }
  };

  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
  const progressPct = Math.round((results.length / TOTAL_QUESTIONS) * 100);

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar (15 dots can crowd; show a slim bar + count for the CEFR set) */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center justify-between text-[11px] text-white/60 mb-1.5">
          <span className="font-medium tracking-wide">
            {isPlayground ? 'Question' : 'CEFR Assessment'} {Math.min(results.length + 1, TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}
          </span>
          {!isPlayground && currentQuestion && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 font-semibold">
              {currentQuestion.targetLevel}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <ChatBubble key={`msg-${i}`} role={msg.role} message={msg.text} />
        ))}

        <AnimatePresence mode="wait">
          {phase === 'typing' && currentQuestion && (
            <motion.div
              key={`q-wrap-${currentQIndex}`}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChatBubble
                key={`q-${currentQIndex}`}
                role="guide"
                message={currentQuestion.question}
                animate
                onTypingComplete={() => {
                  setMessages(prev => [...prev, { role: 'guide', text: currentQuestion.question }]);
                  setPhase('answering');
                }}
              />
            </motion.div>
          )}

          {phase === 'feedback' && currentQuestion && (
            <motion.div
              key={`fb-wrap-${currentQIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <ChatBubble
                key={`fb-${currentQIndex}`}
                role="guide"
                message={isCorrect ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect}
                animate
                onTypingComplete={handleFeedbackComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'answering' && currentQuestion && (
          <motion.div
            key={`opts-${currentQIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 mt-2"
          >
            {(() => {
              const skill = resolveSkill(currentQuestion);
              const showImage = skill === 'vocabulary' && !!currentQuestion.imagePrompt;
              const showAudio = skill === 'listening' && !!currentQuestion.audio_script;
              return (
                <>
                  {showImage && (
                    <div className="w-full flex justify-center mb-4 animate-fade-in">
                      <VocabularyImage
                        prompt={currentQuestion.imagePrompt!}
                        alt="Question visual"
                        style={isPlayground ? 'cartoon' : 'flat2d'}
                        aspectRatio="1:1"
                        testSafe
                        className="max-w-[200px] max-h-48 object-contain rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm"
                      />
                    </div>
                  )}
                  {showAudio && (
                    <div className="flex flex-col items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={handlePlayAudio}
                        disabled={isPlaying || isLoadingAudio}
                        aria-label="Play listening prompt"
                        className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white rounded-2xl px-6 py-3 font-semibold flex items-center gap-2 shadow-lg shadow-fuchsia-500/30 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-wait"
                      >
                        {isLoadingAudio ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Loading…
                          </>
                        ) : isPlaying ? (
                          <>
                            <Volume2 className="w-5 h-5 animate-pulse" />
                            Playing…
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-5 h-5" />
                            {hasPlayedOnce ? 'Play Again' : 'Play Audio'}
                          </>
                        )}
                      </button>
                      {!hasPlayedOnce && (
                        <p className="text-white/60 text-xs">Listen first, then choose your answer.</p>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, i) => {
                const lockedByListening = !!currentQuestion.audio_script && !hasPlayedOnce;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    whileHover={lockedByListening ? undefined : { scale: 1.02 }}
                    whileTap={lockedByListening ? undefined : { scale: 0.97 }}
                    onClick={() => !lockedByListening && handleAnswer(i)}
                    disabled={lockedByListening}
                    aria-disabled={lockedByListening}
                    className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-left text-sm transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.2)] ${
                      lockedByListening
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-white/20'
                    }`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TestPhase;
