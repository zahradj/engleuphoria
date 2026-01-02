import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Timer, Dice6, Smile, PenLine, PenOff } from 'lucide-react';

interface InteractionToolsGridProps {
  onGiveStar: () => void;
  onOpenTimer: () => void;
  onRollDice: () => void;
  onSendSticker: () => void;
  studentCanDraw?: boolean;
  onToggleStudentDrawing?: () => void;
}

export const InteractionToolsGrid: React.FC<InteractionToolsGridProps> = ({
  onGiveStar,
  onOpenTimer,
  onRollDice,
  onSendSticker,
  studentCanDraw = false,
  onToggleStudentDrawing
}) => {
  const tools = [
    { icon: Star, label: 'Star', color: 'bg-yellow-500 hover:bg-yellow-600', action: onGiveStar },
    { icon: Timer, label: 'Timer', color: 'bg-blue-500 hover:bg-blue-600', action: onOpenTimer },
    { icon: Dice6, label: 'Dice', color: 'bg-purple-500 hover:bg-purple-600', action: onRollDice },
    { icon: Smile, label: 'Sticker', color: 'bg-pink-500 hover:bg-pink-600', action: onSendSticker }
  ];

  return (
    <div className="space-y-2">
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
      {onToggleStudentDrawing && (
        <Button
          variant="ghost"
          className={`w-full h-10 flex items-center justify-center gap-2 text-white transition-all ${
            studentCanDraw ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
          }`}
          onClick={onToggleStudentDrawing}
        >
          {studentCanDraw ? <PenLine className="h-4 w-4" /> : <PenOff className="h-4 w-4" />}
          <span className="text-xs font-medium">
            {studentCanDraw ? 'Student Drawing: ON' : 'Student Drawing: OFF'}
          </span>
        </Button>
      )}
    </div>
  );
};
