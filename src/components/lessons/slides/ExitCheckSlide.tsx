import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';
import { Award, Star, Trophy } from 'lucide-react';

interface ExitCheckSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function ExitCheckSlide({ slide, onComplete, onNext }: ExitCheckSlideProps) {
  const achievements = [
    { icon: '👋', text: 'Can say Hello and Goodbye' },
    { icon: '🗣️', text: 'Can introduce yourself' },
    { icon: '🤝', text: 'Can say "Nice to meet you"' },
    { icon: '🔤', text: 'Learned letter A words' }
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-4xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-xl text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardContent className="p-8">
            {slide.media?.url && (
              <div className="text-center mb-6">
                <img 
                  src={slide.media.url} 
                  alt={slide.media.alt}
                  className="w-32 h-32 mx-auto rounded-full border-4 border-primary"
                />
              </div>
            )}

            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center gap-2 mb-4"
              >
                <Award className="h-8 w-8 text-yellow-500" />
                <span className="text-2xl font-bold text-primary">Friendly Greeter Badge</span>
                <Award className="h-8 w-8 text-yellow-500" />
              </motion.div>
              
              <div className="text-lg text-muted-foreground mb-6">
                You've successfully completed Lesson 1.1!
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="font-semibold text-green-700">{achievement.text}</span>
                  <Star className="h-4 w-4 text-green-500 ml-auto" />
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <Button 
                  onClick={onNext}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3"
                >
                  Continue to Next Lesson! 🚀
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <div className="text-sm text-muted-foreground mb-2">
            Share your achievement:
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">📱 Share</Button>
            <Button variant="outline" size="sm">🎯 Set Goal</Button>
            <Button variant="outline" size="sm">📊 View Progress</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}