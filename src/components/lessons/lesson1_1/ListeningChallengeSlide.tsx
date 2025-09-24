import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, CheckCircle, XCircle } from "lucide-react";

interface ListeningChallengeSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const challenges = [
  { audio: "Hello", options: ["👋 Hello", "✋ Goodbye", "😊 Hi"], correct: 0 },
  { audio: "Goodbye", options: ["👋 Hello", "✋ Goodbye", "😊 Hi"], correct: 1 },
  { audio: "Hi", options: ["👋 Hello", "✋ Goodbye", "😊 Hi"], correct: 2 },
];

export function ListeningChallengeSlide({ onComplete, onNext, isCompleted }: ListeningChallengeSlideProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = challenges[currentChallenge];

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(challenge.audio);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === challenge.correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setCompleted(true);
        if (!isCompleted) {
          onComplete();
        }
      }
    }, 2000);
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎧 Listening Challenge
        </h2>
        <p className="text-lg text-gray-600">
          Listen carefully and choose the correct word!
        </p>
      </div>

      <div className="text-sm text-gray-500">
        Challenge {currentChallenge + 1} of {challenges.length} • Score: {score}/{challenges.length}
      </div>

      {!completed && (
        <>
          {/* Audio Button */}
          <div className="flex justify-center">
            <Button
              onClick={playAudio}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-3 px-8 py-4"
            >
              <Volume2 className="w-6 h-6" />
              <span className="text-lg">🔊 Listen</span>
            </Button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {challenge.options.map((option, index) => (
              <Card
                key={index}
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  selectedAnswer === index
                    ? showResult && index === challenge.correct
                      ? 'bg-green-100 border-green-500'
                      : showResult && index !== challenge.correct
                      ? 'bg-red-100 border-red-500'
                      : 'bg-blue-100 border-blue-500'
                    : 'hover:bg-gray-50 hover:shadow-md'
                } ${showResult ? 'pointer-events-none' : ''}`}
                onClick={() => !showResult && handleAnswer(index)}
              >
                <div className="text-3xl mb-2">
                  {option}
                </div>
                {showResult && selectedAnswer === index && (
                  <div className="flex justify-center">
                    {index === challenge.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {showResult && (
            <div className="text-center">
              {selectedAnswer === challenge.correct ? (
                <div className="text-green-600 font-semibold text-lg">
                  ✅ Correct! Well done!
                </div>
              ) : (
                <div className="text-orange-600 font-semibold text-lg">
                  💫 Good try! The correct answer was "{challenge.options[challenge.correct]}"
                </div>
              )}
            </div>
          )}
        </>
      )}

      {completed && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              Challenge Complete!
            </div>
            <div className="text-lg text-gray-600">
              Your score: {score}/{challenges.length}
            </div>
          </div>

          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue Learning
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          🎯 <strong>Instructions:</strong> Click the speaker button to hear the word, then click on the matching option below.
        </p>
      </div>
    </div>
  );
}