
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wand2, 
  Grid3x3, 
  CirclePlay, 
  Dice1, 
  RotateCcw, 
  Shuffle, 
  CheckCircle, 
  Play,
  Star,
  Sparkles
} from "lucide-react";

interface GameSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameId: string, gameTitle: string) => void;
}

export function GameSelectionDialog({ isOpen, onClose, onSelectGame }: GameSelectionDialogProps) {
  const aiGames = [
    {
      id: "create-activity",
      title: "AI Activity Generator",
      description: "Create custom activities with AI - worksheets, games & more!",
      icon: Wand2,
      color: "bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700",
      isNew: true,
      isFeatured: true
    },
    {
      id: "enhanced-drag-drop",
      title: "Grab & Drag Match",
      description: "AI-powered drag and drop matching games",
      icon: Grid3x3,
      color: "bg-emerald-100 text-emerald-700",
      isNew: true
    },
    {
      id: "spinning-wheel",
      title: "AI Spinning Wheel",
      description: "Interactive wheel with AI-generated content",
      icon: CirclePlay,
      color: "bg-purple-100 text-purple-700",
      isNew: true
    },
    {
      id: "dice-rolling",
      title: "Roll the Dice",
      description: "Story dice and vocabulary challenges",
      icon: Dice1,
      color: "bg-blue-100 text-blue-700",
      isNew: true
    }
  ];

  const classicGames = [
    {
      id: "flashcards",
      title: "Vocabulary Flashcards",
      description: "Practice new words with interactive cards",
      icon: RotateCcw,
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "sentence-builder",
      title: "Sentence Builder",
      description: "Drag words to create proper sentences",
      icon: Shuffle,
      color: "bg-green-100 text-green-700"
    },
    {
      id: "word-match",
      title: "Word Matching",
      description: "Match words with their meanings",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: "quiz-spinner",
      title: "Quiz Spinner",
      description: "Spin the wheel for random questions",
      icon: Play,
      color: "bg-orange-100 text-orange-700"
    }
  ];

  const handleGameSelect = (gameId: string, gameTitle: string) => {
    onSelectGame(gameId, gameTitle);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-600" />
            Embed Game into Whiteboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Featured AI Games */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-purple-600" />
              <h4 className="font-medium text-purple-800">✨ Featured AI Games</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {aiGames.map((game) => (
                <Card 
                  key={game.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-all relative group ${
                    game.isFeatured ? 'ring-2 ring-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' : ''
                  }`}
                  onClick={() => handleGameSelect(game.id, game.title)}
                >
                  {game.isNew && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1"
                    >
                      NEW
                    </Badge>
                  )}
                  
                  <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <game.icon size={24} />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{game.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{game.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500" />
                      <span className="text-xs text-yellow-600 font-medium">AI Powered</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      Embed
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Classic Games */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Classic Games</h4>
            <div className="grid grid-cols-2 gap-3">
              {classicGames.map((game) => (
                <Card 
                  key={game.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-all relative group"
                  onClick={() => handleGameSelect(game.id, game.title)}
                >
                  <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <game.icon size={24} />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{game.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{game.description}</p>
                  
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      Embed
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
