import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Loader2, Sparkles, BookOpen, Languages } from 'lucide-react';
import { useLessonAssets } from '@/hooks/useLessonAssets';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEffectsService } from '@/services/soundEffectsService';

interface VocabularyDetail {
  word: string;
  definition: string;
  examples: string[];
  pronunciation: string;
  partOfSpeech: string;
  collocations: string[];
  usageContext: string;
}

interface EnhancedVocabularySlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function EnhancedVocabularySlide({ slide, slideNumber, onNext }: EnhancedVocabularySlideProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const { generateImage, generateAudio, loading } = useLessonAssets();
  const [wordImage, setWordImage] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  
  const vocabularyDetails: VocabularyDetail[] = slide.vocabularyDetails || [];
  const currentWord = vocabularyDetails[currentWordIndex];

  // Generate image for current word
  useEffect(() => {
    const loadImage = async () => {
      if (currentWord && slide.media?.imagePrompt) {
        const imageUrl = await generateImage(slide.media.imagePrompt);
        setWordImage(imageUrl);
      }
    };
    loadImage();
  }, [currentWordIndex, currentWord, slide.media, generateImage]);

  const handlePlayAudio = async () => {
    if (!currentWord) return;
    
    setPlayingAudio(true);
    await generateAudio(currentWord.word);
    setPlayingAudio(false);
  };

  const handleNextWord = () => {
    if (currentWordIndex < vocabularyDetails.length - 1) {
      soundEffectsService.playPageTurn();
      setCurrentWordIndex(prev => prev + 1);
      setShowDetails(false);
    } else if (onNext) {
      soundEffectsService.playLevelComplete();
      onNext();
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      soundEffectsService.playPageTurn();
      setCurrentWordIndex(prev => prev - 1);
      setShowDetails(false);
    }
  };

  if (!currentWord) {
    return <div>No vocabulary details available</div>;
  }

  return (
    <Card className="border-2 border-indigo-500/20 shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <div className="text-xs text-muted-foreground font-medium">
              Slide {slideNumber} • 📚 Vocabulary ({currentWordIndex + 1}/{vocabularyDetails.length})
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-bold text-indigo-600">+{slide.gamification?.xpReward || 20} XP</span>
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {slide.prompt || 'New Vocabulary'}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200"
          >
            <p className="font-medium text-indigo-900">🎯 {slide.instructions}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Main Word Card */}
            <Card className="bg-gradient-to-br from-white to-indigo-50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner">
                    {loading ? (
                      <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                    ) : wordImage ? (
                      <img 
                        src={wordImage} 
                        alt={currentWord.word}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">📖</div>
                    )}
                  </div>

                  {/* Word Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-4xl font-bold text-indigo-900 mb-2">{currentWord.word}</h3>
                      <Badge variant="secondary" className="mb-2">
                        <Languages className="h-3 w-3 mr-1" />
                        {currentWord.partOfSpeech}
                      </Badge>
                      <p className="text-sm text-muted-foreground italic">/{currentWord.pronunciation}/</p>
                    </div>

                    <Button 
                      onClick={handlePlayAudio}
                      disabled={playingAudio}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    >
                      {playingAudio ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 mr-2" />
                          Hear Pronunciation
                        </>
                      )}
                    </Button>

                    <div className="p-4 bg-white rounded-lg border-2 border-indigo-200">
                      <p className="font-semibold text-indigo-900 mb-1">Definition:</p>
                      <p className="text-gray-700">{currentWord.definition}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Toggle Details Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  soundEffectsService.playButtonClick();
                  setShowDetails(!showDetails);
                }}
                className="border-2 border-indigo-300 hover:bg-indigo-50"
              >
                {showDetails ? 'Hide Details' : 'Show More Details'} 
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Detailed Information */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Examples */}
                  <Card className="bg-green-50 border-2 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        📝 Example Sentences
                      </h4>
                      <ul className="space-y-2">
                        {currentWord.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span className="text-gray-700">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Collocations */}
                  <Card className="bg-blue-50 border-2 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        🔗 Common Word Combinations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentWord.collocations.map((collocation, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-900">
                            {collocation}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Usage Context */}
                  <Card className="bg-purple-50 border-2 border-purple-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        💡 When to Use This Word
                      </h4>
                      <p className="text-gray-700">{currentWord.usageContext}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevWord}
            disabled={currentWordIndex === 0}
            className="gap-2"
          >
            ← Previous Word
          </Button>
          
          <div className="flex gap-2">
            {vocabularyDetails.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentWordIndex 
                    ? 'bg-indigo-600 w-6' 
                    : idx < currentWordIndex 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNextWord}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            {currentWordIndex === vocabularyDetails.length - 1 ? 'Continue →' : 'Next Word →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
