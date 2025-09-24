import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, Frown } from "lucide-react";

interface WarmUpSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function WarmUpSlide({ onComplete, onNext, isCompleted }: WarmUpSlideProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleEmojiDrop = (emojiType: 'happy' | 'sad', target: 'hello' | 'goodbye') => {
    const isCorrect = 
      (emojiType === 'happy' && target === 'hello') || 
      (emojiType === 'sad' && target === 'goodbye');
    
    setShowResult(true);
    
    if (isCorrect && !isCompleted) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const handleDragStart = (e: React.DragEvent, emojiType: 'happy' | 'sad') => {
    e.dataTransfer.setData("emojiType", emojiType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, target: 'hello' | 'goodbye') => {
    e.preventDefault();
    const emojiType = e.dataTransfer.getData("emojiType") as 'happy' | 'sad';
    handleEmojiDrop(emojiType, target);
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎮 Emoji Hello!
        </h2>
        <p className="text-lg text-gray-600">
          Drag the right emoji to match the greeting!
        </p>
      </div>

      {/* Draggable Emojis */}
      <div className="flex justify-center gap-8 mb-8">
        <Card 
          className="p-6 cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow"
          draggable
          onDragStart={(e) => handleDragStart(e, 'happy')}
        >
          <div className="text-6xl">😊</div>
          <p className="text-sm font-medium mt-2">Happy Face</p>
        </Card>
        
        <Card 
          className="p-6 cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow"
          draggable
          onDragStart={(e) => handleDragStart(e, 'sad')}
        >
          <div className="text-6xl">😢</div>
          <p className="text-sm font-medium mt-2">Sad Face</p>
        </Card>
      </div>

      {/* Drop Zones */}
      <div className="flex justify-center gap-12">
        <Card 
          className="p-8 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors min-h-[120px] min-w-[150px] flex flex-col items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'hello')}
        >
          <div className="text-2xl font-bold text-blue-600 mb-2">HELLO</div>
          <div className="text-sm text-gray-500">Drop emoji here</div>
        </Card>

        <Card 
          className="p-8 border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors min-h-[120px] min-w-[150px] flex flex-col items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'goodbye')}
        >
          <div className="text-2xl font-bold text-purple-600 mb-2">GOODBYE</div>
          <div className="text-sm text-gray-500">Drop emoji here</div>
        </Card>
      </div>

      {showResult && (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-4">
            🎉 Great job!
          </div>
          <p className="text-gray-600">
            You matched the emojis correctly! Happy faces for hello, sad faces for goodbye.
          </p>
        </div>
      )}

      {(isCompleted || showResult) && (
        <Button 
          onClick={onNext}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Continue to Next Slide
        </Button>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Drag the happy emoji to "HELLO" and the sad emoji to "GOODBYE"
        </p>
      </div>
    </div>
  );
}