import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClozeGap } from '@/types/slides';

interface ClozeActivityProps {
  text: string;
  gaps: ClozeGap[];
  onComplete: (correct: boolean, attempts: number) => void;
  showFeedback?: boolean;
}

export function ClozeActivity({ text, gaps, onComplete, showFeedback = false }: ClozeActivityProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = useCallback((gapId: string, value: string) => {
    if (showFeedback) return;
    setAnswers(prev => ({ ...prev, [gapId]: value.trim() }));
  }, [showFeedback]);

  const handleOptionSelect = useCallback((gapId: string, option: string) => {
    if (showFeedback) return;
    setAnswers(prev => ({ ...prev, [gapId]: option }));
  }, [showFeedback]);

  const checkAnswers = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setShowResults(true);

    const correctAnswers = gaps.every(gap => {
      const userAnswer = answers[gap.id]?.toLowerCase().trim();
      return gap.correctAnswers.some(correct => 
        correct.toLowerCase().trim() === userAnswer
      );
    });

    setTimeout(() => {
      onComplete(correctAnswers, newAttempts);
    }, 1000);
  }, [answers, gaps, attempts, onComplete]);

  const isGapCorrect = (gapId: string) => {
    if (!showResults) return null;
    const gap = gaps.find(g => g.id === gapId);
    const userAnswer = answers[gapId]?.toLowerCase().trim();
    return gap?.correctAnswers.some(correct => 
      correct.toLowerCase().trim() === userAnswer
    );
  };

  const renderGap = (gapId: string) => {
    const gap = gaps.find(g => g.id === gapId);
    if (!gap) return null;

    const isCorrect = isGapCorrect(gapId);
    const hasOptions = gap.options && gap.options.length > 0;

    return (
      <span key={gapId} className="inline-flex items-center gap-2 mx-1">
        {hasOptions ? (
          <div className="flex flex-wrap gap-1">
            {gap.options!.map((option, index) => (
              <Button
                key={index}
                variant={answers[gapId] === option ? "default" : "outline"}
                size="sm"
                onClick={() => handleOptionSelect(gapId, option)}
                disabled={showFeedback}
                className={cn(
                  "text-xs px-2 py-1 hover-scale",
                  showResults && answers[gapId] === option && isCorrect && "bg-success-soft border-success text-success-on",
                  showResults && answers[gapId] === option && !isCorrect && "bg-error-soft border-error text-error-on"
                )}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <Input
            value={answers[gapId] || ''}
            onChange={(e) => handleAnswerChange(gapId, e.target.value)}
            placeholder="___"
            disabled={showFeedback}
            className={cn(
              "inline-block w-24 h-8 text-center",
              showResults && isCorrect && "border-success bg-success-soft",
              showResults && isCorrect === false && "border-error bg-error-soft"
            )}
          />
        )}
        
        {showResults && (
          <span className="inline-flex">
            {isCorrect ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-error" />
            )}
          </span>
        )}
      </span>
    );
  };

  const processText = () => {
    let processedText = text;
    
    // Replace gaps with rendered components
    gaps.forEach(gap => {
      const gapPlaceholder = `[${gap.id}]`;
      const gapComponent = renderGap(gap.id);
      processedText = processedText.replace(gapPlaceholder, `__GAP_${gap.id}__`);
    });

    // Split text and insert gap components
    const parts = processedText.split(/(__GAP_[^_]+__)/);
    
    return parts.map((part, index) => {
      const gapMatch = part.match(/__GAP_([^_]+)__/);
      if (gapMatch) {
        return renderGap(gapMatch[1]);
      }
      return <span key={index}>{part}</span>;
    });
  };

  const allAnswered = gaps.every(gap => answers[gap.id]?.trim());

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
      <div className="text-lg leading-relaxed p-6 bg-surface rounded-lg border border-border">
        {processText()}
      </div>
      
      {!showResults && (
        <div className="text-center">
          <Button
            onClick={checkAnswers}
            disabled={!allAnswered}
            size="lg"
            className="hover-scale"
          >
            Check Answers
          </Button>
          {!allAnswered && (
            <p className="text-sm text-text-muted mt-2">
              Fill in all the gaps to continue
            </p>
          )}
        </div>
      )}
      
      {showResults && (
        <div className="text-center animate-fade-in">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
            gaps.every(gap => isGapCorrect(gap.id)) 
              ? "bg-success-soft text-success-on" 
              : "bg-error-soft text-error-on"
          )}>
            {gaps.every(gap => isGapCorrect(gap.id)) ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Excellent! All correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span>Some answers need correction</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}