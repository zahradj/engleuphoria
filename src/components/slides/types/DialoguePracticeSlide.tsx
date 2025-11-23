import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

interface DialogueLine {
  character: string;
  text: string;
  audioFile?: string;
  options?: DialogueOption[];
}

interface DialoguePracticeSlideProps {
  slide: {
    prompt: string;
    instructions: string;
    dialogue?: DialogueLine[];
    scenario?: string;
    imagePrompt?: string;
  };
  slideNumber: number;
  onNext?: () => void;
}

export function DialoguePracticeSlide({ slide, slideNumber, onNext }: DialoguePracticeSlideProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [completed, setCompleted] = useState(false);

  const dialogue = slide.dialogue || [
    {
      character: 'Teacher',
      text: 'Hello! How are you today?',
      options: [
        { id: 'opt1', text: "I'm fine, thank you!", isCorrect: true, feedback: 'Perfect! 🎉' },
        { id: 'opt2', text: "I'm good, thanks you!", isCorrect: false, feedback: 'Almost! Say "thank you" not "thanks you"' },
        { id: 'opt3', text: "I fine!", isCorrect: false, feedback: 'Remember to use "am" → "I am fine"' }
      ]
    }
  ];

  const currentDialogue = dialogue[currentLine];

  const handleOptionSelect = (option: DialogueOption) => {
    setSelectedOption(option.id);
    setFeedback(option.feedback || '');

    if (option.isCorrect) {
      setTimeout(() => {
        if (currentLine < dialogue.length - 1) {
          setCurrentLine(currentLine + 1);
          setSelectedOption(null);
          setFeedback('');
        } else {
          setCompleted(true);
        }
      }, 1500);
    }
  };

  const playAudio = (audioFile?: string) => {
    console.log(`Playing audio: ${audioFile}`);
    // Audio playback placeholder
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{slide.prompt}</h2>
        <p className="text-muted-foreground">{slide.instructions}</p>
        {slide.scenario && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">📍 Scenario: {slide.scenario}</p>
          </div>
        )}
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLine}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Character Speech */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">{currentDialogue.character}</span>
                    {currentDialogue.audioFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playAudio(currentDialogue.audioFile)}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md">
                    <p className="text-lg">{currentDialogue.text}</p>
                  </div>
                </div>
              </div>

              {/* Response Options */}
              {currentDialogue.options && (
                <div className="space-y-3 pl-20">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    👉 Choose your response:
                  </p>
                  {currentDialogue.options.map((option) => (
                    <Button
                      key={option.id}
                      variant={selectedOption === option.id ? (option.isCorrect ? 'default' : 'destructive') : 'outline'}
                      className="w-full justify-start text-left h-auto py-4 px-6"
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                    >
                      <span className="text-base">{option.text}</span>
                    </Button>
                  ))}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    selectedOption && dialogue[currentLine].options?.find(o => o.id === selectedOption)?.isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <p className="font-medium">{feedback}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              Line {currentLine + 1} of {dialogue.length}
            </span>
            {completed && onNext && (
              <Button onClick={onNext} size="lg">
                Continue 🎉
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
