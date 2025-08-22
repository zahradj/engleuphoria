import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchPair } from '@/types/slides';

interface MatchPairsProps {
  pairs: MatchPair[];
  onComplete: (correct: boolean, attempts: number) => void;
  showFeedback?: boolean;
}

export function MatchPairs({ pairs, onComplete, showFeedback = false }: MatchPairsProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [incorrectMatches, setIncorrectMatches] = useState<Set<string>>(new Set());

  const leftItems = pairs.map(pair => ({ id: pair.id, text: pair.left, image: pair.leftImage }));
  const rightItems = pairs.map(pair => ({ id: pair.id, text: pair.right, image: pair.rightImage }));

  const handleLeftClick = useCallback((id: string) => {
    if (matches[id] || showFeedback) return;
    setSelectedLeft(selectedLeft === id ? null : id);
    setSelectedRight(null);
  }, [selectedLeft, matches, showFeedback]);

  const handleRightClick = useCallback((id: string) => {
    if (Object.values(matches).includes(id) || showFeedback) return;
    
    if (selectedLeft && selectedLeft !== id) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // Check if match is correct
      const correctPair = pairs.find(pair => pair.id === selectedLeft);
      const isCorrectMatch = correctPair && correctPair.id === id;
      if (isCorrectMatch) {
        // Correct match
        setMatches(prev => ({ ...prev, [selectedLeft]: id }));
        setIncorrectMatches(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedLeft);
          return newSet;
        });
      } else {
        // Incorrect match
        setIncorrectMatches(prev => new Set([...prev, selectedLeft]));
      }
      
      setSelectedLeft(null);
      setSelectedRight(null);
      
      // Check if all pairs are matched
      const totalMatched = Object.keys(matches).length + (isCorrectMatch ? 1 : 0);
      if (totalMatched === pairs.length) {
        setTimeout(() => onComplete(true, newAttempts), 500);
      }
    } else {
      setSelectedRight(selectedRight === id ? null : id);
      setSelectedLeft(null);
    }
  }, [selectedLeft, selectedRight, matches, attempts, pairs, onComplete, showFeedback]);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-center text-text mb-4">Match these:</h4>
          {leftItems.map((item) => {
            const isMatched = matches[item.id];
            const isSelected = selectedLeft === item.id;
            const isIncorrect = incorrectMatches.has(item.id);
            
            return (
              <Button
                key={item.id}
                variant={isSelected ? "default" : "outline"}
                size="lg"
                onClick={() => handleLeftClick(item.id)}
                disabled={!!isMatched || showFeedback}
                className={cn(
                  "w-full min-h-[80px] p-4 text-left justify-start relative hover-scale",
                  "transition-all duration-200",
                  !!isMatched && "bg-success-soft border-success text-success-on",
                  isIncorrect && !isMatched && "bg-error-soft border-error text-error-on animate-pulse",
                  isSelected && "ring-2 ring-primary-500"
                )}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-16 object-cover rounded mr-4 flex-shrink-0"
                  />
                )}
                <span className="flex-1 text-wrap">{item.text}</span>
                
                {!!isMatched && (
                  <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-success" />
                )}
                {isIncorrect && !isMatched && (
                  <XCircle className="absolute top-2 right-2 h-5 w-5 text-error animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-center text-text mb-4">With these:</h4>
          {rightItems.map((item) => {
            const isMatched = Object.values(matches).includes(item.id);
            const isSelected = selectedRight === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isSelected ? "default" : "outline"}
                size="lg"
                onClick={() => handleRightClick(item.id)}
                disabled={isMatched || showFeedback}
                className={cn(
                  "w-full min-h-[80px] p-4 text-left justify-start relative hover-scale",
                  "transition-all duration-200",
                  isMatched && "bg-success-soft border-success text-success-on",
                  isSelected && "ring-2 ring-primary-500"
                )}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-16 object-cover rounded mr-4 flex-shrink-0"
                  />
                )}
                <span className="flex-1 text-wrap">{item.text}</span>
                
                {isMatched && (
                  <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-success" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
      
      {selectedLeft && (
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-text-muted">Now select the matching item from the right column</p>
        </div>
      )}
    </div>
  );
}