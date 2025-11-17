import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, MessageCircle } from 'lucide-react';

interface DialogueLine {
  speaker: string;
  text: string;
}

interface DialogueBuilderProps {
  dialogueLines: DialogueLine[];
  onComplete: (correct: boolean) => void;
}

export function DialogueBuilder({ dialogueLines, onComplete }: DialogueBuilderProps) {
  const [shuffledLines, setShuffledLines] = useState(() => 
    [...dialogueLines].sort(() => Math.random() - 0.5)
  );
  const [selectedLines, setSelectedLines] = useState<DialogueLine[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleLineClick = (line: DialogueLine, fromSelected: boolean) => {
    if (isChecked) return;
    
    if (fromSelected) {
      setSelectedLines(selectedLines.filter(l => l !== line));
      setShuffledLines([...shuffledLines, line]);
    } else {
      setShuffledLines(shuffledLines.filter(l => l !== line));
      setSelectedLines([...selectedLines, line]);
    }
  };

  const checkAnswer = () => {
    const correct = JSON.stringify(selectedLines) === JSON.stringify(dialogueLines);
    setIsCorrect(correct);
    setIsChecked(true);
    onComplete(correct);
  };

  const reset = () => {
    setShuffledLines([...dialogueLines].sort(() => Math.random() - 0.5));
    setSelectedLines([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-foreground">Build the Dialogue!</h3>
        <p className="text-muted-foreground">Put the conversation in the correct order</p>
      </div>

      {/* Selected Lines (Dialogue Order) */}
      <Card className="p-6 min-h-[200px] bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-dashed border-primary/30">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm text-muted-foreground">Conversation Order</span>
        </div>
        <div className="space-y-2">
          {selectedLines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleLineClick(line, true)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                isChecked 
                  ? (isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300')
                  : 'bg-card border-border hover:border-primary/50 hover:shadow-md'
              } border-2`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-primary mb-1">{line.speaker}</div>
                  <div className="text-foreground">{line.text}</div>
                </div>
              </div>
            </motion.div>
          ))}
          {selectedLines.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Click dialogue lines below to add them here
            </div>
          )}
        </div>
      </Card>

      {/* Available Lines */}
      <div className="space-y-3">
        <div className="font-semibold text-sm text-muted-foreground">Available Lines:</div>
        {shuffledLines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleLineClick(line, false)}
            className="p-4 rounded-lg bg-card border-2 border-border hover:border-primary hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="font-bold text-sm text-primary">{line.speaker}:</div>
              <div className="text-foreground flex-1">{line.text}</div>
            </div>
          </motion.div>
        ))}
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
                Perfect dialogue order!
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                Not quite right. Try again!
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

      {!isChecked && selectedLines.length === dialogueLines.length && (
        <div className="flex justify-center">
          <Button onClick={checkAnswer} size="lg" className="px-8">
            Check Dialogue
          </Button>
        </div>
      )}
    </div>
  );
}
