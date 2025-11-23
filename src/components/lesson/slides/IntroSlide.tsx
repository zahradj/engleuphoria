import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface IntroSlideProps {
  title: string;
  topic: string;
  ageGroup: string;
  backgroundUrl?: string;
  onStart: () => void;
}

export function IntroSlide({
  title,
  topic,
  ageGroup,
  backgroundUrl,
  onStart
}: IntroSlideProps) {
  // Determine styling based on age group
  const isKids = ageGroup === '5-7' || ageGroup === '8-11';
  const isTeens = ageGroup === '12-14';

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background */}
      {backgroundUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      ) : (
        <div className={`absolute inset-0 ${
          isKids 
            ? 'bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20'
            : isTeens
            ? 'bg-gradient-to-br from-primary/10 via-background to-accent/10'
            : 'bg-gradient-to-br from-background via-muted to-background'
        }`} />
      )}

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`font-bold mb-4 ${
            backgroundUrl ? 'text-white' : 'text-foreground'
          } ${
            isKids ? 'text-5xl' : isTeens ? 'text-4xl' : 'text-3xl'
          }`}>
            {title || topic}
          </h1>
          
          <p className={`text-lg mb-8 ${
            backgroundUrl ? 'text-white/90' : 'text-muted-foreground'
          } ${
            isKids ? 'text-2xl' : 'text-xl'
          }`}>
            Let's learn about {topic.toLowerCase()}!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={onStart}
            className={`${
              isKids ? 'text-xl py-8 px-12' : 'text-lg py-6 px-10'
            } shadow-lg hover:shadow-xl transition-all`}
          >
            <Play className="mr-2 h-6 w-6" />
            Start Lesson
          </Button>
        </motion.div>

        {/* Mascot for kids */}
        {isKids && (
          <motion.div
            className="absolute bottom-0 right-0 text-8xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            🎓
          </motion.div>
        )}
      </div>
    </div>
  );
}
