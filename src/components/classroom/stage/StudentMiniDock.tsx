import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Pencil, Eraser, MousePointer2, Lock } from 'lucide-react';

const STUDENT_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#AA96DA', '#2D4059', '#000000'];

interface StudentMiniDockProps {
  drawingEnabled: boolean;
  activeTool: 'pen' | 'eraser' | 'pointer';
  onToolChange: (tool: 'pen' | 'eraser' | 'pointer') => void;
  activeColor: string;
  onColorChange: (color: string) => void;
}

export const StudentMiniDock: React.FC<StudentMiniDockProps> = ({
  drawingEnabled,
  activeTool,
  onToolChange,
  activeColor,
  onColorChange,
}) => {
  if (!drawingEnabled) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-none">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Teacher hasn't enabled drawing
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto">
      <div className="flex items-center gap-1 bg-background/85 backdrop-blur-xl rounded-full px-2 py-2 shadow-xl border border-border">
        <Button
          size="icon"
          variant={activeTool === 'pointer' ? 'default' : 'ghost'}
          onClick={() => onToolChange('pointer')}
          className="h-8 w-8 rounded-full"
          title="Pointer"
        >
          <MousePointer2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={activeTool === 'pen' ? 'default' : 'ghost'}
          onClick={() => onToolChange('pen')}
          className="h-8 w-8 rounded-full"
          title="Pen"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={activeTool === 'eraser' ? 'default' : 'ghost'}
          onClick={() => onToolChange('eraser')}
          className="h-8 w-8 rounded-full"
          title="Eraser"
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <div className="h-5 w-px bg-border mx-1" />
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" title="Color">
              <div className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: activeColor }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="center">
            <div className="grid grid-cols-3 gap-1.5">
              {STUDENT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${activeColor === color ? 'ring-2 ring-offset-1 ring-primary scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
