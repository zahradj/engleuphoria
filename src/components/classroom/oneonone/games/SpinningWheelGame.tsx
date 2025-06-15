
import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WheelSegment {
  id: string;
  content: string;
  color: string;
  type: 'question' | 'challenge' | 'vocabulary' | 'topic';
}

interface WheelConfig {
  id: string;
  name: string;
  segments: number;
  description: string;
}

export function SpinningWheelGame() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | null>(null);
  const [wheelConfig, setWheelConfig] = useState<WheelConfig>({
    id: 'vocabulary',
    name: 'Vocabulary Challenge',
    segments: 8,
    description: 'Spin for vocabulary questions'
  });
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [score, setScore] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  const wheelConfigs: WheelConfig[] = [
    { id: 'vocabulary', name: 'Vocabulary', segments: 8, description: 'Word definitions and usage' },
    { id: 'grammar', name: 'Grammar', segments: 8, description: 'Grammar rules and examples' },
    { id: 'conversation', name: 'Conversation', segments: 6, description: 'Speaking prompts' },
    { id: 'story', name: 'Story Time', segments: 10, description: 'Creative story prompts' }
  ];

  // AI-generated wheel content
  const generateWheelContent = (config: WheelConfig) => {
    const contentSets = {
      vocabulary: [
        "Define: Magnificent", "Use 'Determine' in a sentence", "Synonym for 'Happy'",
        "Antonym for 'Large'", "Spell: Necessary", "What is an adjective?",
        "Name 3 colors", "Plural of 'Child'"
      ],
      grammar: [
        "Past tense of 'Run'", "What is a verb?", "Give an example of a noun",
        "Use 'However' correctly", "What's a compound sentence?", "Active vs Passive voice",
        "Name 3 prepositions", "What is an adverb?"
      ],
      conversation: [
        "Describe your weekend", "Talk about your favorite food", "What's your dream job?",
        "Tell a funny story", "Describe your best friend", "What makes you happy?"
      ],
      story: [
        "A magical forest", "Space adventure", "Time travel", "Talking animals",
        "Underwater city", "Flying carpet", "Secret door", "Invisible cloak",
        "Robot friend", "Magic potion"
      ]
    };

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];

    const content = contentSets[config.id as keyof typeof contentSets] || contentSets.vocabulary;
    const segmentAngle = 360 / config.segments;
    
    return content.slice(0, config.segments).map((item, index) => ({
      id: `segment-${index}`,
      content: item,
      color: colors[index % colors.length],
      type: config.id as WheelSegment['type']
    }));
  };

  React.useEffect(() => {
    setSegments(generateWheelContent(wheelConfig));
    setSelectedSegment(null);
    setRotation(0);
  }, [wheelConfig]);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedSegment(null);
    
    // Generate random spin (3-8 full rotations + random angle)
    const spins = 3 + Math.random() * 5;
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;
    
    setRotation(totalRotation);
    
    // Calculate which segment was selected
    setTimeout(() => {
      const segmentAngle = 360 / wheelConfig.segments;
      const normalizedAngle = (360 - (totalRotation % 360) + 90) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const selectedSeg = segments[segmentIndex];
      
      setSelectedSegment(selectedSeg);
      setIsSpinning(false);
      setScore(prev => prev + 5);
      
      toast({
        title: "Wheel Stopped! 🎯",
        description: `You got: ${selectedSeg?.content}`,
      });
    }, 3000);
  };

  const resetWheel = () => {
    setRotation(0);
    setSelectedSegment(null);
    setScore(0);
  };

  const segmentAngle = 360 / wheelConfig.segments;

  return (
    <div className="space-y-4">
      {/* Configuration Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {wheelConfigs.map((config) => (
          <Button
            key={config.id}
            variant={wheelConfig.id === config.id ? "default" : "outline"}
            size="sm"
            onClick={() => setWheelConfig(config)}
            className="text-xs"
          >
            {config.name}
            <Badge variant="secondary" className="ml-1 text-xs">
              {config.segments}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Score and Controls */}
      <div className="flex items-center justify-between">
        <Badge variant="outline">Score: {score}</Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetWheel}>
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSegments(generateWheelContent(wheelConfig))}
          >
            <Settings size={14} className="mr-1" />
            New Content
          </Button>
        </div>
      </div>

      {/* Spinning Wheel */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          {/* Wheel */}
          <div 
            ref={wheelRef}
            className="relative w-80 h-80 rounded-full border-4 border-gray-800 overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
            }}
          >
            {segments.map((segment, index) => (
              <div
                key={segment.id}
                className="absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"
                style={{
                  backgroundColor: segment.color,
                  transform: `rotate(${index * segmentAngle}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(Math.PI * segmentAngle / 180)}% ${50 - 50 * Math.sin(Math.PI * segmentAngle / 180)}%)`
                }}
              >
                <div 
                  className="absolute text-center px-2"
                  style={{ 
                    transform: `rotate(-${index * segmentAngle}deg) translateY(-120px)`,
                    width: '150px',
                    marginLeft: '-75px'
                  }}
                >
                  {segment.content}
                </div>
              </div>
            ))}
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
            </div>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-600"></div>
          </div>
        </div>

        {/* Spin Button */}
        <Button 
          onClick={spinWheel} 
          disabled={isSpinning}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
        >
          {isSpinning ? (
            <>
              <Pause size={20} className="mr-2" />
              Spinning...
            </>
          ) : (
            <>
              <Play size={20} className="mr-2" />
              Spin the Wheel!
            </>
          )}
        </Button>

        {/* Result Display */}
        {selectedSegment && !isSpinning && (
          <Card className="p-4 bg-yellow-50 border-yellow-200 text-center max-w-md">
            <h4 className="font-bold text-yellow-800 mb-2">Your Challenge:</h4>
            <p className="text-yellow-700 text-lg">{selectedSegment.content}</p>
            <Badge variant="secondary" className="mt-2">
              +5 points
            </Badge>
          </Card>
        )}
      </div>
    </div>
  );
}
