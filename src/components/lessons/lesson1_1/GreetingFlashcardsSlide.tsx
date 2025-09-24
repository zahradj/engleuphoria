import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, RotateCcw } from "lucide-react";

interface GreetingFlashcardsSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

interface FlashCard {
  id: number;
  front: string;
  back: string;
  emoji: string;
  audio: string;
}

const flashcards: FlashCard[] = [
  { id: 1, front: "Hello", back: "A friendly greeting", emoji: "👋", audio: "Hello" },
  { id: 2, front: "Hi", back: "A casual greeting", emoji: "😊", audio: "Hi" },
  { id: 3, front: "Goodbye", back: "A polite farewell", emoji: "👋", audio: "Goodbye" },
  { id: 4, front: "Bye", back: "A casual farewell", emoji: "✋", audio: "Bye" },
];

export function GreetingFlashcardsSlide({ onComplete, onNext, isCompleted }: GreetingFlashcardsSlideProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentCard, setCurrentCard] = useState(0);
  const [allViewed, setAllViewed] = useState(false);

  const handleCardFlip = (cardId: number) => {
    const newFlipped = new Set(flippedCards);
    newFlipped.add(cardId);
    setFlippedCards(newFlipped);

    if (newFlipped.size === flashcards.length && !allViewed) {
      setAllViewed(true);
      if (!isCompleted) {
        onComplete();
      }
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
    }
  };

  const resetCards = () => {
    setFlippedCards(new Set());
    setCurrentCard(0);
    setAllViewed(false);
  };

  const card = flashcards[currentCard];
  const isFlipped = flippedCards.has(card.id);

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          📚 Greeting Flashcards
        </h2>
        <p className="text-lg text-gray-600">
          Click each card to see its meaning and hear the pronunciation
        </p>
      </div>

      {/* Card Counter */}
      <div className="text-sm text-gray-500">
        Card {currentCard + 1} of {flashcards.length}
      </div>

      {/* Main Flashcard */}
      <div className="flex justify-center">
        <div 
          className="perspective-1000 cursor-pointer"
          onClick={() => handleCardFlip(card.id)}
        >
          <Card className={`w-80 h-48 relative transform-style-preserve-3d transition-transform duration-700 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}>
            {/* Front Side */}
            <div className="absolute inset-0 backface-hidden p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="text-6xl mb-4">{card.emoji}</div>
              <div className="text-3xl font-bold text-gray-800">{card.front}</div>
              <div className="text-sm text-gray-500 mt-4">Click to flip</div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-teal-100">
              <div className="text-2xl font-bold text-gray-800 mb-4">{card.front}</div>
              <div className="text-lg text-gray-600 mb-4">{card.back}</div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(card.audio);
                }}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={prevCard}
          disabled={currentCard === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={nextCard}
          disabled={currentCard === flashcards.length - 1}
          variant="outline"
        >
          Next
        </Button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2">
        {flashcards.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              flippedCards.has(flashcards[index].id) 
                ? 'bg-green-500' 
                : currentCard === index 
                ? 'bg-blue-500' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Reset Button */}
      <Button
        onClick={resetCards}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Cards
      </Button>

      {allViewed && (
        <div className="space-y-4">
          <div className="text-green-600 font-semibold text-lg">
            🎉 All cards viewed! You're learning fast!
          </div>
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Ready for the Challenge?
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          💡 <strong>How to use:</strong> Click each card to flip it and see the meaning. Use the audio button to hear correct pronunciation.
        </p>
      </div>
    </div>
  );
}