import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DefaultSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function DefaultSlide({ slide, slideNumber, onNext }: DefaultSlideProps) {
  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30">
        <div className="text-xs text-muted-foreground mb-2">Slide {slideNumber}</div>
        <CardTitle className="text-2xl">
          {slide.title || slide.prompt || `Slide ${slideNumber}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium">{slide.instructions}</p>
          </div>
        )}

        {slide.content && (
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed">{slide.content}</p>
          </div>
        )}

        {slide.media?.imagePrompt && (
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
              <p className="text-sm text-muted-foreground px-4 text-center">
                {slide.media.imagePrompt}
              </p>
            </div>
          </div>
        )}

        {!slide.content && !slide.instructions && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Slide content will appear here</p>
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
