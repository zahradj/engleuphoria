import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { SlideMaster } from '@/components/slides/SlideMaster';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slide } from '@/types/slides';
import { Clock, Star, BookOpen, Trophy, Award, Target } from 'lucide-react';

interface BadgeItem {
  id: string;
  name: string;
  icon: React.ElementType;
  earned: boolean;
}

interface TestInterfaceProps {
  slide: Slide;
  currentSlide: number;
  totalSlides: number;
  progress: number;
  timeElapsed: number;
  badges: BadgeItem[];
  onNext: () => void;
  onComplete?: () => void;
}

export function TestInterface({
  slide,
  currentSlide,
  totalSlides,
  progress,
  timeElapsed,
  badges,
  onNext,
  onComplete
}: TestInterfaceProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/80 backdrop-blur-xl border-b shadow-sm relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="small" />
            
            <div className="flex items-center gap-6">
              {/* Progress Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant="outline" className="text-sm font-semibold px-4 py-2 bg-primary/5 border-primary/20">
                  Question {currentSlide + 1} of {totalSlides}
                </Badge>
              </motion.div>

              {/* Timer */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-secondary/5 px-4 py-2 rounded-lg border border-secondary/20"
              >
                <Clock className="h-4 w-4 text-secondary" />
                <span className="font-mono font-semibold text-secondary">
                  {formatTime(timeElapsed)}
                </span>
              </motion.div>

              {/* Earned Badges Count */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-accent/5 px-4 py-2 rounded-lg border border-accent/20"
              >
                <Trophy className="h-4 w-4 text-accent" />
                <span className="font-semibold text-accent">
                  {badges.filter(b => b.earned).length}/{badges.length}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="mt-4"
          >
            <Progress value={progress} className="h-2" />
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SlideMaster
              slide={slide}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onNext={onNext}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
