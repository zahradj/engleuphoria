import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchPair } from '@/types/slides';

interface WordPairDragDropProps {
  pairs: MatchPair[];
  onComplete: (correct: boolean, attempts: number) => void;
  showFeedback?: boolean;
  currentSection?: number;
  totalSections?: number;
  sectionTitle?: string;
}

interface DropZone {
  id: string;
  leftWord: string;
  rightWord: string;
  isCorrect?: boolean;
  isMatched: boolean;
}

export function WordPairDragDrop({ 
  pairs, 
  onComplete, 
  showFeedback = false,
  currentSection = 1,
  totalSections = 5,
  sectionTitle = "Drag & Drop – Word Pairs"
}: WordPairDragDropProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [incorrectMatches, setIncorrectMatches] = useState<Set<string>>(new Set());

  // Create shuffled arrays for left and right words
  const leftWords = pairs.map(pair => ({ id: pair.id, text: pair.left, image: pair.leftImage }));
  const rightWords = pairs.map(pair => ({ id: pair.id, text: pair.right, image: pair.rightImage }))
    .sort(() => Math.random() - 0.5); // Shuffle right words

  const handleDragStart = useCallback((leftId: string) => {
    if (showFeedback) return;
    setDraggedItem(leftId);
  }, [showFeedback]);

  const handleDrop = useCallback((rightId: string) => {
    if (!draggedItem || showFeedback) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Check if this is a correct match
    const isCorrect = draggedItem === rightId;
    
    if (isCorrect) {
      setMatches(prev => ({ ...prev, [draggedItem]: rightId }));
      setIncorrectMatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(draggedItem);
        return newSet;
      });
    } else {
      setIncorrectMatches(prev => new Set([...prev, draggedItem]));
      // Remove from matches if incorrectly placed
      setMatches(prev => {
        const newMatches = { ...prev };
        delete newMatches[draggedItem];
        return newMatches;
      });
    }

    setDraggedItem(null);

    // Check if all pairs are correctly matched
    const correctMatches = Object.keys(matches).length + (isCorrect ? 1 : 0);
    if (correctMatches === pairs.length) {
      setTimeout(() => onComplete(true, newAttempts), 500);
    }
  }, [draggedItem, attempts, pairs.length, matches, onComplete, showFeedback]);

  const isWordMatched = (wordId: string) => {
    return Object.keys(matches).includes(wordId) || Object.values(matches).includes(wordId);
  };

  const completedCount = Object.keys(matches).length;
  const progress = (completedCount / pairs.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header with Progress */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">English Quiz Progress</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">Section {currentSection} of {totalSections}</Badge>
            <span>Overall Progress</span>
            <span className="font-medium">{completedCount}/{pairs.length} completed</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="w-full h-2" />

      {/* Quiz Section */}
      <div className="bg-card rounded-lg border p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <span className="text-2xl">🔤</span>
            <span>{sectionTitle}</span>
          </div>
          <p className="text-muted-foreground">Drag each word to its opposite</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Words */}
          <div className="space-y-3">
            <h4 className="font-semibold text-center text-primary mb-4">Words</h4>
            <div className="space-y-3">
              {leftWords.map((word) => {
                const isMatched = isWordMatched(word.id);
                const isIncorrect = incorrectMatches.has(word.id);
                
                if (isMatched && !isIncorrect) return null; // Hide matched words
                
                return (
                  <Button
                    key={word.id}
                    variant="outline"
                    draggable={!showFeedback && !isMatched}
                    onDragStart={() => handleDragStart(word.id)}
                    className={cn(
                      "w-full h-12 justify-start cursor-grab active:cursor-grabbing",
                      "transition-all duration-200 hover-scale",
                      isIncorrect && "bg-error-soft border-error text-error-on animate-pulse",
                      draggedItem === word.id && "opacity-50 scale-95",
                      isMatched && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isMatched && !isIncorrect}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {word.image && (
                        <img
                          src={word.image}
                          alt=""
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span className="flex-1 text-left">{word.text}</span>
                      {isIncorrect && (
                        <XCircle className="h-4 w-4 text-error" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Right Column - Drop Targets */}
          <div className="space-y-3">
            <h4 className="font-semibold text-center text-primary mb-4">Opposites</h4>
            <div className="space-y-3">
              {rightWords.map((word) => {
                const isTargetMatched = isWordMatched(word.id);
                const matchedLeftId = Object.keys(matches).find(leftId => matches[leftId] === word.id);
                
                return (
                  <div
                    key={word.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(word.id)}
                    className={cn(
                      "w-full h-12 border-2 border-dashed rounded-md",
                      "flex items-center justify-center transition-all duration-200",
                      "bg-surface/30 border-border",
                      draggedItem && !isTargetMatched && "border-primary bg-primary-soft",
                      isTargetMatched && "bg-success-soft border-success"
                    )}
                  >
                    {isTargetMatched && matchedLeftId ? (
                      <div className="flex items-center gap-3 px-4 w-full">
                        <span className="flex-1 text-left font-medium">{word.text}</span>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 w-full">
                        {word.image && (
                          <img
                            src={word.image}
                            alt=""
                            className="w-6 h-6 object-cover rounded opacity-60"
                          />
                        )}
                        <span className="flex-1 text-left text-muted-foreground">{word.text}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {draggedItem && (
          <div className="text-center animate-fade-in">
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Drag to the matching opposite word
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" disabled>
          Previous Section
        </Button>
        <Button 
          variant="outline"
          disabled={completedCount < pairs.length}
          onClick={() => completedCount === pairs.length && onComplete(true, attempts)}
        >
          Skip to Next
        </Button>
      </div>
    </div>
  );
}