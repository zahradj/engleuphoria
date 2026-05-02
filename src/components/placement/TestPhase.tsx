import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import ChatBubble from './ChatBubble';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TestResult {
  questionIndex: number;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
  difficulty: number;
  targetLevel?: string;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: number;
  targetLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  feedback: { correct: string; incorrect: string };
  audio_script?: string;
  type?: 'standard' | 'listening_match';
}

interface TestPhaseProps {
  age: number;
  onComplete: (results: TestResult[]) => void;
}

// Kids stay on the playful adaptive bank (under 12).
const PLAYGROUND_QUESTIONS: Question[] = [
  { question: "Which animal says 'Meow'? 🐱🐶🐸🐦", options: ["🐱 Cat", "🐶 Dog", "🐸 Frog", "🐦 Bird"], correctIndex: 0, difficulty: 0.3, targetLevel: 'A1', feedback: { correct: "That's right! 🎉 Cats say Meow!", incorrect: "Not quite! Cats say Meow! 🐱" } },
  { question: "What color is the sky on a sunny day? ☀️", options: ["🔴 Red", "🔵 Blue", "🟢 Green", "🟡 Yellow"], correctIndex: 1, difficulty: 0.3, targetLevel: 'A1', feedback: { correct: "Yes! The sky is blue! 🌤️", incorrect: "The sky is blue on a sunny day! 🔵" } },
  { question: "How do you say 'Hello' to a friend?", options: ["Goodbye!", "Hi there!", "Thank you!", "Sorry!"], correctIndex: 1, difficulty: 0.4, targetLevel: 'A1', feedback: { correct: "Perfect! 'Hi there!' is a great greeting! 👋", incorrect: "We say 'Hi there!' to greet a friend! 👋" } },
  { question: "How many legs does a dog have?", options: ["Two", "Four", "Six", "Eight"], correctIndex: 1, difficulty: 0.4, targetLevel: 'A1', feedback: { correct: "Correct! Dogs have four legs! 🐕", incorrect: "Dogs have four legs! 🐾" } },
  { question: "What do you do with a book? 📖", options: ["Eat it", "Read it", "Throw it", "Wear it"], correctIndex: 1, difficulty: 0.5, targetLevel: 'A1', feedback: { correct: "Yes! We read books! 📚", incorrect: "We read books! 📖" } },
];

