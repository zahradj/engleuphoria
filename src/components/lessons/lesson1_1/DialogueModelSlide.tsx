import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Play, Pause } from "lucide-react";

interface DialogueModelSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const dialogue = [
  { character: "Ed", text: "Hello! My name is Ed.", emoji: "👦", delay: 0 },
  { character: "Anna", text: "Hi, Ed. My name is Anna. Nice to meet you.", emoji: "👧", delay: 2000 },
  { character: "Ed", text: "Nice to meet you too!", emoji: "👦", delay: 4000 },
];

export function DialogueModelSlide({ onComplete, onNext, isCompleted }: DialogueModelSlideProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWatchedAll, setHasWatchedAll] = useState(false);

  const playDialogue = () => {
    setIsPlaying(true);
    setCurrentLine(0);

    dialogue.forEach((line, index) => {
      setTimeout(() => {
        setCurrentLine(index);
        
        // Play audio for each line
        const utterance = new SpeechSynthesisUtterance(line.text);
        utterance.rate = 0.8;
        utterance.pitch = line.character === "Anna" ? 1.3 : 1.0;
        speechSynthesis.speak(utterance);

        // Complete when dialogue finishes
        if (index === dialogue.length - 1) {
          setTimeout(() => {
            setIsPlaying(false);
            setHasWatchedAll(true);
            if (!isCompleted) {
              onComplete();
            }
          }, 2000);
        }
      }, line.delay);
    });
  };

  const stopDialogue = () => {
    setIsPlaying(false);
    speechSynthesis.cancel();
  };

  const playSpecificLine = (index: number) => {
    const line = dialogue[index];
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.rate = 0.8;
    utterance.pitch = line.character === "Anna" ? 1.3 : 1.0;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎭 Dialogue Model
        </h2>
        <p className="text-lg text-gray-600">
          Watch and listen to a perfect greeting conversation
        </p>
      </div>

      {/* Play Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={playDialogue}
          disabled={isPlaying}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Play Dialogue
        </Button>
        
        {isPlaying && (
          <Button
            onClick={stopDialogue}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Stop
          </Button>
        )}
      </div>

      {/* Dialogue Display */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {dialogue.map((line, index) => (
          <Card
            key={index}
            className={`p-6 transition-all duration-500 ${
              isPlaying && currentLine === index
                ? 'bg-yellow-100 border-yellow-400 scale-105'
                : hasWatchedAll || currentLine > index
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 opacity-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{line.emoji}</div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg text-gray-800 mb-1">
                  {line.character}
                </div>
                <div className="text-gray-700 text-lg">
                  "{line.text}"
                </div>
              </div>
              <Button
                onClick={() => playSpecificLine(index)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Hear
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Indicator */}
      {isPlaying && (
        <div className="flex justify-center gap-2">
          {dialogue.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentLine >= index ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {hasWatchedAll && (
        <div className="space-y-4">
          <div className="text-green-600 font-semibold text-lg">
            ✅ Great! You've seen a perfect greeting conversation!
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              📝 <strong>Key phrases you learned:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>"Hello! My name is..."</li>
                <li>"Hi, [name]. My name is..."</li>
                <li>"Nice to meet you."</li>
                <li>"Nice to meet you too!"</li>
              </ul>
            </div>
          </div>
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Practice Time!
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          🎬 <strong>Watch carefully:</strong> This is how English speakers greet each other and introduce themselves politely.
        </p>
      </div>
    </div>
  );
}