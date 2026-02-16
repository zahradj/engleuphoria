import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';

export interface TestResult {
  questionIndex: number;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
  difficulty: number;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: number;
  feedback: { correct: string; incorrect: string };
}

interface TestPhaseProps {
  age: number;
  onComplete: (results: TestResult[]) => void;
}

const PLAYGROUND_QUESTIONS: Question[] = [
  { question: "Which animal says 'Meow'? 🐱🐶🐸🐦", options: ["🐱 Cat", "🐶 Dog", "🐸 Frog", "🐦 Bird"], correctIndex: 0, difficulty: 0.3, feedback: { correct: "That's right! 🎉 Cats say Meow!", incorrect: "Not quite! Cats say Meow! 🐱" } },
  { question: "What color is the sky on a sunny day? ☀️", options: ["🔴 Red", "🔵 Blue", "🟢 Green", "🟡 Yellow"], correctIndex: 1, difficulty: 0.3, feedback: { correct: "Yes! The sky is blue! 🌤️", incorrect: "The sky is blue on a sunny day! 🔵" } },
  { question: "How do you say 'Hello' to a friend?", options: ["Goodbye!", "Hi there!", "Thank you!", "Sorry!"], correctIndex: 1, difficulty: 0.4, feedback: { correct: "Perfect! 'Hi there!' is a great greeting! 👋", incorrect: "We say 'Hi there!' to greet a friend! 👋" } },
  { question: "How many legs does a dog have?", options: ["Two", "Four", "Six", "Eight"], correctIndex: 1, difficulty: 0.4, feedback: { correct: "Correct! Dogs have four legs! 🐕", incorrect: "Dogs have four legs! 🐾" } },
  { question: "What do you do with a book? 📖", options: ["Eat it", "Read it", "Throw it", "Wear it"], correctIndex: 1, difficulty: 0.5, feedback: { correct: "Yes! We read books! 📚", incorrect: "We read books! 📖" } },
  { question: "Which word is a fruit? 🍎", options: ["Chair", "Apple", "Car", "Hat"], correctIndex: 1, difficulty: 0.5, feedback: { correct: "Right! An apple is a fruit! 🍏", incorrect: "An apple is a fruit! 🍎" } },
  { question: "What season comes after summer?", options: ["Spring", "Winter", "Autumn", "Summer"], correctIndex: 2, difficulty: 0.6, feedback: { correct: "Great! Autumn comes after summer! 🍂", incorrect: "Autumn (Fall) comes after summer! 🍂" } },
  { question: "Complete: 'She ___ a student.'", options: ["am", "is", "are", "be"], correctIndex: 1, difficulty: 0.7, feedback: { correct: "Correct! 'She is a student.' ✅", incorrect: "The correct answer is 'She is a student.'" } },
];

const ACADEMY_QUESTIONS: Question[] = [
  { question: "Choose the correct sentence:", options: ["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She gone to school every day."], correctIndex: 1, difficulty: 0.5, feedback: { correct: "Correct! Third person singular uses 'goes'. ✅", incorrect: "The correct form is 'She goes' — third person singular." } },
  { question: "If I ____ rich, I would travel the world.", options: ["am", "was", "were", "be"], correctIndex: 2, difficulty: 0.6, feedback: { correct: "Perfect! 'Were' is used in second conditional. 🎯", incorrect: "In second conditional, we use 'were' for all subjects." } },
  { question: "Your friend invites you to a party. How do you respond?", options: ["I don't care.", "Sounds great! I'd love to come!", "Maybe. Whatever.", "No."], correctIndex: 1, difficulty: 0.5, feedback: { correct: "Great social skills! That's the polite response. 🎉", incorrect: "The most appropriate response is enthusiastic and polite!" } },
  { question: "'Look up' means to:", options: ["Search for information", "Look at the ceiling", "Wake up early", "Clean your room"], correctIndex: 0, difficulty: 0.7, feedback: { correct: "Right! 'Look up' is a phrasal verb meaning to search for info. 📖", incorrect: "'Look up' means to search for information." } },
  { question: "I've been studying English ____ three years.", options: ["since", "for", "during", "while"], correctIndex: 1, difficulty: 0.7, feedback: { correct: "Excellent! 'For' is used with durations. ⏰", incorrect: "'For' is used with periods of time (three years)." } },
  { question: "Which sentence uses the passive voice correctly?", options: ["The cake eaten by us.", "The cake was eaten by us.", "The cake is eat by us.", "The cake eating by us."], correctIndex: 1, difficulty: 0.8, feedback: { correct: "Great! Passive = 'was/were + past participle'. ✅", incorrect: "Passive voice: 'The cake was eaten by us.'" } },
  { question: "She asked me where I ____.", options: ["live", "lived", "living", "lives"], correctIndex: 1, difficulty: 0.8, feedback: { correct: "Correct! Reported speech uses past tense. 📝", incorrect: "In reported speech, we shift 'live' → 'lived'." } },
  { question: "Not only ____ intelligent, but also creative.", options: ["she is", "is she", "she was", "does she"], correctIndex: 1, difficulty: 0.9, feedback: { correct: "Excellent! Inverted structure after 'Not only'. 🎯", incorrect: "'Not only is she' uses subject-verb inversion." } },
];

