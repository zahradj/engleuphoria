import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AudioButton } from '@/components/lessons/slides/AudioButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Check } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';

interface DialogueBuilderProps {
  characterName: string;
  characterImage?: string;
  characterGreeting: string;
  studentName: string;
  onComplete: () => void;
}

type DialogueStep = 'greeting' | 'introduction' | 'response' | 'complete';

export function DialogueBuilder({
  characterName,
  characterImage,
  characterGreeting,
  studentName,
  onComplete
}: DialogueBuilderProps) {
  const [currentStep, setCurrentStep] = useState<DialogueStep>('greeting');
  const [userInput, setUserInput] = useState('');
  const [dialogue, setDialogue] = useState<string[]>([]);

  const handleStepComplete = (text: string) => {
    soundEffectsService.playCorrect();
    setDialogue([...dialogue, text]);
    
    switch (currentStep) {
      case 'greeting':
        setTimeout(() => {
          setDialogue(prev => [...prev, characterGreeting]);
          setCurrentStep('introduction');
        }, 800);
        break;
      case 'introduction':
        setTimeout(() => {
          setDialogue(prev => [...prev, `Nice to meet you, ${studentName}!`]);
          setCurrentStep('response');
        }, 800);
        break;
      case 'response':
        setCurrentStep('complete');
        setTimeout(() => {
          soundEffectsService.playCelebration();
          onComplete();
        }, 1500);
        break;
    }
    
    setUserInput('');
  };

  const getPrompt = () => {
    switch (currentStep) {
      case 'greeting':
        return "Say: Hello!";
      case 'introduction':
        return `Say: My name is ${studentName}`;
      case 'response':
        return "Say: Nice to meet you, too!";
      default:
        return "Great job!";
    }
  };

  const getExpectedInput = () => {
    switch (currentStep) {
      case 'greeting':
        return 'Hello';
      case 'introduction':
        return `My name is ${studentName}`;
      case 'response':
        return 'Nice to meet you, too';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-[500px]">
      {/* Character */}
      <div className="flex items-center gap-4">
        {characterImage && (
          <img 
            src={characterImage} 
            alt={characterName}
            className="w-32 h-32 rounded-full border-4 border-primary"
          />
        )}
        <div>
          <h2 className="text-3xl font-bold">{characterName}</h2>
          <p className="text-muted-foreground">Let's practice!</p>
        </div>
      </div>

      {/* Dialogue History */}
      <div className="w-full max-w-2xl space-y-4 min-h-[200px]">
        <AnimatePresence>
          {dialogue.map((text, index) => {
            const isStudent = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isStudent ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${isStudent ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[70%] p-4 rounded-lg ${
                  isStudent 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-lg font-medium">{text}</p>
                  <AudioButton text={text} voice={isStudent ? 'nova' : 'alloy'} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      {currentStep !== 'complete' && (
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl space-y-4"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-primary mb-2">{getPrompt()}</p>
            <AudioButton text={getExpectedInput()} autoPlay />
          </div>

          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type here..."
              className="text-xl h-14"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userInput.trim()) {
                  handleStepComplete(userInput);
                }
              }}
            />
            <Button
              onClick={() => handleStepComplete(userInput)}
              disabled={!userInput.trim()}
              size="lg"
              className="h-14 px-8"
            >
              <Check className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center">
            <Button
              onClick={() => handleStepComplete(getExpectedInput())}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Mic className="h-5 w-5" />
              Use suggested phrase
            </Button>
          </div>
        </motion.div>
      )}

      {/* Completion Message */}
      {currentStep === 'complete' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-primary">Perfect dialogue!</h3>
          <p className="text-xl text-muted-foreground mt-2">
            You can introduce yourself in English!
          </p>
        </motion.div>
      )}
    </div>
  );
}
