import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LessonProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  stars: number;
  maxStars?: number;
}

export function LessonProgressBar({ 
  currentSlide, 
  totalSlides, 
  stars, 
  maxStars = 5 
}: LessonProgressBarProps) {
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="w-full bg-card border-b shadow-sm p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Slide {currentSlide + 1} of {totalSlides}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Stars display */}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxStars }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: index < stars ? 1 : 0.7,
                  rotate: 0 
                }}
                transition={{ 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200 
                }}
              >
                <Star
                  className={`h-6 w-6 ${
                    index < stars
                      ? 'fill-yellow-400 text-yellow-500'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </motion.div>
            ))}
            <span className="ml-2 font-bold text-lg">
              {stars}/{maxStars}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