// 15-question CEFR Master Assessment for ages 12+ (Academy & Professional hubs).
// Strictly ordered by progressive difficulty: A1 → A2 → B1 → B2 → C1.
const CEFR_MASTER_QUESTIONS: Question[] = [
  // ===== A1 (Beginner) — Questions 1-3 =====
  {
    question: "Choose the correct sentence:",
    options: ["She are my sister.", "She is my sister.", "She am my sister.", "She be my sister."],
    correctIndex: 1, difficulty: 0.1, targetLevel: 'A1',
    feedback: { correct: "Correct! 'She is my sister.' ✅", incorrect: "With 'she/he/it' we use 'is'." },
  },
  {
    question: "Complete: 'I ___ a cup of coffee every morning.'",
    options: ["drinks", "drinking", "drink", "drank"],
    correctIndex: 2, difficulty: 0.15, targetLevel: 'A1',
    feedback: { correct: "Right! Simple present with 'I' uses 'drink'. ☕", incorrect: "With 'I' in the simple present, we use 'drink'." },
  },
  {
    question: "Which pronoun replaces 'Tom and I'?",
    options: ["They", "Us", "We", "Them"],
    correctIndex: 2, difficulty: 0.2, targetLevel: 'A1',
    feedback: { correct: "Yes! 'Tom and I' = 'We'. 👍", incorrect: "'Tom and I' is a subject pronoun → 'We'." },
  },

  // ===== A2 (Elementary) — Questions 4-6 =====
  {
    question: "Complete: 'Yesterday, I ___ to the cinema with my friends.'",
    options: ["go", "went", "going", "have gone"],
    correctIndex: 1, difficulty: 0.3, targetLevel: 'A2',
    feedback: { correct: "Correct! Past simple of 'go' is 'went'. 🎬", incorrect: "'Yesterday' signals past simple → 'went'." },
  },
  {
    question: "What is happening right now? 'Look! It ___.'",
    options: ["rains", "is raining", "rained", "rain"],
    correctIndex: 1, difficulty: 0.35, targetLevel: 'A2',
    feedback: { correct: "Perfect! Present continuous for actions happening now. 🌧️", incorrect: "Actions happening right now use present continuous: 'is raining'." },
  },
  {
    question: "Choose the correct preposition: 'The book is ___ the table.'",
    options: ["in", "on", "at", "between"],
    correctIndex: 1, difficulty: 0.4, targetLevel: 'A2',
    feedback: { correct: "Right! Things sit 'on' a surface. 📚", incorrect: "Use 'on' for surfaces like a table." },
  },

  // ===== B1 (Intermediate) — Questions 7-9 =====
  {
    question: "Complete: 'I ___ in this city since 2015.'",
    options: ["live", "lived", "have lived", "am living"],
    correctIndex: 2, difficulty: 0.55, targetLevel: 'B1',
    feedback: { correct: "Excellent! Present perfect with 'since'. 🏙️", incorrect: "'Since 2015' (until now) needs present perfect: 'have lived'." },
  },
  {
    question: "Choose the best modal: 'You ___ wear a helmet when riding a motorcycle — it's the law.'",
    options: ["might", "could", "must", "may"],
    correctIndex: 2, difficulty: 0.6, targetLevel: 'B1',
    feedback: { correct: "Correct! 'Must' expresses obligation. 🛡️", incorrect: "Legal obligations use 'must'." },
  },
  {
    question: "Choose the comparative: 'My new phone is ___ than my old one.'",
    options: ["more fast", "faster", "fastest", "most fast"],
    correctIndex: 1, difficulty: 0.65, targetLevel: 'B1',
    feedback: { correct: "Right! Short adjectives add '-er'. 📱", incorrect: "Short adjectives form the comparative with '-er' → 'faster'." },
  },
  {
    question: "🎧 Listen carefully. What is the speaker about to do?",
    options: ["Go shopping for food", "Cook dinner at home", "Clean the kitchen", "Watch a film"],
    correctIndex: 0, difficulty: 0.7, targetLevel: 'B1',
    type: 'listening_match',
    audio_script: "I'm just heading to the supermarket to pick up some bread and milk for breakfast tomorrow.",
    feedback: { correct: "Excellent listening! 🛒", incorrect: "The speaker is going to the supermarket — that's shopping for food. 🛒" },
  },

  // ===== B2 (Upper Intermediate) — Questions 10-12 =====
  {
    question: "Complete: 'If I ___ more time, I would learn another language.'",
    options: ["have", "had", "would have", "will have"],
    correctIndex: 1, difficulty: 0.75, targetLevel: 'B2',
    feedback: { correct: "Excellent! Second conditional: 'If + past simple'. 🌍", incorrect: "Second conditional uses 'If + past simple, would + infinitive'." },
  },
  {
    question: "Rewrite in passive voice: 'The chef prepared the meal.'",
    options: ["The meal prepared by the chef.", "The meal was prepared by the chef.", "The meal is preparing by the chef.", "The meal has prepare by the chef."],
    correctIndex: 1, difficulty: 0.8, targetLevel: 'B2',
    feedback: { correct: "Perfect! Passive: 'was/were + past participle'. 🍽️", incorrect: "Past passive = 'was/were + past participle' → 'was prepared'." },
  },
  {
    question: "Choose the correct phrasal verb: 'I need to ___ this word — I don't know what it means.'",
    options: ["look after", "look up", "look for", "look into"],
    correctIndex: 1, difficulty: 0.85, targetLevel: 'B2',
    feedback: { correct: "Correct! 'Look up' = search for information. 📖", incorrect: "'Look up' means to search for information (e.g., in a dictionary)." },
  },

  // ===== C1 (Advanced) — Questions 13-15 =====
  {
    question: "Choose the most precise word: 'Her arguments were so ___ that no one could refute them.'",
    options: ["nice", "compelling", "okay", "different"],
    correctIndex: 1, difficulty: 0.9, targetLevel: 'C1',
    feedback: { correct: "Excellent vocabulary! 'Compelling' = persuasive and convincing. 🎯", incorrect: "'Compelling' means powerfully persuasive — the precise C1 choice." },
  },
  {
    question: "Complete the inversion: 'Not only ___ the deadline, but he also exceeded expectations.'",
    options: ["he met", "did he meet", "he did meet", "met he"],
    correctIndex: 1, difficulty: 0.95, targetLevel: 'C1',
    feedback: { correct: "Perfect! Negative adverbials trigger subject-auxiliary inversion. 🏆", incorrect: "After 'Not only', we invert: 'did he meet'." },
  },
  {
    question: "What does the idiom 'to bite the bullet' mean?",
    options: ["To eat very quickly", "To face a difficult situation with courage", "To make a serious mistake", "To speak without thinking"],
    correctIndex: 1, difficulty: 1.0, targetLevel: 'C1',
    feedback: { correct: "Correct! It means to endure something painful with courage. 💪", incorrect: "'Bite the bullet' = face an unpleasant task with courage." },
  },
];

const TestPhase = ({ age, onComplete }: TestPhaseProps) => {
  const isPlayground = age < 12;
  const questions = isPlayground ? PLAYGROUND_QUESTIONS : CEFR_MASTER_QUESTIONS;
  const TOTAL_QUESTIONS = questions.length;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [phase, setPhase] = useState<'typing' | 'answering' | 'feedback'>('typing');
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [messages, setMessages] = useState<Array<{ role: 'guide' | 'user'; text: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase]);

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
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
          >
            {currentQuestion.options.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer(i)}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-left text-sm hover:bg-white/20 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
              >
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TestPhase;
