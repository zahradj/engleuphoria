import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { useLessonAssets } from '@/hooks/useLessonAssets';

interface VocabularySlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function VocabularySlide({ slide, slideNumber, onNext }: VocabularySlideProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const { generateImage, generateAudio, loading } = useLessonAssets();
  const [wordImages, setWordImages] = useState<Map<number, string>>(new Map());
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  
  const words = slide.words || slide.vocabulary || [];

  // Generate images for all vocabulary words
  useEffect(() => {
    const loadImages = async () => {
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const imagePrompt = word.imagePrompt || `Simple, colorful illustration of ${word.word || word}, educational style for children`;
        
        const imageUrl = await generateImage(imagePrompt);
        if (imageUrl) {
          setWordImages(prev => new Map(prev).set(i, imageUrl));
        }
      }
    };

    if (words.length > 0) {
      loadImages();
    }
  }, [words, generateImage]);

  const handlePlayAudio = async (index: number) => {
    const word = words[index];
    const text = word.word || word;
    
    setPlayingAudio(index);
    await generateAudio(text);
    setPlayingAudio(null);
  };

  return (
    <Card className="border-2 border-blue-500/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="text-xs text-muted-foreground mb-2">Slide {slideNumber} • Vocabulary</div>
        <CardTitle className="text-2xl">{slide.prompt || 'New Vocabulary'}</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <p className="text-center text-muted-foreground">{slide.instructions}</p>
        )}

        {words.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {words.map((word: any, index: number) => {
                const wordText = word.word || word;
                const imageUrl = wordImages.get(index);
                
                return (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      currentWord === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentWord(index)}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Image */}
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        {!imageUrl && loading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={wordText}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-4xl">{word.image || '📝'}</div>
                        )}
                      </div>
                      
                      {/* Word Details */}
                      <div className="text-center space-y-1">
                        <div className="font-bold text-lg">{wordText}</div>
                        {word.pronunciation && (
                          <div className="text-xs text-muted-foreground font-mono">{word.pronunciation}</div>
                        )}
                        {word.partOfSpeech && (
                          <div className="text-xs text-primary italic">{word.partOfSpeech}</div>
                        )}
                        {word.definition && (
                          <div className="text-sm text-muted-foreground mt-2">{word.definition}</div>
                        )}
                        {word.translation && (
                          <div className="text-sm text-muted-foreground">{word.translation}</div>
                        )}
                      </div>
                      
                      {/* Audio Button */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(index);
                        }}
                        disabled={playingAudio === index}
                      >
                        {playingAudio === index ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4" />
                            Listen
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed view for selected word */}
            {words[currentWord] && (
              <Card className="bg-muted/50 border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{words[currentWord].word || words[currentWord]}</h3>
                    {words[currentWord].pronunciation && (
                      <p className="text-lg font-mono text-muted-foreground">{words[currentWord].pronunciation}</p>
                    )}
                  </div>
                  
                  {words[currentWord].definition && (
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-1">Definition:</h4>
                      <p className="text-base">{words[currentWord].definition}</p>
                    </div>
                  )}
                  
                  {words[currentWord].examples && Array.isArray(words[currentWord].examples) && (
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">Examples:</h4>
                      <ul className="space-y-2">
                        {words[currentWord].examples.map((example: string, idx: number) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {words[currentWord].relatedWords && words[currentWord].relatedWords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">Related Words:</h4>
                      <div className="flex flex-wrap gap-2">
                        {words[currentWord].relatedWords.map((related: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                            {related}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {typeof slide.content === 'string' ? slide.content : 'Vocabulary content here'}
            </p>
          </div>
        )}

        {onNext && (
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={onNext}>
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
