import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';
import { Mic, Volume2 } from 'lucide-react';

interface PronunciationSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function PronunciationSlide({ slide, onComplete, onNext }: PronunciationSlideProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const playAudio = () => {
    console.log('Playing pronunciation audio:', slide.media?.url);
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      if (onComplete) onComplete();
    }, 3000);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Button 
                onClick={playAudio}
                size="lg"
                variant="outline"
                className="mb-4"
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Listen First
              </Button>
            </div>

            <div className="bg-secondary/20 p-6 rounded-lg mb-6">
              <div className="text-2xl font-bold mb-2">Practice saying:</div>
              <div className="text-xl text-primary">
                "Hello, my name is ___. Nice to meet you."
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={startRecording}
                size="lg"
                className={`bg-red-500 hover:bg-red-600 text-white ${
                  isRecording ? 'animate-pulse' : ''
                }`}
                disabled={isRecording || hasRecorded}
              >
                <Mic className="h-5 w-5 mr-2" />
                {isRecording ? 'Recording...' : hasRecorded ? 'Recorded!' : 'Start Speaking'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {hasRecorded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-700 mb-2">
                  🎉 Great pronunciation!
                </div>
                <div className="text-lg">
                  You're speaking clearly and confidently!
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}