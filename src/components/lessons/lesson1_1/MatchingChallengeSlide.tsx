import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MatchingChallengeSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function MatchingChallengeSlide({ onComplete, onNext, isCompleted }: MatchingChallengeSlideProps) {
  const [matches, setMatches] = useState(0);

  const handleMatch = () => {
    setMatches(prev => prev + 1);
    if (matches >= 2 && !isCompleted) onComplete();
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-bold">🎯 Matching Challenge</h2>
      <Card className="p-8">
        <p>Match sentences to pictures:</p>
        <Button onClick={handleMatch} className="m-2">This is Ed 👦</Button>
        <Button onClick={handleMatch} className="m-2">Nice to meet you 🤝</Button>
      </Card>
      {matches >= 3 && <Button onClick={onNext}>Continue</Button>}
    </div>
  );
}