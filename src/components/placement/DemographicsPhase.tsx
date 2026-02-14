import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Briefcase, GraduationCap, Smile, Send } from 'lucide-react';
import ChatBubble from './ChatBubble';

interface DemographicsResult {
  age: number;
  goal: string;
}

interface DemographicsPhaseProps {
  onComplete: (result: DemographicsResult) => void;
}

type Step = 'intro' | 'askAge' | 'waitAge' | 'ageResponse' | 'askGoal' | 'waitGoal';

const GOALS = [
  { id: 'travel', label: 'Travel', icon: Plane, emoji: '✈️' },
  { id: 'work', label: 'Work / Business', icon: Briefcase, emoji: '💼' },
  { id: 'school', label: 'School / Exams', icon: GraduationCap, emoji: '🎓' },
  { id: 'fun', label: 'Fun / Social', icon: Smile, emoji: '🎉' },
];

const DemographicsPhase = ({ onComplete }: DemographicsPhaseProps) => {
  const [step, setStep] = useState<Step>('intro');
  const [age, setAge] = useState('');
  const [ageValue, setAgeValue] = useState(0);
  const [messages, setMessages] = useState<Array<{ role: 'guide' | 'user'; text: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, step]);

  const getAgeResponse = (a: number) => {
    if (a < 12) return "Awesome! 🎈 You're going to have so much fun learning English!";
    if (a < 18) return "Great! 📚 Let's find the right challenge level for you.";
    return "Excellent! 🎯 Let's tailor your professional English journey.";
  };

  const handleAgeSubmit = () => {
    const parsed = parseInt(age);
    if (isNaN(parsed) || parsed < 4 || parsed > 99) return;
    setAgeValue(parsed);
    setMessages(prev => [...prev, { role: 'user', text: `I'm ${parsed} years old.` }]);
    setStep('ageResponse');
  };

  const handleGoalSelect = (goal: string) => {
    setMessages(prev => [...prev, { role: 'user', text: goal }]);
    setTimeout(() => onComplete({ age: ageValue, goal }), 500);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <ChatBubble key={`msg-${i}`} role={msg.role} message={msg.text} />
        ))}

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <ChatBubble
              key="intro"
              role="guide"
              message="Hello! ✨ I'm your Guide. I'm here to find the perfect learning path for you."
              animate
              onTypingComplete={() => {
                setMessages(prev => [...prev, { role: 'guide', text: "Hello! ✨ I'm your Guide. I'm here to find the perfect learning path for you." }]);
                setStep('askAge');
              }}
            />
          )}

          {step === 'askAge' && (
            <ChatBubble
              key="askAge"
              role="guide"
              message="First, how old are you?"
              animate
              onTypingComplete={() => {
                setMessages(prev => [...prev, { role: 'guide', text: 'First, how old are you?' }]);
                setStep('waitAge');
              }}
            />
          )}

          {step === 'ageResponse' && (
            <ChatBubble
              key="ageResp"
              role="guide"
              message={getAgeResponse(ageValue)}
              animate
              onTypingComplete={() => {
                setMessages(prev => [...prev, { role: 'guide', text: getAgeResponse(ageValue) }]);
                setStep('askGoal');
              }}
            />
          )}

          {step === 'askGoal' && (
            <ChatBubble
              key="askGoal"
              role="guide"
              message="What do you want to achieve with English?"
              animate
              onTypingComplete={() => {
                setMessages(prev => [...prev, { role: 'guide', text: 'What do you want to achieve with English?' }]);
                setStep('waitGoal');
              }}
            />
          )}
        </AnimatePresence>

        {step === 'waitAge' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 justify-end"
          >
            <input
              type="number"
              min={4}
              max={99}
              value={age}
              onChange={e => setAge(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAgeSubmit()}
              placeholder="Your age..."
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 w-32 outline-none focus:border-violet-400 transition-colors"
              autoFocus
            />
            <button
              onClick={handleAgeSubmit}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl px-4 py-3 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 'waitGoal' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3 mt-2"
          >
            {GOALS.map(goal => (
              <motion.button
                key={goal.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleGoalSelect(goal.label)}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 text-white flex flex-col items-center gap-2 hover:bg-white/20 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
              >
                <span className="text-2xl">{goal.emoji}</span>
                <span className="text-sm font-medium">{goal.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DemographicsPhase;
