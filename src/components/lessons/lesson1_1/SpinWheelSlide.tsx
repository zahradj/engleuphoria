import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SpinWheelSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const phrases = ["Hello", "Goodbye", "My name is...", "Nice to meet you"];

export function SpinWheelSlide({ onComplete, onNext, isCompleted }: SpinWheelSlideProps) {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [spins, setSpins] = useState(0);

  const spinWheel = () => {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(randomPhrase);
    setSpins(prev => prev + 1);
    
    if (spins >= 2 && !isCompleted) {
      setTimeout(() => onComplete(), 1000);
    }
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-bold">🎡 Spin the Wheel</h2>
      <Card className="p-8">
        <div className="text-6xl mb-4">🎯</div>
        <div className="text-2xl mb-4">{currentPhrase || "Spin to start!"}</div>
        <Button onClick={spinWheel} className="mb-4">Spin!</Button>
        {currentPhrase && <p>Say this phrase aloud!</p>}
      </Card>
      {spins >= 3 && <Button onClick={onNext}>Continue</Button>}
    </div>
  );
}