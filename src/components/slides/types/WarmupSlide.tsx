import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Volume2, Loader2 } from 'lucide-react';
import { useLessonAssets } from '@/hooks/useLessonAssets';

interface WarmupSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function WarmupSlide({ slide, slideNumber, onNext }: WarmupSlideProps) {
  const { generateImage, generateAudio, loading } = useLessonAssets();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (slide.media?.imagePrompt) {
      generateImage(slide.media.imagePrompt).then(setImageUrl);
    }
  }, [slide.media?.imagePrompt, generateImage]);

  const handlePlayAudio = async () => {
    const text = slide.instructions || slide.prompt || slide.title || 'Welcome!';
    setIsPlayingAudio(true);
    await generateAudio(text);
    setIsPlayingAudio(false);
  };

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
            {loading && !imageUrl ? (
              <div className="w-full max-w-md aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : imageUrl ? (
              <img 
                src={imageUrl} 
                alt={slide.media.alt || 'Lesson image'} 
                className="w-full max-w-md aspect-video object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full max-w-md aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                <p className="text-sm text-muted-foreground px-4 text-center">
                  {slide.media.imagePrompt}
                </p>
              </div>
            )}
          </div>
        )}

        {slide.content && (
          <div className="text-center text-lg leading-relaxed">
            {slide.content}
          </div>
        )}

        <div className="flex justify-center gap-3">
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2"
            onClick={handlePlayAudio}
            disabled={isPlayingAudio}
          >
            {isPlayingAudio ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
            {isPlayingAudio ? 'Playing...' : 'Read Aloud'}
          </Button>
        </div>

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
