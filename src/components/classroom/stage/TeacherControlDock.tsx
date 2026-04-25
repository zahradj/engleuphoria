import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Layout, Globe, PenTool, Pencil, Eraser, MousePointer2, Hand, Trash2, ChevronLeft, ChevronRight, Check, Unlock, Star, Timer as TimerIcon, Dice6, Smile, Sparkles, Cloud, Loader2 } from 'lucide-react';
import { StageMode } from '@/services/whiteboardService';
import { createHyperbeamSession } from './MultiplayerWebStage';
import { useToast } from '@/hooks/use-toast';

const PEN_COLORS = ['#FF3B30', '#007AFF', '#34C759', '#FF9500', '#AF52DE', '#000000'];

const STICKER_PACK = ['👏', '👍', '❤️', '🔥', '🎉', '🌟', '💯', '😂'];

interface TeacherControlDockProps {
  mode: StageMode;
  onModeChange: (mode: StageMode) => void;
  embeddedUrl: string | null;
  onEmbedUrl: (url: string) => void;

  drawingEnabled: boolean;
  onToggleDrawing: (enabled: boolean) => void;

  activeTool: 'pen' | 'highlighter' | 'eraser' | 'pointer';
  onToolChange: (tool: 'pen' | 'highlighter' | 'eraser' | 'pointer') => void;
  activeColor: string;
  onColorChange: (color: string) => void;

  currentSlideIndex: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;

  onClearCanvas: () => void;

  iframeUnlocked: boolean;
  onToggleIframeUnlock: (unlocked: boolean) => void;
}

/**
 * Floating glassmorphic control dock for the teacher. Manages stage mode,
 * embedded URL, pen/eraser/color, drawing toggle, and slide navigation.
 */
export const TeacherControlDock: React.FC<TeacherControlDockProps> = ({
  mode,
  onModeChange,
  embeddedUrl,
  onEmbedUrl,
  drawingEnabled,
  onToggleDrawing,
  activeTool,
  onToolChange,
  activeColor,
  onColorChange,
  currentSlideIndex,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onClearCanvas,
  iframeUnlocked,
  onToggleIframeUnlock,
}) => {
  const [urlDraft, setUrlDraft] = useState(embeddedUrl ?? '');

  const submitUrl = () => {
    if (!urlDraft.trim()) return;
    let normalized = urlDraft.trim();
    if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;
    onEmbedUrl(normalized);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto">
      <div className="flex items-center gap-2 bg-background/85 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-2xl border border-border">
        {/* Mode switcher */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <ModeButton active={mode === 'slide'} onClick={() => onModeChange('slide')} Icon={Layout} label="Slide" />
          <ModeButton active={mode === 'web'} onClick={() => onModeChange('web')} Icon={Globe} label="Web" />
          <ModeButton active={mode === 'blank'} onClick={() => onModeChange('blank')} Icon={PenTool} label="Blank" />
        </div>

        {/* URL input — visible only when web mode */}
        {mode === 'web' && (
          <div className="flex items-center gap-1 pr-2 border-r border-border">
            <Input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitUrl(); }}
              placeholder="Paste a URL…"
              className="h-8 w-56 text-xs"
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={submitUrl} title="Load URL">
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Independent Play toggle — only when web mode */}
        {mode === 'web' && (
          <div className="flex items-center gap-2 pr-2 border-r border-border">
            <Unlock className={`h-3.5 w-3.5 ${iframeUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
            <label className="text-xs text-foreground select-none cursor-pointer" htmlFor="iframe-unlock-toggle">
              Unlock Student Interaction
            </label>
            <Switch
              id="iframe-unlock-toggle"
              checked={iframeUnlocked}
              onCheckedChange={onToggleIframeUnlock}
              aria-label="Unlock student interaction with embedded web page"
            />
          </div>
        )}

        {/* Slide nav — visible only when slide mode */}
        {mode === 'slide' && totalSlides > 0 && (
          <div className="flex items-center gap-1 pr-2 border-r border-border">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onPrevSlide} disabled={currentSlideIndex === 0} title="Previous slide">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums px-1">
              {currentSlideIndex + 1}/{totalSlides}
            </span>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onNextSlide} disabled={currentSlideIndex >= totalSlides - 1} title="Next slide">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Tools */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <ToolButton active={activeTool === 'pointer'} onClick={() => onToolChange('pointer')} Icon={MousePointer2} title="Pointer" />
          <ToolButton active={activeTool === 'pen'} onClick={() => onToolChange('pen')} Icon={Pencil} title="Pen" />
          <ToolButton active={activeTool === 'eraser'} onClick={() => onToolChange('eraser')} Icon={Eraser} title="Eraser" />
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8" title="Color">
                <div className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: activeColor }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="center">
              <div className="grid grid-cols-3 gap-1.5">
                {PEN_COLORS.map(color => (
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

        {/* Drawing toggle */}
        <Button
          size="sm"
          variant={drawingEnabled ? 'default' : 'outline'}
          onClick={() => onToggleDrawing(!drawingEnabled)}
          className="h-8 gap-1.5 text-xs"
          title={drawingEnabled ? 'Drawing ON — clicks draw on the overlay' : 'Drawing OFF — clicks pass through to content'}
        >
          <Hand className="h-3.5 w-3.5" />
          {drawingEnabled ? 'Drawing ON' : 'Drawing OFF'}
        </Button>

        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClearCanvas} title="Clear all annotations">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ModeButton: React.FC<{ active: boolean; onClick: () => void; Icon: React.ComponentType<{ className?: string }>; label: string }> = ({ active, onClick, Icon, label }) => (
  <Button
    size="sm"
    variant={active ? 'default' : 'ghost'}
    onClick={onClick}
    className="h-8 gap-1.5 text-xs"
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </Button>
);

const ToolButton: React.FC<{ active: boolean; onClick: () => void; Icon: React.ComponentType<{ className?: string }>; title: string }> = ({ active, onClick, Icon, title }) => (
  <Button
    size="icon"
    variant={active ? 'default' : 'ghost'}
    onClick={onClick}
    className="h-8 w-8"
    title={title}
  >
    <Icon className="h-4 w-4" />
  </Button>
);
