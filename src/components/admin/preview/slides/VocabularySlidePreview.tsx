import React from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VocabularyWord {
  word: string;
  ipa?: string;
  definition?: string;
  example?: string;
  partOfSpeech?: string;
}

interface VocabularySlidePreviewProps {
  slide: {
    title?: string;
    content?: {
      words?: VocabularyWord[];
    };
  };
}

export function VocabularySlidePreview({ slide }: VocabularySlidePreviewProps) {
  const words = slide.content?.words || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          {slide.title || 'Vocabulary'}
        </h2>
      </div>

      <div className="grid gap-4">
        {words.map((word, idx) => (
          <div 
            key={idx}
            className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-5 border border-primary/10"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-foreground">
                    {word.word}
                  </span>
                  {word.partOfSpeech && (
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      {word.partOfSpeech}
                    </span>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {word.ipa && (
                  <p className="text-sm text-muted-foreground font-mono">
                    /{word.ipa}/
                  </p>
                )}
                
                {word.definition && (
                  <p className="text-foreground">
                    {word.definition}
                  </p>
                )}
                
                {word.example && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mt-2">
                    "{word.example}"
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
