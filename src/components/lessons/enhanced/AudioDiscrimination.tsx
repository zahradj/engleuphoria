import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { ttsService } from '@/services/ttsService';

interface AudioOption {
  text: string;
  audioText?: string;
}

interface AudioDiscriminationProps {
  question: string;
  options: AudioOption[];
  correctIndex: number;
  onComplete: (correct: boolean) => void;
}

export function AudioDiscrimination({ question, options, correctIndex, onComplete }: AudioDiscriminationProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const playAudio = async (index: number) => {
    if (playingIndex !== null) return;
    
    try {
      setPlayingIndex(index);
      const textToSpeak = options[index].audioText || options[index].text;
      const audioUrl = await ttsService.generateSpeech(textToSpeak, 'nova');
      await ttsService.playAudio(audioUrl);
    } catch (error) {
      console.error('Audio playback failed:', error);
    } finally {
      setPlayingIndex(null);
    }
  };

  const handleSelect = (index: number) => {
    if (!isChecked) {
      setSelectedIndex(index);
    }
  };

  const checkAnswer = () => {
    if (selectedIndex === null) return;
    const correct = selectedIndex === correctIndex;
    setIsCorrect(correct);
    setIsChecked(true);
    onComplete(correct);
  };

  const reset = () => {
    setSelectedIndex(null);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Listen and Choose! 👂</h3>
        <p className="text-lg text-muted-foreground">{question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrectOption = idx === correctIndex;
          const showResult = isChecked;

          let bgClass = 'bg-card border-border';
          let hoverClass = 'hover:border-primary hover:bg-primary/5';
          
          if (showResult) {
            if (isCorrectOption) {
              bgClass = 'bg-green-100 border-green-500';
              hoverClass = '';
            } else if (isSelected && !isCorrectOption) {
              bgClass = 'bg-red-100 border-red-500';
              hoverClass = '';
            }
          } else if (isSelected) {
            bgClass = 'bg-primary/10 border-primary';
          }

          return (
            <motion.div
              key={idx}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(idx)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${bgClass} ${hoverClass} ${
                isChecked ? 'cursor-not-allowed' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(idx);
                  }}
                  disabled={playingIndex !== null}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 hover:from-primary/90 hover:to-primary/80 text-primary-foreground"
                >
                  <Volume2 className={`w-10 h-10 ${playingIndex === idx ? 'animate-pulse' : ''}`} />
                </Button>
                <div className="text-center">
                  <div className="font-semibold text-lg text-foreground">{option.text}</div>
                  {showResult && isCorrectOption && (
                    <CheckCircle2 className="w-6 h-6 mx-auto mt-2 text-green-600" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="w-6 h-6 mx-auto mt-2 text-red-600" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Result & Actions */}
      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className={`flex items-center justify-center gap-2 text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Perfect! You heard it correctly!
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                Not quite. Listen again!
              </>
            )}
          </div>
          {!isCorrect && (
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
          )}
        </motion.div>
      )}

      {!isChecked && selectedIndex !== null && (
        <div className="flex justify-center">
          <Button onClick={checkAnswer} size="lg" className="px-8">
            Check Answer
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Click the speaker buttons to hear each option
      </div>
    </Card>
  );
}
