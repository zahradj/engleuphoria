import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, RotateCcw } from "lucide-react";

interface MatchingGameSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const matchPairs = [
  { id: 1, word: "Hello", image: "👋", description: "Waving hand" },
  { id: 2, word: "Goodbye", image: "🚪", description: "Leaving/Door" },
  { id: 3, word: "Nice to meet you", image: "🤝", description: "Handshake" },
  { id: 4, word: "My name is", image: "📛", description: "Name tag" },
];

export function MatchingGameSlide({ onComplete, onNext, isCompleted }: MatchingGameSlideProps) {
  const [matches, setMatches] = useState<{[key: number]: number}>({});
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleWordClick = (wordId: number) => {
    if (Object.values(matches).includes(wordId)) return; // Already matched
    
    setSelectedWord(wordId);
    if (selectedImage !== null) {
      createMatch(wordId, selectedImage);
    }
  };

  const handleImageClick = (imageId: number) => {
    if (matches[imageId]) return; // Already matched
    
    setSelectedImage(imageId);
    if (selectedWord !== null) {
      createMatch(selectedWord, imageId);
    }
  };

  const createMatch = (wordId: number, imageId: number) => {
    setMatches(prev => ({ ...prev, [imageId]: wordId }));
    setSelectedWord(null);
    setSelectedImage(null);

    // Check if all matches are made
    if (Object.keys(matches).length === matchPairs.length - 1) {
      setTimeout(() => {
        checkResults();
      }, 500);
    }
  };

  const checkResults = () => {
    let correctCount = 0;
    matchPairs.forEach(pair => {
      if (matches[pair.id] === pair.id) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
    
    if (correctCount === matchPairs.length && !isCompleted) {
      onComplete();
    }
  };

  const resetGame = () => {
    setMatches({});
    setSelectedWord(null);
    setSelectedImage(null);
    setShowResults(false);
    setScore(0);
  };

  const isWordMatched = (wordId: number) => Object.values(matches).includes(wordId);
  const isImageMatched = (imageId: number) => matches[imageId] !== undefined;
  const isCorrectMatch = (pairId: number) => matches[pairId] === pairId;

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Matching Game
        </h2>
        <p className="text-lg text-gray-600">
          Match each word with its correct image!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Words Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Words</h3>
          {matchPairs.map(pair => (
            <Card
              key={`word-${pair.id}`}
              className={`p-4 cursor-pointer transition-all ${
                isWordMatched(pair.id)
                  ? showResults && isCorrectMatch(pair.id)
                    ? 'bg-green-100 border-green-500'
                    : showResults
                    ? 'bg-red-100 border-red-500'
                    : 'bg-blue-100 border-blue-500 opacity-75'
                  : selectedWord === pair.id
                  ? 'bg-yellow-100 border-yellow-500 scale-105'
                  : 'hover:bg-gray-50 hover:shadow-md'
              } ${showResults ? 'pointer-events-none' : ''}`}
              onClick={() => handleWordClick(pair.id)}
            >
              <div className="text-lg font-semibold text-gray-800">
                {pair.word}
              </div>
              {showResults && isWordMatched(pair.id) && (
                <div className="flex justify-center mt-2">
                  <CheckCircle className={`w-5 h-5 ${
                    isCorrectMatch(pair.id) ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Images Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Images</h3>
          {matchPairs.map(pair => (
            <Card
              key={`image-${pair.id}`}
              className={`p-4 cursor-pointer transition-all ${
                isImageMatched(pair.id)
                  ? showResults && isCorrectMatch(pair.id)
                    ? 'bg-green-100 border-green-500'
                    : showResults
                    ? 'bg-red-100 border-red-500'
                    : 'bg-blue-100 border-blue-500 opacity-75'
                  : selectedImage === pair.id
                  ? 'bg-yellow-100 border-yellow-500 scale-105'
                  : 'hover:bg-gray-50 hover:shadow-md'
              } ${showResults ? 'pointer-events-none' : ''}`}
              onClick={() => handleImageClick(pair.id)}
            >
              <div className="text-4xl mb-2">{pair.image}</div>
              <div className="text-sm text-gray-600">{pair.description}</div>
              {showResults && isImageMatched(pair.id) && (
                <div className="flex justify-center mt-2">
                  <CheckCircle className={`w-5 h-5 ${
                    isCorrectMatch(pair.id) ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Current Selection */}
      {(selectedWord || selectedImage) && !showResults && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            {selectedWord && !selectedImage && "Now click on an image to match!"}
            {selectedImage && !selectedWord && "Now click on a word to match!"}
            {selectedWord && selectedImage && "Creating match..."}
          </p>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {score === matchPairs.length ? '🎉 Perfect!' : '💫 Good effort!'}
            </div>
            <div className="text-lg text-gray-600">
              You matched {score} out of {matchPairs.length} correctly!
            </div>
          </div>

          {score < matchPairs.length && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Correct matches:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>👋 = Hello (waving hand greeting)</li>
                <li>🚪 = Goodbye (leaving/door)</li>
                <li>🤝 = Nice to meet you (handshake)</li>
                <li>📛 = My name is (name tag)</li>
              </ul>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            
            {score >= 3 && (
              <Button 
                onClick={onNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue Learning
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          🎮 <strong>How to play:</strong> Click a word, then click the image that matches it. Think about what each greeting or phrase represents!
        </p>
      </div>
    </div>
  );
}