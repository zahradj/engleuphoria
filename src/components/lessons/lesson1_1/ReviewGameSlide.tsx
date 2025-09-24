import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReviewGameSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function ReviewGameSlide({ onComplete, onNext, isCompleted }: ReviewGameSlideProps) {
  const [position, setPosition] = useState(0);

  const rollDice = () => {
    setPosition(prev => prev + 1);
    if (position >= 4 && !isCompleted) onComplete();
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-bold">🎲 Review Game</h2>
      <div className="text-lg">Position: {position}/5</div>
      <Button onClick={rollDice}>Roll Dice & Say Phrase</Button>
      {position >= 5 && <Button onClick={onNext}>Finish Review</Button>}
    </div>
  );
}