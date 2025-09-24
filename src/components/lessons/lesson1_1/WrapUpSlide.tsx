import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

interface WrapUpSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function WrapUpSlide({ onComplete, onNext, isCompleted }: WrapUpSlideProps) {
  const handleFinish = () => {
    if (!isCompleted) onComplete();
  };

  return (
    <div className="text-center space-y-8">
      <div className="text-4xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold text-green-600">Lesson Complete!</h2>
      
      <Card className="p-8 bg-gradient-to-r from-green-100 to-blue-100 max-w-2xl mx-auto">
        <div className="text-6xl mb-4">🏅</div>
        <div className="text-2xl font-bold text-gray-800 mb-4">
          Friendly Greeter Badge Earned!
        </div>
        <p className="text-gray-600 mb-6">
          Great job! You can now say hello, introduce yourself, and say "Nice to meet you."
        </p>
        
        <div className="space-y-2 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-800">What you learned:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✅ Greet others: Hello/Hi</li>
            <li>✅ Say goodbye: Goodbye/Bye</li>
            <li>✅ Introduce yourself: My name is...</li>
            <li>✅ Be polite: Nice to meet you</li>
            <li>✅ Letter A words: Apple, Ant, Alligator</li>
          </ul>
        </div>
      </Card>

      <Button 
        onClick={handleFinish}
        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 flex items-center gap-2 mx-auto"
      >
        <Award className="w-5 h-5" />
        Claim Your Badge!
      </Button>
    </div>
  );
}