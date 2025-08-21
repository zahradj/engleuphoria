import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, RotateCcw, Lightbulb } from 'lucide-react';

interface ControlledOutputProps {
  slide: {
    id: string;
    prompt: string;
    instructions?: string;
    media?: {
      type: string;
      url: string;
      alt?: string;
    };
    correct?: string | string[];
    timeLimit?: number;
  };
  onComplete: (result: { 
    correct: boolean; 
    timeMs: number; 
    response: string; 
    attempts: number 
  }) => void;
}

export function ControlledOutput({ slide, onComplete }: ControlledOutputProps) {
  const [response, setResponse] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);

  const checkResponse = () => {
    const timeMs = Date.now() - startTime;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Simple validation - check if response contains key words/patterns
    const expectedAnswers = Array.isArray(slide.correct) ? slide.correct : [slide.correct];
    const hasValidResponse = response.trim().length >= 10; // Minimum length check
    const containsKeywords = expectedAnswers.some(answer => 
      answer && response.toLowerCase().includes(answer.toLowerCase())
    );
    
    const isCorrect = hasValidResponse && (containsKeywords || newAttempts >= 2); // Allow after 2 attempts
    
    if (isCorrect) {
      setIsCompleted(true);
      onComplete({
        correct: true,
        timeMs,
        response: response.trim(),
        attempts: newAttempts
      });
    } else if (newAttempts >= 3) {
      // Allow completion after 3 attempts
      setIsCompleted(true);
      onComplete({
        correct: false,
        timeMs,
        response: response.trim(),
        attempts: newAttempts
      });
    } else {
      setShowHint(true);
    }
  };

  const resetResponse = () => {
    setResponse('');
    setShowHint(false);
  };

  const wordCount = response.trim().split(' ').filter(word => word.length > 0).length;
  const minWords = 4;
  const maxWords = 6;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="space-y-2">
          <h3 className="font-semibold text-primary flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Writing Challenge
          </h3>
          <p className="text-sm text-muted-foreground">
            {slide.instructions || `Write ${minWords}-${maxWords} sentences using the target language.`}
          </p>
        </div>
      </Card>

      {/* Prompt */}
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">{slide.prompt}</p>
        
        {/* Media if available */}
        {slide.media && slide.media.type === 'image' && (
          <div className="flex justify-center">
            <img 
              src={slide.media.url} 
              alt={slide.media.alt || 'Lesson image'} 
              className="max-w-sm rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Response Area */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Your Response:</label>
            <span className={`text-xs px-2 py-1 rounded ${
              wordCount < minWords ? 'bg-amber-100 text-amber-700' :
              wordCount <= maxWords ? 'bg-emerald-100 text-emerald-700' :
              'bg-red-100 text-red-700'
            }`}>
              {wordCount}/{maxWords} words
            </span>
          </div>
          
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your sentences here..."
            className="min-h-[120px] text-base"
            disabled={isCompleted}
          />
        </div>

        {/* Hint */}
        {showHint && !isCompleted && (
          <Card className="p-3 bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-800">
              💡 Try to include more details or use the vocabulary from this lesson. 
              Aim for {minWords}-{maxWords} complete sentences.
            </p>
          </Card>
        )}

        {/* Feedback */}
        {isCompleted && (
          <Card className="p-4 bg-emerald-50 border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Great work!</span>
            </div>
            <p className="text-sm text-emerald-600 mt-1">
              Your response shows good understanding. Keep practicing!
            </p>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        {!isCompleted && (
          <>
            <Button 
              variant="outline" 
              onClick={resetResponse}
              disabled={!response.trim()}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={checkResponse}
              disabled={wordCount < minWords}
              className="min-w-[120px]"
            >
              Check Response
            </Button>
          </>
        )}
      </div>

      {/* Progress indicator */}
      {attempts > 0 && !isCompleted && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Attempt {attempts}/3
          </p>
        </div>
      )}
    </div>
  );
}