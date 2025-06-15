
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Shuffle, RotateCcw, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiceConfig {
  id: string;
  name: string;
  description: string;
  diceCount: number;
  type: 'vocabulary' | 'grammar' | 'story' | 'conversation';
}

interface DiceResult {
  value: number;
  content: string;
  color: string;
}

export function DiceRollingGame() {
  const [diceConfig, setDiceConfig] = useState<DiceConfig>({
    id: 'vocabulary',
    name: 'Vocabulary Dice',
    description: 'Roll dice to get vocabulary challenges',
    diceCount: 2,
    type: 'vocabulary'
  });
  
  const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [aiChallenge, setAiChallenge] = useState<string>('');
  const [score, setScore] = useState(0);
  const [rollCount, setRollCount] = useState(0);
  
  const { toast } = useToast();

  const diceConfigs: DiceConfig[] = [
    { id: 'vocabulary', name: 'Vocabulary', description: 'Word challenges', diceCount: 2, type: 'vocabulary' },
    { id: 'grammar', name: 'Grammar', description: 'Grammar exercises', diceCount: 2, type: 'grammar' },
    { id: 'story', name: 'Story Dice', description: 'Creative storytelling', diceCount: 3, type: 'story' },
    { id: 'conversation', name: 'Talk Time', description: 'Speaking prompts', diceCount: 1, type: 'conversation' }
  ];

  // Dice content sets for different game types
  const diceContentSets = {
    vocabulary: [
      ['Action', 'Animal', 'Color', 'Food', 'Place', 'Thing'],
      ['Happy', 'Big', 'Fast', 'New', 'Old', 'Small'],
      ['Today', 'Yesterday', 'Always', 'Never', 'Sometimes', 'Often']
    ],
    grammar: [
      ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Conjunction'],
      ['Past', 'Present', 'Future', 'Perfect', 'Continuous', 'Simple'],
      ['Question', 'Statement', 'Command', 'Exclamation', 'Negative', 'Positive']
    ],
    story: [
      ['Castle', 'Forest', 'Ocean', 'City', 'Mountain', 'Desert'],
      ['Princess', 'Dragon', 'Wizard', 'Knight', 'Robot', 'Alien'],
      ['Magic', 'Adventure', 'Mystery', 'Friendship', 'Courage', 'Discovery']
    ],
    conversation: [
      ['Family', 'School', 'Hobbies', 'Food', 'Travel', 'Dreams'],
      ['Favorite', 'Least Favorite', 'Most Exciting', 'Scariest', 'Funniest', 'Best']
    ]
  };

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[value - 1] || Dice1;
    return <IconComponent size={24} />;
  };

  const generateAIChallenge = (results: DiceResult[]) => {
    const prompts = results.map(r => r.content);
    
    const challengeTemplates = {
      vocabulary: [
        `Create a sentence using these words: ${prompts.join(', ')}`,
        `Tell a story about something that is ${prompts.join(' and ')}`,
        `Describe ${prompts[0]} using the word ${prompts[1]}`,
        `What's the opposite of ${prompts[0]}? Use ${prompts[1]} in your answer`
      ],
      grammar: [
        `Create a ${prompts[1]} tense ${prompts[0]} about ${prompts[2] || 'your day'}`,
        `Make a ${prompts[2]} using a ${prompts[0]} in ${prompts[1]} tense`,
        `Transform this ${prompts[0]} into ${prompts[1]} form: "I eat breakfast"`,
        `Give an example of a ${prompts[0]} that shows ${prompts[1]} action`
      ],
      story: [
        `Tell a story about a ${prompts[1]} in a ${prompts[0]} who discovers ${prompts[2]}`,
        `Create an adventure where ${prompts[2]} happens in a ${prompts[0]} with a ${prompts[1]}`,
        `What would happen if a ${prompts[1]} brought ${prompts[2]} to a ${prompts[0]}?`,
        `Describe a day when ${prompts[2]} changed everything in the ${prompts[0]} for the ${prompts[1]}`
      ],
      conversation: [
        `Talk about your ${prompts[1]} ${prompts[0]}`,
        `Describe the ${prompts[1]} thing about ${prompts[0]}`,
        `Share a memory about ${prompts[0]} that was ${prompts[1]}`,
        `What makes ${prompts[0]} ${prompts[1]} for you?`
      ]
    };

    const templates = challengeTemplates[diceConfig.type] || challengeTemplates.vocabulary;
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setAiChallenge('');
    
    // Simulate rolling animation
    const rollInterval = setInterval(() => {
      const tempResults = Array(diceConfig.diceCount).fill(0).map((_, index) => {
        const value = Math.floor(Math.random() * 6) + 1;
        const contentSet = diceContentSets[diceConfig.type];
        const content = contentSet[index % contentSet.length]?.[value - 1] || 'Mystery';
        
        return {
          value,
          content,
          color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5]
        };
      });
      setDiceResults(tempResults);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      
      // Final results
      const finalResults = Array(diceConfig.diceCount).fill(0).map((_, index) => {
        const value = Math.floor(Math.random() * 6) + 1;
        const contentSet = diceContentSets[diceConfig.type];
        const content = contentSet[index % contentSet.length]?.[value - 1] || 'Mystery';
        
        return {
          value,
          content,
          color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5]
        };
      });
      
      setDiceResults(finalResults);
      setIsRolling(false);
      setRollCount(prev => prev + 1);
      setScore(prev => prev + finalResults.length * 2);
      
      // Generate AI challenge
      const challenge = generateAIChallenge(finalResults);
      setAiChallenge(challenge);
      
      toast({
        title: "Dice Rolled! 🎲",
        description: `You got: ${finalResults.map(r => r.content).join(', ')}`,
      });
    }, 2000);
  };

  const resetGame = () => {
    setDiceResults([]);
    setAiChallenge('');
    setScore(0);
    setRollCount(0);
  };

  return (
    <div className="space-y-4">
      {/* Game Mode Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {diceConfigs.map((config) => (
          <Button
            key={config.id}
            variant={diceConfig.id === config.id ? "default" : "outline"}
            size="sm"
            onClick={() => setDiceConfig(config)}
            className="text-xs"
          >
            {config.name}
            <Badge variant="secondary" className="ml-1 text-xs">
              {config.diceCount}🎲
            </Badge>
          </Button>
        ))}
      </div>

      {/* Score and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Score: {score}</Badge>
          <Badge variant="outline">Rolls: {rollCount}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Dice Display */}
      <div className="flex flex-col items-center space-y-6">
        <div className="flex gap-4 justify-center flex-wrap">
          {Array(diceConfig.diceCount).fill(0).map((_, index) => {
            const result = diceResults[index];
            return (
              <Card
                key={index}
                className={`p-6 transition-all duration-200 ${
                  isRolling ? 'animate-bounce' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: result?.color || '#f3f4f6',
                  borderColor: result?.color || '#e5e7eb'
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-white">
                    {result ? getDiceIcon(result.value) : getDiceIcon(1)}
                  </div>
                  <div className="text-white font-semibold text-sm text-center min-h-[20px]">
                    {result?.content || '?'}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Roll Button */}
        <Button 
          onClick={rollDice} 
          disabled={isRolling}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3"
        >
          {isRolling ? (
            <>
              <Shuffle size={20} className="mr-2 animate-spin" />
              Rolling...
            </>
          ) : (
            <>
              <Shuffle size={20} className="mr-2" />
              Roll the Dice!
            </>
          )}
        </Button>

        {/* AI Challenge Display */}
        {aiChallenge && !isRolling && (
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 text-center max-w-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star size={18} className="text-yellow-500" />
              <h4 className="font-bold text-green-800">Your Challenge:</h4>
              <Star size={18} className="text-yellow-500" />
            </div>
            <p className="text-green-700 text-lg leading-relaxed">{aiChallenge}</p>
            <Badge variant="secondary" className="mt-3">
              +{diceResults.length * 2} points earned
            </Badge>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-3 bg-gray-50 text-center max-w-md">
          <p className="text-sm text-gray-600">
            {diceConfig.description}. Roll the dice and complete the AI-generated challenge!
          </p>
        </Card>
      </div>
    </div>
  );
}
