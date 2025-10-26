import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SlideThemeProps {
  type: string;
  children: React.ReactNode;
  className?: string;
}

const themeStyles = {
  warmup: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100',
  vocabulary_preview: 'bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100',
  target_language: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100',
  listening_comprehension: 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100',
  sentence_builder: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100',
  grammar_focus: 'bg-gradient-to-br from-green-50 via-teal-50 to-green-100',
  controlled_practice: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100',
  communicative_task: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100',
  match: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100',
  drag_drop: 'bg-gradient-to-br from-purple-50 via-fuchsia-50 to-purple-100',
  accuracy_mcq: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100',
  picture_description: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100',
  review_consolidation: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100',
  default: 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'
};

const emojis = {
  warmup: '🎵',
  vocabulary_preview: '📚',
  target_language: '🎯',
  listening_comprehension: '👂',
  sentence_builder: '🔨',
  grammar_focus: '📝',
  controlled_practice: '💪',
  communicative_task: '💬',
  match: '🎮',
  drag_drop: '🎯',
  accuracy_mcq: '✅',
  picture_description: '🖼️',
  review_consolidation: '⭐',
  default: '📖'
};

export function SlideTheme({ type, children, className }: SlideThemeProps) {
  const themeClass = themeStyles[type as keyof typeof themeStyles] || themeStyles.default;
  const emoji = emojis[type as keyof typeof emojis] || emojis.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('min-h-screen p-6 relative overflow-hidden', themeClass, className)}
    >
      {/* Decorative floating emoji */}
      <motion.div
        className="absolute top-8 right-8 text-6xl opacity-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {emoji}
      </motion.div>
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
      
      {children}
    </motion.div>
  );
}
