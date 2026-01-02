import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Timer, Dice6, Smile } from 'lucide-react';

interface InteractionToolsGridProps {
  onGiveStar: () => void;
  onOpenTimer: () => void;
  onRollDice: () => void;
  onSendSticker: () => void;
}

export const InteractionToolsGrid: React.FC<InteractionToolsGridProps> = ({
  onGiveStar,
  onOpenTimer,
  onRollDice,
  onSendSticker
}) => {
  const tools = [
    { icon: Star, label: 'Star', color: 'bg-yellow-500 hover:bg-yellow-600', action: onGiveStar },
    { icon: Timer, label: 'Timer', color: 'bg-blue-500 hover:bg-blue-600', action: onOpenTimer },
    { icon: Dice6, label: 'Dice', color: 'bg-purple-500 hover:bg-purple-600', action: onRollDice },
    { icon: Smile, label: 'Sticker', color: 'bg-pink-500 hover:bg-pink-600', action: onSendSticker }
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {tools.map((tool) => (
        <Button
          key={tool.label}
          variant="ghost"
          className={`h-12 flex flex-col items-center justify-center gap-1 ${tool.color} text-white`}
          onClick={tool.action}
        >
          <tool.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{tool.label}</span>
        </Button>
      ))}
    </div>
  );
};
