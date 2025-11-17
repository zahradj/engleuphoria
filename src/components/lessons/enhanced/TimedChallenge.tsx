import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface TimedChallengeProps {
  questions: Question[];
  timeLimit: number; // seconds
  onComplete: (score: number, total: number) => void;
}

export function TimedChallenge({ questions, timeLimit, onComplete }: TimedChallengeProps) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));

  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft <= 0) {
      finishChallenge();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const finishChallenge = () => {
    setFinished(true);
    const finalScore = answers.reduce((acc, answer, idx) => {
      return acc + (answer === questions[idx].correct ? 1 : 0);
    }, 0);
    setScore(finalScore);
    onComplete(finalScore, questions.length);
  };

  const handleAnswer = (answerIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIdx;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishChallenge();
    }
  };

  const timePercentage = (timeLeft / timeLimit) * 100;

  if (!started) {
    return (
      <Card className="p-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <Clock className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Timed Challenge!</h2>
          <p className="text-lg text-muted-foreground">
            Answer {questions.length} questions in {timeLimit} seconds
          </p>
          <div className="text-sm text-muted-foreground">
            Ready to test your speed? 🚀
          </div>
        </div>
        <Button size="lg" onClick={() => setStarted(true)} className="px-12">
          Start Challenge
        </Button>
      </Card>
    );
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            {score === questions.length ? (
              <CheckCircle2 className="w-20 h-20 mx-auto text-green-500" />
            ) : (
              <Clock className="w-20 h-20 mx-auto text-primary" />
            )}
            <h2 className="text-3xl font-bold text-foreground">Challenge Complete!</h2>
            <div className="text-5xl font-bold text-primary">
              {score} / {questions.length}
            </div>
            <p className="text-xl text-muted-foreground">
              {score === questions.length ? 'Perfect Score! 🎉' : 
               score >= questions.length * 0.7 ? 'Great Job! 👏' : 
               'Keep Practicing! 💪'}
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Timer */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500' : 'text-primary'}`} />
            <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-foreground'}`}>
              {timeLeft}s
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <Progress value={timePercentage} className="h-2" />
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(idx)}
                  className="w-full p-4 text-left rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-lg font-medium"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
