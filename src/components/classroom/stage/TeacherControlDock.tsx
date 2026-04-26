import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Layout, Globe, PenTool, Pencil, Eraser, MousePointer2, Hand, Trash2, ChevronLeft, ChevronRight, Check, Unlock, Star, Timer as TimerIcon, Dice6, Smile, Sparkles, Cloud, Loader2, ArrowLeft, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { StageMode } from '@/services/whiteboardService';
import { createHyperbeamSession } from './MultiplayerWebStage';
import { coBrowserController } from './coBrowserController';
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

  // Consolidated classroom tools (moved from left sidebar)
  onGiveStar?: () => void;
  onOpenTimer?: () => void;
  onRollDice?: () => void;
  onSendSticker?: (emoji: string) => void;
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
  onGiveStar,
  onOpenTimer,
  onRollDice,
  onSendSticker,
}) => {
  const [urlDraft, setUrlDraft] = useState(embeddedUrl ?? '');
  const [coPlayLoading, setCoPlayLoading] = useState(false);
  const { toast } = useToast();

  const isCoPlay = !!embeddedUrl && /\.hyperbeam\.com\//i.test(embeddedUrl);

  const submitUrl = () => {
    if (!urlDraft.trim()) return;
    let normalized = urlDraft.trim();
    if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;
    coBrowserController.homeUrl = normalized;
    // If a co-play session is already live, navigate inside it instead of
    // swapping the embed URL (which would tear down the cloud browser).
    if (isCoPlay) {
      coBrowserController.emit('home', normalized);
    } else {
      onEmbedUrl(normalized);
    }
  };

  const launchCoPlay = async () => {
    setCoPlayLoading(true);
    try {
      const start = urlDraft.trim() || 'https://www.gamestolearnenglish.com/';
      const startNormalized = /^https?:\/\//i.test(start) ? start : `https://${start}`;
      coBrowserController.homeUrl = startNormalized;
      const { embedUrl } = await createHyperbeamSession(startNormalized, 'teacher');
      onEmbedUrl(embedUrl);
      toast({ title: 'Co-Play stage ready', description: 'You and the student are now in the same browser.' });
    } catch (err: any) {
      console.error('[Co-Play] failed:', err);
      const msg: string = err?.message ?? 'Could not start cloud browser.';
      const isRateLimit = /rate[- ]limit|too[_ ]many/i.test(msg);
      // Fall back to a regular iframe so the teacher can still share the page.
      const fallback = urlDraft.trim();
      if (fallback) {
        const normalized = /^https?:\/\//i.test(fallback) ? fallback : `https://${fallback}`;
        onEmbedUrl(normalized);
        toast({
          title: isRateLimit ? 'Co-Play unavailable — using regular embed' : 'Co-Play failed — using regular embed',
          description: isRateLimit
            ? 'Hyperbeam is rate-limited. Showing the page in a normal iframe instead. Try Co-Play again in ~60s.'
            : msg,
          variant: isRateLimit ? 'default' : 'destructive',
        });
      } else {
        toast({ title: 'Co-Play failed', description: msg, variant: 'destructive' });
      }
    } finally {
      setCoPlayLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto">
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
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={submitUrl} title="Load URL (iframe)">
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="default"
              className="h-8 gap-1.5 text-xs"
              onClick={launchCoPlay}
              disabled={coPlayLoading}
              title="Launch a true co-play cloud browser session"
            >
              {coPlayLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
              Co-Play
            </Button>
          </div>
        )}

        {/* Co-browser navigation — Back / Forward / Reload / Home (Co-Play only) */}
        {mode === 'web' && isCoPlay && (
          <div className="flex items-center gap-1 pr-2 border-r border-border">
            <Button
              size="icon" variant="ghost" className="h-8 w-8"
              onClick={() => coBrowserController.emit('back')}
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon" variant="ghost" className="h-8 w-8"
              onClick={() => coBrowserController.emit('forward')}
              title="Forward"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon" variant="ghost" className="h-8 w-8"
              onClick={() => coBrowserController.emit('reload')}
              title="Reload"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon" variant="ghost" className="h-8 w-8"
              onClick={() => coBrowserController.emit('home')}
              disabled={!coBrowserController.homeUrl}
              title={coBrowserController.homeUrl ? `Home: ${coBrowserController.homeUrl}` : 'Set a Home URL by submitting a URL above'}
            >
              <Home className="h-4 w-4" />
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

        {/* Consolidated Classroom Tools (Star / Timer / Dice / Reactions) */}
        {(onGiveStar || onOpenTimer || onRollDice || onSendSticker) && (
          <div className="pl-2 ml-1 border-l border-border">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="default" className="h-8 gap-1.5 text-xs" title="Classroom Tools">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tools
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end" side="top">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {onGiveStar && (
                      <Button variant="ghost" onClick={onGiveStar} className="h-16 flex flex-col items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Star className="h-5 w-5" />
                        <span className="text-[10px] font-semibold">Give Star</span>
                      </Button>
                    )}
                    {onOpenTimer && (
                      <Button variant="ghost" onClick={onOpenTimer} className="h-16 flex flex-col items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                        <TimerIcon className="h-5 w-5" />
                        <span className="text-[10px] font-semibold">Timer</span>
                      </Button>
                    )}
                    {onRollDice && (
                      <Button variant="ghost" onClick={onRollDice} className="h-16 flex flex-col items-center justify-center gap-1 bg-purple-500 hover:bg-purple-600 text-white">
                        <Dice6 className="h-5 w-5" />
                        <span className="text-[10px] font-semibold">Dice</span>
                      </Button>
                    )}
                  </div>
                  {onSendSticker && (
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1.5">
                        <Smile className="h-3 w-3" /> Reactions
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {STICKER_PACK.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => onSendSticker(emoji)}
                            className="h-10 w-full text-xl rounded-lg hover:bg-pink-100 active:scale-95 transition-all flex items-center justify-center"
                            aria-label={`Send ${emoji} reaction`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
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
