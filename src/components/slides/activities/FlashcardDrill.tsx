import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Volume2, Star } from 'lucide-react';
import { useState } from 'react';

interface FlashcardDrillProps {
  words: Array<{
    word: string;
    definition: string;
    pronunciation: string;
    imagePrompt?: string;
    imageUrl?: string;
  }>;
  onComplete?: () => void;
}

export const FlashcardDrill = ({ words, onComplete }: FlashcardDrillProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

  const currentCard = words[currentIndex];
  const progress = ((masteredCards.size / words.length) * 100).toFixed(0);

  const handleNext = () => {
    setShowDefinition(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    setShowDefinition(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(words.length - 1);
    }
  };

  const handleMastered = () => {
    const newMastered = new Set(masteredCards);
    newMastered.add(currentIndex);
    setMasteredCards(newMastered);
    
    if (newMastered.size === words.length && onComplete) {
      setTimeout(() => onComplete(), 500);
    } else {
      handleNext();
    }
  };

  const handleFlip = () => {
    setShowDefinition(!showDefinition);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">Flashcard Memory Drill</h2>
        <p className="text-muted-foreground">
          Learn and memorize vocabulary with visual and audio support
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Card {currentIndex + 1} of {words.length}
          </span>
          <span className="text-primary font-semibold">
            {masteredCards.size} / {words.length} mastered ({progress}%)
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <Card
        className="relative h-96 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            showDefinition ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side - Word */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            {masteredCards.has(currentIndex) && (
              <div className="absolute top-4 right-4">
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              </div>
            )}
            
            {currentCard.imageUrl && (
              <img
                src={currentCard.imageUrl}
                alt={currentCard.word}
                className="w-48 h-48 object-cover rounded-lg mb-6 shadow-lg"
              />
            )}
            
            <h3 className="text-5xl font-bold text-primary mb-2">
              {currentCard.word}
            </h3>
            
            <button
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Play pronunciation
              }}
            >
              <Volume2 className="h-5 w-5" />
              <span className="text-lg">{currentCard.pronunciation}</span>
            </button>
            
            <p className="text-sm text-muted-foreground mt-8">
              Click to see definition
            </p>
          </div>

          {/* Back Side - Definition */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-8 bg-gradient-to-br from-secondary/5 to-primary/5">
            <div className="text-center space-y-4">
              <p className="text-3xl font-semibold text-foreground">
                {currentCard.definition}
              </p>
              <p className="text-sm text-muted-foreground mt-8">
                Click to see word again
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          className="gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </Button>

        <Button
          size="lg"
          onClick={handleMastered}
          disabled={masteredCards.has(currentIndex)}
          className="gap-2"
        >
          {masteredCards.has(currentIndex) ? (
            <>
              <Star className="h-5 w-5 fill-current" />
              Mastered!
            </>
          ) : (
            <>
              <Star className="h-5 w-5" />
              I Know This!
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          className="gap-2"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
