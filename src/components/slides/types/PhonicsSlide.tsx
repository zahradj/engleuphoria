import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PhonicsWord {
  word: string;
  phonemes: string[];
  audioNormal?: string;
  audioSlow?: string;
  audioFast?: string;
  image?: string;
}

interface PhonicsSlideProps {
  slide: {
    prompt: string;
    instructions: string;
    targetSound?: string;
    soundDescription?: string;
    mouthShape?: string;
    practiceWords?: PhonicsWord[];
    imagePrompt?: string;
  };
  slideNumber: number;
  onNext?: () => void;
}

export function PhonicsSlide({ slide, slideNumber, onNext }: PhonicsSlideProps) {
  const [selectedWord, setSelectedWord] = useState(0);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const practiceWords = slide.practiceWords || [
    {
      word: 'cat',
      phonemes: ['c', 'a', 't'],
      audioNormal: 'phonics-cat.mp3',
      audioSlow: 'phonics-cat-slow.mp3',
      audioFast: 'phonics-cat-fast.mp3'
    },
    {
      word: 'bat',
      phonemes: ['b', 'a', 't'],
      audioNormal: 'phonics-bat.mp3',
      audioSlow: 'phonics-bat-slow.mp3'
    },
    {
      word: 'hat',
      phonemes: ['h', 'a', 't'],
      audioNormal: 'phonics-hat.mp3'
    }
  ];

  const currentWord = practiceWords[selectedWord];

  const playSound = (wordSpeed: 'slow' | 'normal' | 'fast') => {
    const audioFile = wordSpeed === 'slow'
      ? currentWord.audioSlow
      : wordSpeed === 'fast'
      ? currentWord.audioFast
      : currentWord.audioNormal;
    console.log(`Playing phonics audio: ${audioFile} at ${wordSpeed} speed`);
  };

  const playPhoneme = (phoneme: string) => {
    console.log(`Playing phoneme: ${phoneme}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{slide.prompt}</h2>
        <p className="text-muted-foreground">{slide.instructions}</p>
      </div>

      {/* Target Sound Introduction */}
      {slide.targetSound && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-600 mb-2">
                  {slide.targetSound}
                </div>
                <p className="text-sm text-muted-foreground">{slide.soundDescription}</p>
              </div>
              {slide.mouthShape && (
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-purple-200">
                  <span className="text-4xl">👄</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Word Practice */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-8 space-y-6">
          {/* Word Display */}
          <div className="text-center">
            <motion.div
              key={selectedWord}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              <div className="text-7xl font-bold text-primary mb-4">
                {currentWord.word}
              </div>
              <div className="flex justify-center gap-2 mb-6">
                {currentWord.phonemes.map((phoneme, idx) => (
                  <button
                    key={idx}
                    onClick={() => playPhoneme(phoneme)}
                    className="w-16 h-16 bg-white border-2 border-primary rounded-lg flex items-center justify-center text-2xl font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    {phoneme}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Speed Controls */}
            <div className="flex justify-center gap-3 mb-6">
              <Button
                variant={speed === 'slow' ? 'default' : 'outline'}
                onClick={() => {
                  setSpeed('slow');
                  playSound('slow');
                }}
                className="gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Slow
              </Button>
              <Button
                variant={speed === 'normal' ? 'default' : 'outline'}
                onClick={() => {
                  setSpeed('normal');
                  playSound('normal');
                }}
                className="gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Normal
              </Button>
              <Button
                variant={speed === 'fast' ? 'default' : 'outline'}
                onClick={() => {
                  setSpeed('fast');
                  playSound('fast');
                }}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                Fast
              </Button>
            </div>
          </div>

          {/* Word Selection */}
          <div className="flex justify-center gap-2">
            {practiceWords.map((word, idx) => (
              <Button
                key={idx}
                variant={selectedWord === idx ? 'default' : 'outline'}
                onClick={() => setSelectedWord(idx)}
                size="lg"
              >
                {word.word}
              </Button>
            ))}
          </div>

          {/* Progress */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              Word {selectedWord + 1} of {practiceWords.length}
            </span>
            {selectedWord === practiceWords.length - 1 && onNext && (
              <Button onClick={onNext} size="lg">
                Continue 🎉
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
