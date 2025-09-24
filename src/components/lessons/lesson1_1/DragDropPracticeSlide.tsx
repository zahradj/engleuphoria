import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, RotateCcw } from "lucide-react";

interface DragDropPracticeSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const phrases = [
  { id: 1, text: "Hello", type: "greeting" },
  { id: 2, text: "Hi", type: "greeting" },
  { id: 3, text: "Goodbye", type: "farewell" },
  { id: 4, text: "Bye", type: "farewell" },
];

const scenarios = [
  { id: 1, situation: "Meeting someone new", correctType: "greeting", emoji: "🤝" },
  { id: 2, situation: "Leaving school", correctType: "farewell", emoji: "🏫" },
  { id: 3, situation: "Seeing a friend", correctType: "greeting", emoji: "👋" },
  { id: 4, situation: "Going home", correctType: "farewell", emoji: "🏠" },
];

export function DragDropPracticeSlide({ onComplete, onNext, isCompleted }: DragDropPracticeSlideProps) {
  const [droppedPhrases, setDroppedPhrases] = useState<{[key: number]: number}>({});
  const [usedPhrases, setUsedPhrases] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleDragStart = (e: React.DragEvent, phraseId: number) => {
    e.dataTransfer.setData("phraseId", phraseId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, scenarioId: number) => {
    e.preventDefault();
    const phraseId = parseInt(e.dataTransfer.getData("phraseId"));
    
    if (usedPhrases.has(phraseId)) return;

    setDroppedPhrases(prev => ({ ...prev, [scenarioId]: phraseId }));
    setUsedPhrases(prev => new Set([...prev, phraseId]));

    // Check if all scenarios have been filled
    if (Object.keys(droppedPhrases).length === scenarios.length - 1) {
      setTimeout(() => {
        checkAnswers();
      }, 500);
    }
  };

  const checkAnswers = () => {
    let correctCount = 0;
    
    scenarios.forEach(scenario => {
      const droppedPhraseId = droppedPhrases[scenario.id];
      if (droppedPhraseId) {
        const phrase = phrases.find(p => p.id === droppedPhraseId);
        if (phrase && phrase.type === scenario.correctType) {
          correctCount++;
        }
      }
    });

    setScore(correctCount);
    setShowResults(true);
    
    if (correctCount >= 3 && !isCompleted) {
      onComplete();
    }
  };

  const resetGame = () => {
    setDroppedPhrases({});
    setUsedPhrases(new Set());
    setShowResults(false);
    setScore(0);
  };

  const isCorrect = (scenarioId: number) => {
    const droppedPhraseId = droppedPhrases[scenarioId];
    if (!droppedPhraseId) return null;
    
    const phrase = phrases.find(p => p.id === droppedPhraseId);
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    return phrase && scenario && phrase.type === scenario.correctType;
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Drag & Drop Practice
        </h2>
        <p className="text-lg text-gray-600">
          Drag the correct greeting or farewell to each situation!
        </p>
      </div>

      {/* Draggable Phrases */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Phrases:</h3>
        <div className="flex justify-center gap-4">
          {phrases.map(phrase => (
            <Card
              key={phrase.id}
              className={`p-4 cursor-grab active:cursor-grabbing transition-all ${
                usedPhrases.has(phrase.id) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg hover:scale-105'
              }`}
              draggable={!usedPhrases.has(phrase.id)}
              onDragStart={(e) => handleDragStart(e, phrase.id)}
            >
              <div className="text-xl font-bold text-blue-600">
                {phrase.text}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Drop Zones (Scenarios) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {scenarios.map(scenario => {
          const droppedPhraseId = droppedPhrases[scenario.id];
          const droppedPhrase = droppedPhraseId ? phrases.find(p => p.id === droppedPhraseId) : null;
          const correct = isCorrect(scenario.id);
          
          return (
            <Card
              key={scenario.id}
              className={`p-6 border-2 border-dashed min-h-[120px] flex flex-col items-center justify-center transition-all ${
                droppedPhrase
                  ? showResults
                    ? correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, scenario.id)}
            >
              <div className="text-3xl mb-2">{scenario.emoji}</div>
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {scenario.situation}
              </div>
              
              {droppedPhrase ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-600">
                    {droppedPhrase.text}
                  </span>
                  {showResults && (
                    <CheckCircle className={`w-5 h-5 ${
                      correct ? 'text-green-600' : 'text-red-600'
                    }`} />
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  Drop a phrase here
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {score >= 3 ? '🎉 Excellent!' : '💫 Good try!'}
            </div>
            <div className="text-lg text-gray-600">
              You got {score} out of {scenarios.length} correct!
            </div>
          </div>

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
          🎮 <strong>How to play:</strong> Drag each phrase from the top to the situation where you would use it. Think about when you say hello vs goodbye!
        </p>
      </div>
    </div>
  );
}