import React from 'react';
import { Type, ImageIcon, Square, HelpCircle, Link2, FileText, Volume2, Puzzle, Video, ArrowDownUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CanvasElementType } from '../types';

interface ElementToolbarProps {
  onAddElement: (type: CanvasElementType) => void;
}

const ELEMENTS: { type: CanvasElementType; label: string; icon: React.ElementType; group: string }[] = [
  { type: 'text', label: 'Text', icon: Type, group: 'basic' },
  { type: 'image', label: 'Image', icon: ImageIcon, group: 'basic' },
  { type: 'shape', label: 'Shape', icon: Square, group: 'basic' },
  { type: 'video', label: 'Video', icon: Video, group: 'basic' },
  { type: 'audio', label: 'Audio', icon: Volume2, group: 'basic' },
  { type: 'quiz', label: 'Quiz', icon: HelpCircle, group: 'activity' },
  { type: 'matching', label: 'Matching', icon: Link2, group: 'activity' },
  { type: 'fill-blank', label: 'Fill Blank', icon: FileText, group: 'activity' },
  { type: 'drag-drop', label: 'Drag & Drop', icon: Puzzle, group: 'activity' },
  { type: 'sorting', label: 'Sorting', icon: ArrowDownUp, group: 'activity' },
  { type: 'sentence-builder', label: 'Sentence', icon: BookOpen, group: 'activity' },
];

export const ElementToolbar: React.FC<ElementToolbarProps> = ({ onAddElement }) => {
  const basicElements = ELEMENTS.filter(e => e.group === 'basic');
  const activityElements = ELEMENTS.filter(e => e.group === 'activity');

  return (
    <div className="w-16 bg-card border-r border-border flex flex-col items-center py-3 gap-1 overflow-y-auto">
      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Add</p>
      
      {basicElements.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant="ghost"
          size="icon"
          className="w-12 h-12 flex flex-col gap-0.5 hover:bg-primary/10"
          onClick={() => onAddElement(type)}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="text-[8px] leading-none">{label}</span>
        </Button>
      ))}

      <Separator className="my-1 w-10" />

      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Games</p>

      {activityElements.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant="ghost"
          size="icon"
          className="w-12 h-12 flex flex-col gap-0.5 hover:bg-accent/30"
          onClick={() => onAddElement(type)}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="text-[8px] leading-none">{label}</span>
        </Button>
      ))}
    </div>
  );
};
