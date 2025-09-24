import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

interface TopicIntroSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function TopicIntroSlide({ onComplete, onNext, isCompleted }: TopicIntroSlideProps) {
  const [animationStage, setAnimationStage] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);

  useEffect(() => {
    // Auto-advance animation
    const timer = setTimeout(() => {
      if (animationStage < 3) {
        setAnimationStage(prev => prev + 1);
      } else if (!hasWatched) {
        setHasWatched(true);
        if (!isCompleted) {
          onComplete();
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [animationStage, hasWatched, isCompleted, onComplete]);

  const playAudio = () => {
    // Simulate audio play
    const utterance = new SpeechSynthesisUtterance("Hello! What's your name?");
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          👋 Meet Our Friends!
        </h2>
        <p className="text-lg text-gray-600">
          Watch how Ed and Anna greet each other
        </p>
      </div>

      {/* Animated Characters */}
      <div className="flex justify-center items-center gap-12 py-8">
        {/* Ed Character */}
        <div className={`transform transition-all duration-1000 ${
          animationStage >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
        }`}>
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="text-6xl mb-2">👦</div>
            <div className="font-bold text-blue-800">Ed</div>
            {animationStage >= 2 && (
              <div className="mt-2 p-2 bg-white rounded-lg shadow-sm">
                <div className="text-sm font-medium">"Hello!"</div>
              </div>
            )}
          </Card>
        </div>

        {/* Speech Bubble */}
        {animationStage >= 3 && (
          <div className="animate-bounce">
            <Card className="p-4 bg-yellow-100 border-yellow-300">
              <div className="text-lg font-bold text-yellow-800">
                "What's your name?"
              </div>
            </Card>
          </div>
        )}

        {/* Anna Character */}
        <div className={`transform transition-all duration-1000 ${
          animationStage >= 1 ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
        }`}>
          <Card className="p-6 bg-pink-50 border-pink-200">
            <div className="text-6xl mb-2">👧</div>
            <div className="font-bold text-pink-800">Anna</div>
            {animationStage >= 2 && (
              <div className="mt-2 p-2 bg-white rounded-lg shadow-sm">
                <div className="text-sm font-medium">"Hi!"</div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Audio Button */}
      <div className="flex justify-center">
        <Button
          onClick={playAudio}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Listen to the Greeting
        </Button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3].map((stage) => (
          <div
            key={stage}
            className={`w-3 h-3 rounded-full transition-colors ${
              animationStage >= stage ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {hasWatched && (
        <div className="space-y-4">
          <div className="text-green-600 font-semibold">
            ✅ Animation complete!
          </div>
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Let's Learn Greetings!
          </Button>
        </div>
      )}

      {/* Learning Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          🎭 <strong>In this lesson:</strong> We'll learn how to say hello, introduce ourselves, and be polite when meeting new people.
        </p>
      </div>
    </div>
  );
}