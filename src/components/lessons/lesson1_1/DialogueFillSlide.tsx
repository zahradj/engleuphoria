import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DialogueFillSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function DialogueFillSlide({ onComplete, onNext, isCompleted }: DialogueFillSlideProps) {
  const [name, setName] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = () => {
    if (name) {
      setCompleted(true);
      if (!isCompleted) onComplete();
    }
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-bold">💬 Fill Dialogue</h2>
      <div className="space-y-4">
        <p>👦 Ed: Hello! My name is <Input value={name} onChange={(e) => setName(e.target.value)} className="inline w-32" /></p>
        <p>👧 Anna: Hi, {name || "___"}. Nice to meet you.</p>
        <Button onClick={handleSubmit}>Complete</Button>
      </div>
      {completed && <Button onClick={onNext}>Continue</Button>}
    </div>
  );
}