import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Lightbulb, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RecallChallengeProps {
  questions: Array<{
    imageUrl?: string;
    imagePrompt?: string;
    correctWord: string;
    hint?: string;
  }>;
  onComplete?: (score: number) => void;
}

export const RecallChallenge = ({ questions, onComplete }: RecallChallengeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();

  const current = questions[currentQuestion];
  const progress = ((currentQuestion / questions.length) * 100).toFixed(0);

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === current.correctWord.toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      const points = 10 + (streak * 2);
      setScore(score + points);
      setStreak(streak + 1);
      
      toast({
        title: '🎉 Correct!',
        description: `+${points} points! ${streak > 0 ? `${streak + 1}x streak!` : ''}`,
      });
    } else {
      setStreak(0);
      toast({
        title: '❌ Not quite',
        description: `The correct word was: ${current.correctWord}`,
        variant: 'destructive',
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setShowHint(false);
      setAnswered(false);
      setIsCorrect(false);
    } else {
      // Quiz complete
      if (onComplete) {
        onComplete(score);
      }
    }
  };

  if (currentQuestion >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6">
        <Trophy className="h-24 w-24 text-yellow-500" />
        <h2 className="text-4xl font-bold text-primary">Challenge Complete!</h2>
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center space-y-2">
            <p className="text-5xl font-bold text-primary">{score}</p>
            <p className="text-muted-foreground">Total Points</p>
            <p className="text-sm text-muted-foreground">
              {score >= questions.length * 10 ? 'Perfect score! 🌟' : 'Great effort! 👏'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">Recall Challenge</h2>
        <p className="text-muted-foreground">
          Look at the image and type the correct word from memory
        </p>
      </div>

      {/* Progress & Score */}
      <div className="flex items-center justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-primary font-semibold">
              Score: {score} {streak > 1 && `(${streak}x streak 🔥)`}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex flex-col items-center space-y-6">
          {/* Image */}
          {current.imageUrl && (
            <div className="relative">
              <img
                src={current.imageUrl}
                alt="Recall this word"
                className="w-64 h-64 object-cover rounded-xl shadow-lg"
              />
              {answered && (
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl ${
                    isCorrect
                      ? 'bg-green-500/20 border-4 border-green-500'
                      : 'bg-red-500/20 border-4 border-red-500'
                  }`}
                >
                  {isCorrect ? (
                    <Check className="h-24 w-24 text-green-500" />
                  ) : (
                    <X className="h-24 w-24 text-red-500" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Answer Input */}
          {!answered ? (
            <div className="w-full max-w-md space-y-4">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleSubmit()}
                placeholder="Type the word..."
                className="text-2xl text-center font-semibold h-14"
                autoFocus
              />

              {/* Hint Button */}
              {current.hint && !showHint && (
                <Button
                  variant="outline"
                  onClick={() => setShowHint(true)}
                  className="w-full gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Show Hint
                </Button>
              )}

              {/* Hint Display */}
              {showHint && current.hint && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <Lightbulb className="h-4 w-4 inline mr-2" />
                    {current.hint}
                  </p>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-primary">
                {current.correctWord}
              </p>
              <p className="text-muted-foreground">
                {isCorrect ? 'You got it right!' : 'Remember this word!'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {!answered ? (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
            className="min-w-40"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleNext}
            className="min-w-40"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
};