const PROFESSIONAL_QUESTIONS: Question[] = [
  { question: "Which opening is most appropriate for a formal email to a client?", options: ["Hey! What's up?", "Dear Mr. Johnson,", "Yo, check this out.", "Hi buddy,"], correctIndex: 1, difficulty: 0.6, feedback: { correct: "Perfect professional etiquette! ✉️", incorrect: "'Dear Mr. Johnson,' is the standard formal opening." } },
  { question: "'Let's touch base next week' means:", options: ["Let's play sports", "Let's communicate/meet again", "Let's finish the project", "Let's take a break"], correctIndex: 1, difficulty: 0.6, feedback: { correct: "Correct! It's a common business idiom. 🤝", incorrect: "'Touch base' means to communicate or reconnect." } },
  { question: "The board ____ the proposal if we had presented better data.", options: ["would approve", "would have approved", "will approve", "approves"], correctIndex: 1, difficulty: 0.8, feedback: { correct: "Excellent! Third conditional — past hypothetical. 🎯", incorrect: "Third conditional: 'would have approved' (past unreal)." } },
  { question: "Which phrase is best for a client presentation?", options: ["I think maybe this could work...", "I'd like to walk you through our findings.", "So basically, here's the stuff.", "Let me just tell you what we did."], correctIndex: 1, difficulty: 0.7, feedback: { correct: "Very professional and confident delivery! 📊", incorrect: "The most professional phrasing is clear and structured." } },
  { question: "Choose the correct word: 'The merger will have significant ____ on our revenue.'", options: ["affect", "effect", "impact", "affection"], correctIndex: 2, difficulty: 0.8, feedback: { correct: "Correct! 'Impact' fits perfectly here. 💼", incorrect: "'Impact' is the best noun choice in this context." } },
  { question: "Which is the most diplomatic way to disagree in a meeting?", options: ["You're wrong.", "I see your point, however I'd suggest we consider...", "That's a terrible idea.", "No way, that won't work."], correctIndex: 1, difficulty: 0.7, feedback: { correct: "Excellent diplomatic phrasing! 🤝", incorrect: "Diplomatic disagreement starts with acknowledging the other view." } },
  { question: "'Synergy' in business most closely means:", options: ["Working alone", "Combined effort exceeding individual parts", "Company merger", "Employee termination"], correctIndex: 1, difficulty: 0.9, feedback: { correct: "Perfect! Synergy = the whole is greater than the sum. 📈", incorrect: "Synergy means combined efforts produce greater results." } },
  { question: "Identify the error: 'The datas shows a clear trend.'", options: ["'datas' should be 'data'", "'shows' should be 'show'", "Both A and B", "No error"], correctIndex: 2, difficulty: 1.0, feedback: { correct: "Correct! 'Data' is plural (or uncountable), and the verb should match. 🎓", incorrect: "'Data' doesn't take an 's', and as a plural noun it uses 'show'." } },
];

const TOTAL_QUESTIONS = 5;

const TestPhase = ({ age, onComplete }: TestPhaseProps) => {
  const allQuestions = age < 12 ? PLAYGROUND_QUESTIONS : age < 18 ? ACADEMY_QUESTIONS : PROFESSIONAL_QUESTIONS;

  // Sort by difficulty for initial pool
  const sortedPool = [...allQuestions].sort((a, b) => a.difficulty - b.difficulty);

  const [askedQuestions, setAskedQuestions] = useState<Question[]>([sortedPool[Math.floor(sortedPool.length / 2)]]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [phase, setPhase] = useState<'typing' | 'answering' | 'feedback'>('typing');
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [messages, setMessages] = useState<Array<{ role: 'guide' | 'user'; text: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase]);

  const currentQuestion = askedQuestions[currentQIndex];

  const selectNextQuestion = useCallback((wasCorrect: boolean) => {
    const asked = new Set(askedQuestions.map(q => q.question));
    const remaining = allQuestions.filter(q => !asked.has(q.question));
    if (remaining.length === 0) return remaining[0] || allQuestions[0];

    const currentDiff = currentQuestion.difficulty;

    if (wasCorrect) {
      // Pick the easiest question that's harder than current
      const harder = remaining.filter(q => q.difficulty > currentDiff).sort((a, b) => a.difficulty - b.difficulty);
      return harder[0] || remaining[remaining.length - 1];
    } else {
      // Pick the hardest question that's easier than current
      const easier = remaining.filter(q => q.difficulty < currentDiff).sort((a, b) => b.difficulty - a.difficulty);
      return easier[0] || remaining[0];
    }
  }, [allQuestions, askedQuestions, currentQuestion]);

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
      const nextQ = selectNextQuestion(isCorrect);
      setAskedQuestions(prev => [...prev, nextQ]);
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(-1);
      setPhase('typing');
    }
  };

  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;

  return (
    <div className="flex flex-col h-full">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-3">
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < results.length ? (results[i]?.isCorrect ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]' : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]')
                : i === results.length ? 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.5)] scale-125'
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <ChatBubble key={`msg-${i}`} role={msg.role} message={msg.text} />
        ))}

        <AnimatePresence mode="wait">
          {phase === 'typing' && currentQuestion && (
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
          )}

          {phase === 'feedback' && currentQuestion && (
            <ChatBubble
              key={`fb-${currentQIndex}`}
              role="guide"
              message={isCorrect ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect}
              animate
              onTypingComplete={handleFeedbackComplete}
            />
          )}
        </AnimatePresence>

        {phase === 'answering' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
          >
            {currentQuestion.options.map((opt, i) => (
              <motion.button
                key={i}
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
