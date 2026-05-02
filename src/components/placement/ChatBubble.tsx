import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';
import logoMark from '@/assets/logo-white.png';

interface ChatBubbleProps {
  role: 'guide' | 'user';
  message: string;
  animate?: boolean;
  onTypingComplete?: () => void;
}

const ChatBubble = ({ role, message, animate = false, onTypingComplete }: ChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {role === 'guide' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg overflow-hidden">
          <img
            src={logoMark}
            alt="EnglEuphoria guide"
            className="w-6 h-6 object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>
      )}

      <div
        className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
          role === 'guide'
            ? 'backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            : 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white ml-auto'
        }`}
      >
        {role === 'guide' && animate ? (
          <TypewriterText text={message} onComplete={onTypingComplete} />
        ) : (
          <span>{message}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
