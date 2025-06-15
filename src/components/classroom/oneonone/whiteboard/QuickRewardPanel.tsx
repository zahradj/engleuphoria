
import React from "react";
import { SoundButton } from "@/components/ui/sound-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, Trophy, BookOpen, MessageCircle } from "lucide-react";

interface QuickRewardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardStar: () => void;
  onAwardTask: (type: 'WORKSHEET' | 'VOCABULARY' | 'SPEAKING_PRACTICE') => void;
}

export function QuickRewardPanel({
  isOpen,
  onClose,
  onAwardStar,
  onAwardTask
}: QuickRewardPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 z-50">
      <Card className="p-3 w-64 shadow-lg border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Trophy className="text-yellow-600" size={14} />
            Quick Rewards
          </h4>
          <SoundButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            ×
          </SoundButton>
        </div>
        
        <div className="space-y-2">
          <SoundButton 
            size="sm" 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xs"
            onClick={onAwardStar}
            soundType="reward"
          >
            <Star size={12} className="mr-1" />
            Award Star (+50 XP)
          </SoundButton>
          
          <div className="grid grid-cols-2 gap-1">
            <SoundButton
              variant="outline"
              size="sm"
              onClick={() => onAwardTask('WORKSHEET')}
              className="text-xs"
              soundType="success"
            >
              <BookOpen size={10} className="mr-1" />
              Worksheet (+20)
            </SoundButton>
            <SoundButton
              variant="outline"
              size="sm"
              onClick={() => onAwardTask('VOCABULARY')}
              className="text-xs"
              soundType="success"
            >
              Vocab (+10)
            </SoundButton>
          </div>
          
          <SoundButton
            variant="outline"
            size="sm"
            onClick={() => onAwardTask('SPEAKING_PRACTICE')}
            className="w-full text-xs"
            soundType="success"
          >
            <MessageCircle size={10} className="mr-1" />
            Speaking (+15)
          </SoundButton>
        </div>
        
        <div className="mt-3 pt-2 border-t">
          <Badge variant="secondary" className="text-xs">
            Teacher Rewards
          </Badge>
        </div>
      </Card>
    </div>
  );
}
