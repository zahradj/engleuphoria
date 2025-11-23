import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpeakingPrompt {
  id: string;
  prompt: string;
  example: string;
  characterExample?: string;
  hints?: string[];
  audioFile?: string;
}

interface SpeakingPracticeSlideProps {
  slide: {
    prompt: string;
    instructions: string;
    prompts?: SpeakingPrompt[];
    imagePrompt?: string;
  };
  slideNumber: number;
  onNext?: () => void;
}

export function SpeakingPracticeSlide({ slide, slideNumber, onNext }: SpeakingPracticeSlideProps) {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState<boolean[]>([]);

  const prompts = slide.prompts || [
    {
      id: 'sp1',
      prompt: 'Describe your favorite food',
      example: 'My favorite food is pizza. I like it because it has cheese and tomatoes.',
      characterExample: 'Max says: "I love pasta! It\'s delicious and my mom makes it every Sunday."',
      hints: ['Use: I like...', 'Say why you like it', 'Mention when you eat it']
    }
  ];

  const current = prompts[currentPrompt];

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Stop recording
      const updated = [...hasRecorded];
      updated[currentPrompt] = true;
      setHasRecorded(updated);
      console.log('Recording stopped');
    } else {
      console.log('Recording started');
    }
  };

  const playExample = () => {
    console.log(`Playing example audio: ${current.audioFile}`);
  };

  const handleNext = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{slide.prompt}</h2>
        <p className="text-muted-foreground">{slide.instructions}</p>
      </div>

      <Card className="bg-gradient-to-br from-orange-50 to-pink-50">
        <CardContent className="p-8 space-y-6">
          {/* Current Speaking Prompt */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-sm font-medium text-orange-700 mb-4">
              <Mic className="w-4 h-4" />
              Prompt {currentPrompt + 1} of {prompts.length}
            </div>
            <h3 className="text-2xl font-bold mb-4">{current.prompt}</h3>
          </div>

          {/* Example Section */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playExample}
                  className="mt-1 flex-shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">📢 Example:</p>
                  <p className="text-base">{current.example}</p>
                </div>
              </div>
            </div>

            {current.characterExample && (
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <p className="text-sm italic">{current.characterExample}</p>
              </div>
            )}
          </div>

          {/* Hints */}
          {current.hints && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-700 mb-2">💡 Helpful hints:</p>
              <ul className="space-y-1">
                {current.hints.map((hint, idx) => (
                  <li key={idx} className="text-sm text-blue-600 flex items-start gap-2">
                    <span>•</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex flex-col items-center gap-4 py-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRecord}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isRecording
                  ? 'bg-red-500 animate-pulse'
                  : hasRecorded[currentPrompt]
                  ? 'bg-green-500'
                  : 'bg-primary'
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>

            <p className="text-sm font-medium text-center">
              {isRecording ? (
                <span className="text-red-600">🔴 Recording... Tap to stop</span>
              ) : hasRecorded[currentPrompt] ? (
                <span className="text-green-600">✓ Recorded! Tap to re-record</span>
              ) : (
                <span>Tap the microphone to start recording</span>
              )}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {hasRecorded.filter(Boolean).length} / {prompts.length} completed
            </div>
            <Button
              onClick={handleNext}
              disabled={!hasRecorded[currentPrompt]}
              size="lg"
            >
              {currentPrompt < prompts.length - 1 ? 'Next Prompt →' : 'Complete 🎉'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
