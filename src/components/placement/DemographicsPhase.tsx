import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Briefcase, GraduationCap, Smile, Send } from 'lucide-react';
import ChatBubble from './ChatBubble';

interface DemographicsResult {
  age: number;
  goal: string;
  interests: string[];
}

interface DemographicsPhaseProps {
  onComplete: (result: DemographicsResult) => void;
}

type Step = 'intro' | 'askAge' | 'waitAge' | 'ageResponse' | 'askGoal' | 'waitGoal' | 'goalResponse' | 'askInterests' | 'waitInterests';

const GOALS = [
  { id: 'travel', label: 'Travel', icon: Plane, emoji: '✈️' },
  { id: 'work', label: 'Work / Business', icon: Briefcase, emoji: '💼' },
  { id: 'school', label: 'School / Exams', icon: GraduationCap, emoji: '🎓' },
  { id: 'fun', label: 'Fun / Social', icon: Smile, emoji: '🎉' },
];

const INTERESTS_BY_AGE = {
  kids: [
    { id: 'minecraft', label: 'Minecraft', emoji: '⛏️' },
    { id: 'animals', label: 'Animals', emoji: '🐾' },
    { id: 'cartoons', label: 'Cartoons', emoji: '📺' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'space', label: 'Space', emoji: '🚀' },
    { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦕' },
    { id: 'drawing', label: 'Drawing', emoji: '🎨' },
  ],
  teens: [
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'social-media', label: 'Social Media', emoji: '📱' },
    { id: 'movies', label: 'Movies', emoji: '🎬' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'fashion', label: 'Fashion', emoji: '👗' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'coding', label: 'Coding', emoji: '💻' },
  ],
  adults: [
    { id: 'technology', label: 'Technology', emoji: '💻' },
    { id: 'business', label: 'Business', emoji: '💼' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'health', label: 'Health', emoji: '🏋️' },
    { id: 'finance', label: 'Finance', emoji: '📈' },
    { id: 'leadership', label: 'Leadership', emoji: '👔' },
    { id: 'art', label: 'Art', emoji: '🎨' },
    { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  ],
};

const DemographicsPhase = ({ onComplete }: DemographicsPhaseProps) => {
  const [step, setStep] = useState<Step>('intro');
  const [age, setAge] = useState('');
  const [ageValue, setAgeValue] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
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

  const getInterestsForAge = () => {
    if (ageValue < 12) return INTERESTS_BY_AGE.kids;
    if (ageValue < 18) return INTERESTS_BY_AGE.teens;
    return INTERESTS_BY_AGE.adults;
  };

  const handleAgeSubmit = () => {
    const parsed = parseInt(age);
    if (isNaN(parsed) || parsed < 4 || parsed > 99) return;
    setAgeValue(parsed);
    setMessages(prev => [...prev, { role: 'user', text: `I'm ${parsed} years old.` }]);
    setStep('ageResponse');
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setMessages(prev => [...prev, { role: 'user', text: goal }]);
    setStep('goalResponse');
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleInterestsSubmit = () => {
    if (selectedInterests.length < 2) return;
    const interestLabels = getInterestsForAge()
      .filter(i => selectedInterests.includes(i.id))
      .map(i => i.label);
    setMessages(prev => [...prev, { role: 'user', text: interestLabels.join(', ') }]);
    setTimeout(() => onComplete({ age: ageValue, goal: selectedGoal, interests: interestLabels }), 500);
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

          {step === 'goalResponse' && (
            <ChatBubble
              key="goalResp"
              role="guide"
              message="Nice choice! 🌟 One more thing..."
              animate
              onTypingComplete={() => {
                setMessages(prev => [...prev, { role: 'guide', text: 'Nice choice! 🌟 One more thing...' }]);
                setStep('askInterests');
              }}
            />
          )}

          {step === 'askInterests' && (
            <ChatBubble
              key="askInterests"
              role="guide"
              message="What are some things you love? Pick 2–4 topics so I can personalize your lessons! 🎯"
              animate
              onTypingComplete={() => {
                setMessages(prev => [...prev, { role: 'guide', text: 'What are some things you love? Pick 2–4 topics so I can personalize your lessons! 🎯' }]);
                setStep('waitInterests');
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

        {step === 'waitInterests' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mt-2"
          >
            <div className="flex flex-wrap gap-2">
              {getInterestsForAge().map(interest => (
                <motion.button
                  key={interest.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all border ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-violet-500/40 border-violet-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      : 'backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {interest.emoji} {interest.label}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleInterestsSubmit}
                disabled={selectedInterests.length < 2}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/40 text-xs text-center">
              {selectedInterests.length}/4 selected (min 2)
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DemographicsPhase;
