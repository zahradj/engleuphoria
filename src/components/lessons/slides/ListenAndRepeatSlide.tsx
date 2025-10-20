import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Mic, Check } from 'lucide-react';
import { toast } from 'sonner';
import { characterVoiceService } from '@/services/characterVoiceService';

interface ListenAndRepeatSlideProps {
  slide: any;
  onComplete?: () => void;
  onNext?: () => void;
}

export function ListenAndRepeatSlide({ slide, onComplete, onNext }: ListenAndRepeatSlideProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRepeated, setHasRepeated] = useState(false);
  const [completedPhrases, setCompletedPhrases] = useState<boolean[]>([]);

  const phrases = slide.phrases || ['Hello!', 'Nice to meet you!'];

  useEffect(() => {
    setCompletedPhrases(new Array(phrases.length).fill(false));
  }, [phrases.length]);

  const playAudio = async (phrase: string) => {
    setIsPlaying(true);
    try {
      await characterVoiceService.playCharacterVoice({
        text: phrase,
        characterType: 'friendly_teacher',
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Could not play audio');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleRepeat = () => {
    setHasRepeated(true);
    toast.success('Great job! 🎉');
    
    // Mark current phrase as completed
    const newCompleted = [...completedPhrases];
    newCompleted[currentPhraseIndex] = true;
    setCompletedPhrases(newCompleted);

    // Move to next phrase or complete
    if (currentPhraseIndex < phrases.length - 1) {
      setTimeout(() => {
        setCurrentPhraseIndex(currentPhraseIndex + 1);
        setHasRepeated(false);
      }, 1000);
    } else {
      setTimeout(() => {
        onComplete?.();
        onNext?.();
      }, 1500);
    }
  };

  const currentPhrase = phrases[currentPhraseIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8"
    >
      <Card className="max-w-2xl w-full p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">
          {slide.prompt || 'Listen and Repeat'}
        </h2>
        <p className="text-muted-foreground mb-8">
          Listen carefully, then repeat what you hear
        </p>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {phrases.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                completedPhrases[index]
                  ? 'bg-green-500'
                  : index === currentPhraseIndex
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Current phrase display */}
        <motion.div
          key={currentPhraseIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="bg-primary/10 rounded-2xl p-8 mb-6">
            <p className="text-4xl font-bold">{currentPhrase}</p>
          </div>

          {/* Listen button */}
          <Button
            onClick={() => playAudio(currentPhrase)}
            disabled={isPlaying}
            size="lg"
            className="mb-4"
            variant="secondary"
          >
            <Volume2 className="mr-2 h-5 w-5" />
            {isPlaying ? 'Playing...' : 'Listen'}
          </Button>

          {/* Repeat button */}
          <Button
            onClick={handleRepeat}
            disabled={hasRepeated}
            size="lg"
            className="ml-2"
          >
            {hasRepeated ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Done!
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                I Said It!
              </>
            )}
          </Button>
        </motion.div>

        {/* Instructions */}
        <p className="text-sm text-muted-foreground">
          Phrase {currentPhraseIndex + 1} of {phrases.length}
        </p>
      </Card>
    </motion.div>
  );
}
