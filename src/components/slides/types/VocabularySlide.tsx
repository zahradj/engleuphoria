import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface VocabularySlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function VocabularySlide({ slide, slideNumber, onNext }: VocabularySlideProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const words = slide.words || slide.vocabulary || [];

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
              {words.map((word: any, index: number) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    currentWord === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCurrentWord(index)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{word.image || '📝'}</div>
                    <div className="font-semibold">{word.word || word}</div>
                    {word.translation && (
                      <div className="text-sm text-muted-foreground">{word.translation}</div>
                    )}
                    <Button size="sm" variant="ghost" className="mt-2">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{slide.content || 'Vocabulary content here'}</p>
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
