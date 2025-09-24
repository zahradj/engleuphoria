import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ListeningChooseSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function ListeningChooseSlide({ onComplete, onNext, isCompleted }: ListeningChooseSlideProps) {
  const [answered, setAnswered] = useState(false);

  const handleAnswer = () => {
    setAnswered(true);
    if (!isCompleted) onComplete();
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-bold">👂 Listen & Choose</h2>
      <Card className="p-8">
        <p className="mb-4">Listen: "My name is Ed. Nice to meet you."</p>
        <div className="space-x-4">
          <Button onClick={handleAnswer}>👦 Ed</Button>
          <Button variant="outline">👧 Anna</Button>
        </div>
      </Card>
      {answered && <Button onClick={onNext}>Continue</Button>}
    </div>
  );
}