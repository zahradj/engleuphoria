import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface WarmupSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function WarmupSlide({ slide, slideNumber, onNext }: WarmupSlideProps) {
  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="text-xs text-muted-foreground mb-2">Slide {slideNumber}</div>
        <CardTitle className="text-3xl text-center">{slide.prompt || slide.title || 'Welcome!'}</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <div className="text-center text-lg text-muted-foreground">
            {slide.instructions}
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

        {slide.content && (
          <div className="text-center text-lg leading-relaxed">
            {slide.content}
          </div>
        )}

        {slide.audio && (
          <div className="flex justify-center">
            <Button size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Play Audio
            </Button>
          </div>
        )}

        {onNext && (
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={onNext} className="min-w-[200px]">
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
