import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface EndQuizSlideProps {
  slide: {
    prompt: string;
    instructions: string;
    questions?: QuizQuestion[];
    passingScore?: number;
  };
  slideNumber: number;
  onNext?: () => void;
}

export function EndQuizSlide({ slide, slideNumber, onNext }: EndQuizSlideProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showResults, setShowResults] = useState(false);

  const questions = slide.questions || [
    {
      id: 'q1',
      question: 'What is the correct sentence?',
      type: 'multiple_choice' as const,
      options: ['I like apples', 'I likes apple', 'Me like apples'],
      correctAnswer: 0,
      explanation: 'Use "I like" with plural nouns.',
      points: 10
    },
    {
      id: 'q2',
      question: 'The sun rises in the east.',
      type: 'true_false' as const,
      correctAnswer: 'true',
      points: 5
    }
  ];

  const passingScore = slide.passingScore || 70;
  const current = questions[currentQuestion];

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [current.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    questions.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswer) {
        correct += q.points;
      }
    });
    return {
      points: correct,
      total: totalPoints,
      percentage: Math.round((correct / totalPoints) * 100),
      passed: ((correct / totalPoints) * 100) >= passingScore
    };
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Quiz Complete! 🎉</h2>
        </div>

        <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-8 space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(score.percentage / 100) * 553} 553`}
                    className={score.passed ? 'text-green-500' : 'text-orange-500'}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold">{score.percentage}%</div>
                  <div className="text-sm text-muted-foreground">
                    {score.points}/{score.total} points
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                  score.passed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {score.passed ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Passed! Great work!
                  </>
                ) : (
                  <>
                    <Star className="w-6 h-6" />
                    Keep practicing!
                  </>
                )}
              </motion.div>
            </div>

            {/* Review Questions */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-center mb-4">Review:</h3>
              {questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-1">{idx + 1}. {q.question}</p>
                        {!isCorrect && q.explanation && (
                          <p className="text-sm text-muted-foreground">{q.explanation}</p>
                        )}
                      </div>
                      <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? `+${q.points}` : '0'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {onNext && (
              <Button onClick={onNext} size="lg" className="w-full">
                Continue to Next Lesson
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{slide.prompt}</h2>
        <p className="text-muted-foreground">{slide.instructions}</p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm">
          <span className="font-medium text-purple-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Question */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{current.question}</h3>
                <div className="text-sm text-muted-foreground">
                  Worth {current.points} points
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {current.type === 'multiple_choice' && current.options?.map((option, idx) => (
                  <Button
                    key={idx}
                    variant={answers[current.id] === idx ? 'default' : 'outline'}
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => handleAnswer(idx)}
                  >
                    <span className="text-base">{String.fromCharCode(65 + idx)}. {option}</span>
                  </Button>
                ))}

                {current.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={answers[current.id] === 'true' ? 'default' : 'outline'}
                      className="h-20 text-lg"
                      onClick={() => handleAnswer('true')}
                    >
                      ✓ True
                    </Button>
                    <Button
                      variant={answers[current.id] === 'false' ? 'default' : 'outline'}
                      className="h-20 text-lg"
                      onClick={() => handleAnswer('false')}
                    >
                      ✗ False
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <Button
            onClick={handleNext}
            disabled={answers[current.id] === undefined}
            size="lg"
            className="w-full"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Show Results'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
