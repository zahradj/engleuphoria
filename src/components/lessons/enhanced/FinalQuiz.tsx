import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface FinalQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

export function FinalQuiz({ questions, onComplete }: FinalQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelectAnswer = (idx: number) => {
    if (!isChecked) {
      setSelectedAnswer(idx);
    }
  };

  const checkAnswer = () => {
    setIsChecked(true);
    if (selectedAnswer === question.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
    } else {
      setFinished(true);
      onComplete(score + (selectedAnswer === question.correct ? 1 : 0), questions.length);
    }
  };

  if (finished) {
    const finalScore = selectedAnswer === question.correct ? score : score;
    const percentage = (finalScore / questions.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center space-y-6">
          <Award className={`w-24 h-24 mx-auto ${percentage >= 80 ? 'text-yellow-500' : percentage >= 60 ? 'text-blue-500' : 'text-gray-500'}`} />
          <h2 className="text-3xl font-bold text-foreground">Quiz Complete!</h2>
          <div className="space-y-2">
            <div className="text-6xl font-bold text-primary">{finalScore} / {questions.length}</div>
            <div className="text-xl text-muted-foreground">{percentage.toFixed(0)}% Correct</div>
          </div>
          <div className="text-lg">
            {percentage >= 90 ? '🌟 Outstanding!' :
             percentage >= 80 ? '🎉 Excellent work!' :
             percentage >= 70 ? '👏 Good job!' :
             percentage >= 60 ? '👍 Not bad!' :
             '💪 Keep practicing!'}
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="p-8 space-y-6">
            <h3 className="text-2xl font-bold text-foreground text-center">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === question.correct;
                const showResult = isChecked;

                let bgClass = 'bg-card border-border';
                if (showResult) {
                  if (isCorrect) {
                    bgClass = 'bg-green-100 border-green-500';
                  } else if (isSelected && !isCorrect) {
                    bgClass = 'bg-red-100 border-red-500';
                  }
                } else if (isSelected) {
                  bgClass = 'bg-primary/10 border-primary';
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={isChecked}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all text-lg font-medium relative ${bgClass} disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {!isChecked && selectedAnswer !== null && (
                <Button onClick={checkAnswer} size="lg" className="px-8">
                  Check Answer
                </Button>
              )}
              {isChecked && (
                <Button onClick={nextQuestion} size="lg" className="px-8">
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
