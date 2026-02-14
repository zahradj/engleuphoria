import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: { correct: string; incorrect: string };
}

interface TestPhaseProps {
  age: number;
  onComplete: (answers: number[]) => void;
}

const PLAYGROUND_QUESTIONS: Question[] = [
  { question: "Which animal says 'Meow'? 🐱🐶🐸🐦", options: ["🐱 Cat", "🐶 Dog", "🐸 Frog", "🐦 Bird"], correctIndex: 0, feedback: { correct: "That's right! 🎉 Cats say Meow!", incorrect: "Not quite! Cats say Meow! 🐱" } },
  { question: "What color is the sky on a sunny day? ☀️", options: ["🔴 Red", "🔵 Blue", "🟢 Green", "🟡 Yellow"], correctIndex: 1, feedback: { correct: "Yes! The sky is blue! 🌤️", incorrect: "The sky is blue on a sunny day! 🔵" } },
  { question: "How do you say 'Hello' to a friend?", options: ["Goodbye!", "Hi there!", "Thank you!", "Sorry!"], correctIndex: 1, feedback: { correct: "Perfect! 'Hi there!' is a great greeting! 👋", incorrect: "We say 'Hi there!' to greet a friend! 👋" } },
  { question: "How many legs does a dog have?", options: ["Two", "Four", "Six", "Eight"], correctIndex: 1, feedback: { correct: "Correct! Dogs have four legs! 🐕", incorrect: "Dogs have four legs! 🐾" } },
  { question: "What do you do with a book? 📖", options: ["Eat it", "Read it", "Throw it", "Wear it"], correctIndex: 1, feedback: { correct: "Yes! We read books! 📚", incorrect: "We read books! 📖" } },
];

const ACADEMY_QUESTIONS: Question[] = [
  { question: "Choose the correct sentence:", options: ["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She gone to school every day."], correctIndex: 1, feedback: { correct: "Correct! Third person singular uses 'goes'. ✅", incorrect: "The correct form is 'She goes' — third person singular." } },
  { question: "If I ____ rich, I would travel the world.", options: ["am", "was", "were", "be"], correctIndex: 2, feedback: { correct: "Perfect! 'Were' is used in second conditional. 🎯", incorrect: "In second conditional, we use 'were' for all subjects." } },
  { question: "Your friend invites you to a party. How do you respond?", options: ["I don't care.", "Sounds great! I'd love to come!", "Maybe. Whatever.", "No."], correctIndex: 1, feedback: { correct: "Great social skills! That's the polite response. 🎉", incorrect: "The most appropriate response is enthusiastic and polite!" } },
  { question: "'Look up' means to:", options: ["Search for information", "Look at the ceiling", "Wake up early", "Clean your room"], correctIndex: 0, feedback: { correct: "Right! 'Look up' is a phrasal verb meaning to search for info. 📖", incorrect: "'Look up' means to search for information." } },
  { question: "I've been studying English ____ three years.", options: ["since", "for", "during", "while"], correctIndex: 1, feedback: { correct: "Excellent! 'For' is used with durations. ⏰", incorrect: "'For' is used with periods of time (three years)." } },
];

const PROFESSIONAL_QUESTIONS: Question[] = [
  { question: "Which opening is most appropriate for a formal email to a client?", options: ["Hey! What's up?", "Dear Mr. Johnson,", "Yo, check this out.", "Hi buddy,"], correctIndex: 1, feedback: { correct: "Perfect professional etiquette! ✉️", incorrect: "'Dear Mr. Johnson,' is the standard formal opening." } },
  { question: "'Let's touch base next week' means:", options: ["Let's play sports", "Let's communicate/meet again", "Let's finish the project", "Let's take a break"], correctIndex: 1, feedback: { correct: "Correct! It's a common business idiom. 🤝", incorrect: "'Touch base' means to communicate or reconnect." } },
  { question: "The board ____ the proposal if we had presented better data.", options: ["would approve", "would have approved", "will approve", "approves"], correctIndex: 1, feedback: { correct: "Excellent! Third conditional — past hypothetical. 🎯", incorrect: "Third conditional: 'would have approved' (past unreal)." } },
  { question: "Which phrase is best for a client presentation?", options: ["I think maybe this could work...", "I'd like to walk you through our findings.", "So basically, here's the stuff.", "Let me just tell you what we did."], correctIndex: 1, feedback: { correct: "Very professional and confident delivery! 📊", incorrect: "The most professional phrasing is clear and structured." } },
  { question: "Choose the correct word: 'The merger will have significant ____ on our revenue.'", options: ["affect", "effect", "impact", "affection"], correctIndex: 2, feedback: { correct: "Correct! 'Impact' fits perfectly here. 💼", incorrect: "'Impact' is the best noun choice in this context." } },
];

const TestPhase = ({ age, onComplete }: TestPhaseProps) => {
  const questions = age < 12 ? PLAYGROUND_QUESTIONS : age < 18 ? ACADEMY_QUESTIONS : PROFESSIONAL_QUESTIONS;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [phase, setPhase] = useState<'typing' | 'answering' | 'feedback'>('typing');
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [messages, setMessages] = useState<Array<{ role: 'guide' | 'user'; text: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase]);

  const handleAnswer = (index: number) => {
    if (phase !== 'answering') return;
    setSelectedAnswer(index);
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    setMessages(prev => [...prev, { role: 'user', text: questions[currentQ].options[index] }]);
    setPhase('feedback');
  };

  const handleFeedbackComplete = () => {
    const isCorrect = selectedAnswer === questions[currentQ].correctIndex;
    const fb = isCorrect ? questions[currentQ].feedback.correct : questions[currentQ].feedback.incorrect;
    setMessages(prev => [...prev, { role: 'guide', text: fb }]);

    if (currentQ + 1 >= questions.length) {
      const finalAnswers = [...answers];
      setTimeout(() => onComplete(finalAnswers), 600);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(-1);
      setPhase('typing');
    }
  };

  const isCorrect = selectedAnswer === questions[currentQ]?.correctIndex;

  return (
    <div className="flex flex-col h-full">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-3">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < currentQ ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]'
                : i === currentQ ? 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.5)] scale-125'
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
          {phase === 'typing' && (
            <ChatBubble
              key={`q-${currentQ}`}
              role="guide"
              message={questions[currentQ].question}
              animate
              onTypingComplete={() => {
                setMessages(prev => [...prev, { role: 'guide', text: questions[currentQ].question }]);
                setPhase('answering');
              }}
            />
          )}

          {phase === 'feedback' && (
            <ChatBubble
              key={`fb-${currentQ}`}
              role="guide"
              message={isCorrect ? questions[currentQ].feedback.correct : questions[currentQ].feedback.incorrect}
              animate
              onTypingComplete={handleFeedbackComplete}
            />
          )}
        </AnimatePresence>

        {phase === 'answering' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
          >
            {questions[currentQ].options.map((opt, i) => (
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
