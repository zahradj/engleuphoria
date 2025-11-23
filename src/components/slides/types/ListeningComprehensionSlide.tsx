import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  feedback?: string;
}

interface ListeningComprehensionSlideProps {
  slide: {
    prompt: string;
    instructions: string;
    storyText?: string;
    audioFile?: string;
    questions?: ComprehensionQuestion[];
    imagePrompt?: string;
    storyboard?: string[];
  };
  slideNumber: number;
  onNext?: () => void;
}

export function ListeningComprehensionSlide({ slide, slideNumber, onNext }: ListeningComprehensionSlideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = slide.questions || [
    {
      id: 'q1',
      question: 'What is the main idea of the story?',
      options: ['Option A', 'Option B', 'Option C'],
      correctAnswer: 0,
      feedback: 'Correct! 🎉'
    }
  ];

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    console.log(`Playing audio: ${slide.audioFile}`);
    // Audio playback logic
  };

  const handleReplay = () => {
    setIsPlaying(false);
    console.log('Replaying audio');
    // Replay logic
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const allAnswered = questions.length === Object.keys(answers).length;
  const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{slide.prompt}</h2>
        <p className="text-muted-foreground">{slide.instructions}</p>
      </div>

      {/* Audio Player */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={handlePlay}
                className="rounded-full w-16 h-16"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button
                variant="outline"
                onClick={handleReplay}
                className="rounded-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Replay
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowText(!showText)}
              className="text-sm"
            >
              {showText ? 'Hide' : 'Show'} Text
            </Button>
          </div>

          {/* Story Visualization */}
          {slide.storyboard && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {slide.storyboard.map((scene, idx) => (
                <div key={idx} className="aspect-video bg-white rounded-lg shadow-sm flex items-center justify-center p-4">
                  <p className="text-xs text-center text-muted-foreground">{scene}</p>
                </div>
              ))}
            </div>
          )}

          {/* Story Text (toggleable) */}
          {showText && slide.storyText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-lg p-4 mb-4"
            >
              <p className="text-base leading-relaxed">{slide.storyText}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Comprehension Questions */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-bold">📝 Answer the questions:</h3>

          {questions.map((question, qIdx) => (
            <div key={question.id} className="space-y-3">
              <p className="font-medium">
                {qIdx + 1}. {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optIdx) => {
                  const isSelected = answers[question.id] === optIdx;
                  const isCorrect = question.correctAnswer === optIdx;
                  const showAnswer = showFeedback && isSelected;

                  return (
                    <Button
                      key={optIdx}
                      variant={showAnswer ? (isCorrect ? 'default' : 'destructive') : isSelected ? 'secondary' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => handleAnswerSelect(question.id, optIdx)}
                      disabled={showFeedback}
                    >
                      <span className="mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                      {option}
                      {showAnswer && isCorrect && <span className="ml-auto">✓</span>}
                    </Button>
                  );
                })}
              </div>
              {showFeedback && answers[question.id] === question.correctAnswer && (
                <p className="text-sm text-green-600 font-medium">{question.feedback}</p>
              )}
            </div>
          ))}

          {!showFeedback ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              size="lg"
              className="w-full"
            >
              Submit Answers
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-lg font-bold">
                  Score: {correctCount}/{questions.length} 
                  {correctCount === questions.length ? ' 🎉 Perfect!' : ' Keep practicing!'}
                </p>
              </div>
              {onNext && (
                <Button onClick={onNext} size="lg" className="w-full">
                  Continue
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
