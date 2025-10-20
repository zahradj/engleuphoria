import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface GrammarSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function GrammarSlide({ slide, slideNumber, onNext }: GrammarSlideProps) {
  return (
    <Card className="border-2 border-purple-500/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4" />
          <div className="text-xs text-muted-foreground">Slide {slideNumber} • Grammar</div>
        </div>
        <CardTitle className="text-2xl">{slide.prompt || slide.title || 'Grammar Focus'}</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
            <p className="text-sm font-medium">{slide.instructions}</p>
          </div>
        )}

        {slide.examples && Array.isArray(slide.examples) && (
          <div className="space-y-3">
            <h4 className="font-semibold">Examples:</h4>
            {slide.examples.map((example: string, index: number) => (
              <div key={index} className="bg-background border rounded-lg p-4">
                <p className="text-lg">{example}</p>
              </div>
            ))}
          </div>
        )}

        {slide.content && (
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed">{slide.content}</p>
          </div>
        )}

        {slide.rule && (
          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
            <p className="font-semibold text-primary mb-2">Grammar Rule:</p>
            <p>{slide.rule}</p>
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
