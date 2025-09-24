import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shuffle, Volume2, Users } from "lucide-react";

interface RolePlaySlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const characters = [
  { 
    id: 1, 
    name: "Ed", 
    emoji: "👦", 
    lines: [
      "Hello! My name is Ed.",
      "Nice to meet you too!",
      "How are you today?"
    ]
  },
  { 
    id: 2, 
    name: "Anna", 
    emoji: "👧", 
    lines: [
      "Hi, Ed. My name is Anna. Nice to meet you.",
      "I'm doing great, thank you!",
      "It's a pleasure to meet you."
    ]
  }
];

const scenarios = [
  {
    id: 1,
    title: "First Meeting",
    description: "You meet someone new at school",
    setting: "🏫 At School"
  },
  {
    id: 2,
    title: "Formal Introduction",
    description: "You meet someone at a formal event",
    setting: "🎉 At a Party"
  },
  {
    id: 3,
    title: "Casual Greeting",
    description: "You meet a new neighbor",
    setting: "🏠 In the Neighborhood"
  }
];

export function RolePlaySlide({ onComplete, onNext, isCompleted }: RolePlaySlideProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [hasPlayedBothRoles, setHasPlayedBothRoles] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<number>>(new Set());
  const [isPerforming, setIsPerforming] = useState(false);

  const scenario = scenarios[currentScenario];
  const character = selectedCharacter ? characters.find(c => c.id === selectedCharacter) : null;
  const otherCharacter = selectedCharacter ? characters.find(c => c.id !== selectedCharacter) : null;

  const startRolePlay = (characterId: number) => {
    setSelectedCharacter(characterId);
    setCurrentLine(0);
    setIsPerforming(true);
  };

  const speakLine = (text: string, isUser: boolean = true) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = isUser ? 1.0 : 1.3; // Different pitch for different characters
    speechSynthesis.speak(utterance);
  };

  const nextLine = () => {
    if (character && currentLine < character.lines.length - 1) {
      setCurrentLine(prev => prev + 1);
    } else {
      // Role play completed
      const newCompleted = new Set(completedScenarios);
      newCompleted.add(currentScenario);
      setCompletedScenarios(newCompleted);
      
      if (!hasPlayedBothRoles && selectedCharacter === 1) {
        setHasPlayedBothRoles(true);
      }
      
      setIsPerforming(false);
      setSelectedCharacter(null);
      
      if (newCompleted.size >= 2 && !isCompleted) {
        onComplete();
      }
    }
  };

  const randomizeScenario = () => {
    const nextScenario = (currentScenario + 1) % scenarios.length;
    setCurrentScenario(nextScenario);
    setSelectedCharacter(null);
    setCurrentLine(0);
    setIsPerforming(false);
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎭 Role-Play Cards
        </h2>
        <p className="text-lg text-gray-600">
          Choose a character and practice the conversation!
        </p>
      </div>

      {/* Current Scenario */}
      <Card className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 max-w-2xl mx-auto">
        <div className="text-2xl mb-2">{scenario.setting}</div>
        <div className="text-xl font-bold text-gray-800 mb-2">{scenario.title}</div>
        <div className="text-gray-600">{scenario.description}</div>
        
        <Button
          onClick={randomizeScenario}
          variant="outline"
          size="sm"
          className="mt-4 flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Change Scenario
        </Button>
      </Card>

      {!isPerforming && (
        <>
          {/* Character Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Choose Your Character:</h3>
            <div className="flex justify-center gap-6">
              {characters.map(character => (
                <Card
                  key={character.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => startRolePlay(character.id)}
                >
                  <div className="text-6xl mb-3">{character.emoji}</div>
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    {character.name}
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Play as {character.name}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Scenario Progress */}
          <div className="flex justify-center gap-2">
            {scenarios.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  completedScenarios.has(index)
                    ? 'bg-green-500'
                    : currentScenario === index
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {isPerforming && character && otherCharacter && (
        <div className="space-y-6">
          {/* Performance Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* User's Character */}
            <Card className="p-6 bg-yellow-100 border-yellow-400">
              <div className="text-4xl mb-3">{character.emoji}</div>
              <div className="text-xl font-bold text-gray-800 mb-4">
                You are {character.name}
              </div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="text-lg font-semibold text-gray-800">
                  Your line:
                </div>
                <div className="text-xl text-blue-600 font-bold mt-2">
                  "{character.lines[currentLine]}"
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => speakLine(character.lines[currentLine])}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear
                </Button>
                <Button
                  onClick={nextLine}
                  size="sm"
                  variant="outline"
                >
                  Say It!
                </Button>
              </div>
            </Card>

            {/* Other Character */}
            <Card className="p-6 bg-green-100 border-green-400">
              <div className="text-4xl mb-3">{otherCharacter.emoji}</div>
              <div className="text-xl font-bold text-gray-800 mb-4">
                {otherCharacter.name} says:
              </div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="text-lg text-green-600 font-bold">
                  "{otherCharacter.lines[currentLine]}"
                </div>
              </div>
              <Button
                onClick={() => speakLine(otherCharacter.lines[currentLine], false)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" />
                Hear {otherCharacter.name}
              </Button>
            </Card>
          </div>

          {/* Line Progress */}
          <div className="flex justify-center gap-2">
            {character.lines.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentLine > index
                    ? 'bg-green-500'
                    : currentLine === index
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {completedScenarios.size >= 2 && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-600">
            🎉 Excellent Role Playing!
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-green-800">
              You've successfully practiced greeting conversations in different scenarios. 
              You're ready to meet new people with confidence!
            </p>
          </div>
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue to Phonics!
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          🎬 <strong>How to role-play:</strong> Choose a character, listen to your line, practice saying it, then continue the conversation!
        </p>
      </div>
    </div>
  );
}
