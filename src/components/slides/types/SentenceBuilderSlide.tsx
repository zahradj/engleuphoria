import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Word {
  id: string;
  text: string;
  category?: string;
}

interface SentenceBuilderSlideProps {
  slide: {
    prompt: string;
    instructions: string;
    wordBank?: Word[];
    correctSentences?: string[][];
    hint?: string;
    imagePrompt?: string;
  };
  slideNumber: number;
  onNext?: () => void;
}

export function SentenceBuilderSlide({ slide, slideNumber, onNext }: SentenceBuilderSlideProps) {
  const wordBank = slide.wordBank || [
    { id: 'w1', text: 'I' },
    { id: 'w2', text: 'like' },
    { id: 'w3', text: 'to' },
    { id: 'w4', text: 'eat' },
    { id: 'w5', text: 'pizza' },
    { id: 'w6', text: 'apples' },
    { id: 'w7', text: 'playing' },
  ];

  const correctSentences = slide.correctSentences || [
    ['I', 'like', 'to', 'eat', 'pizza'],
    ['I', 'like', 'to', 'eat', 'apples']
  ];

  const [availableWords, setAvailableWords] = useState<Word[]>(wordBank);
  const [sentence, setSentence] = useState<Word[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleWordClick = (word: Word) => {
    setSentence([...sentence, word]);
    setAvailableWords(availableWords.filter(w => w.id !== word.id));
    setFeedback({ type: null, message: '' });
  };

  const handleRemoveWord = (index: number) => {
    const word = sentence[index];
    setAvailableWords([...availableWords, word]);
    setSentence(sentence.filter((_, i) => i !== index));
    setFeedback({ type: null, message: '' });
  };

  const handleCheck = () => {
    const builtSentence = sentence.map(w => w.text);
    const isCorrect = correctSentences.some(correct =>
      JSON.stringify(correct) === JSON.stringify(builtSentence)
    );

    if (isCorrect) {
      setFeedback({ type: 'success', message: '🎉 Perfect sentence! Great job!' });
      console.log(`Playing audio for sentence: ${builtSentence.join(' ')}`);
    } else {
      setFeedback({ type: 'error', message: '🤔 Try again! Check the word order.' });
    }
  };

  const handleReset = () => {
    setAvailableWords(wordBank);
    setSentence([]);
    setFeedback({ type: null, message: '' });
  };

  const playAudio = () => {
    const sentenceText = sentence.map(w => w.text).join(' ');
    console.log(`Playing audio: ${sentenceText}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{slide.prompt}</h2>
        <p className="text-muted-foreground">{slide.instructions}</p>
        {slide.hint && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-sm">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 font-medium">{slide.hint}</span>
          </div>
        )}
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50">
        <CardContent className="p-8 space-y-6">
          {/* Sentence Construction Area */}
          <div className="min-h-[120px] bg-white rounded-xl p-6 shadow-inner border-2 border-dashed border-gray-300">
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <AnimatePresence>
                {sentence.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground text-center"
                  >
                    👆 Tap words below to build your sentence
                  </motion.p>
                ) : (
                  sentence.map((word, idx) => (
                    <motion.button
                      key={`${word.id}-${idx}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={() => handleRemoveWord(idx)}
                      className="px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 transition-colors"
                    >
                      {word.text}
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            </div>

            {sentence.length > 0 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={playAudio}>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Hear it
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* Word Bank */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
              📦 Word Bank:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableWords.map((word) => (
                <motion.button
                  key={word.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(word)}
                  className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {word.text}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback.type && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-center font-medium ${
                feedback.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-3">
            {feedback.type !== 'success' ? (
              <Button
                onClick={handleCheck}
                disabled={sentence.length === 0}
                size="lg"
                className="px-8"
              >
                Check Sentence
              </Button>
            ) : (
              onNext && (
                <Button onClick={onNext} size="lg" className="px-8">
                  Continue 🎉
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
