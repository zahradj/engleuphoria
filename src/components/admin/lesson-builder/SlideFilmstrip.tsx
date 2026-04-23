import React, { useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Trash2, GripVertical, Upload, ChevronDown, ChevronUp, Type, ImageIcon, Square, HelpCircle, Link2, FileText, Mic, Puzzle, Video, ArrowDownUp, BookOpen, Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Slide, CanvasElementType } from './types';
import { SlidePhase, PHASE_COLORS } from '@/services/slideSkeletonEngine';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InsertAISlideButton } from './InsertAISlideButton';

interface SlideFilmstripProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onAddSlide?: () => void;
  onDeleteSlide?: (id: string) => void;
  onReorderSlides?: (startIndex: number, endIndex: number) => void;
  onImageUploaded?: (slideId: string, imageUrl: string) => void;
  onAddElement?: (type: CanvasElementType) => void;
  onInsertSlide?: (index: number, slide: Slide) => void;
  hub?: string;
  topic?: string;
  canEdit?: boolean;
}

const ELEMENTS: { type: CanvasElementType; icon: React.ElementType; label: string }[] = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'shape', icon: Square, label: 'Shape' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'audio', icon: Mic, label: 'Audio' },
  { type: 'quiz', icon: HelpCircle, label: 'Quiz' },
  { type: 'matching', icon: Link2, label: 'Match' },
  { type: 'fill-blank', icon: FileText, label: 'Fill' },
  { type: 'drag-drop', icon: Puzzle, label: 'Drag' },
  { type: 'sorting', icon: ArrowDownUp, label: 'Sort' },
  { type: 'sentence-builder', icon: BookOpen, label: 'Sentence' },
  { type: 'character', icon: Bird, label: 'Mascot' },
];

export const SlideFilmstrip: React.FC<SlideFilmstripProps> = ({
  slides,
  selectedSlideId,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides,
  onImageUploaded,
  onAddElement,
  onInsertSlide,
  hub = 'playground',
  topic = '',
  canEdit = true,
}) => {
  const { toast } = useToast();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [elementsOpen, setElementsOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderSlides?.(result.source.index, result.destination.index);
  };

  const handleUploadClick = (slideId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRefs.current[slideId]?.click();
  };

  const handleFileChange = async (slideId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const filePath = `${slideId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('lesson-slides').upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
      return;
    }
    const { data: urlData } = supabase.storage.from('lesson-slides').getPublicUrl(filePath);
    onImageUploaded?.(slideId, urlData.publicUrl);
    toast({ title: 'Image uploaded' });
    if (fileInputRefs.current[slideId]) fileInputRefs.current[slideId]!.value = '';
  };

  return (
    <div className="h-full flex flex-col bg-card/50 border-r border-border" style={{ width: 120 }}>
      <ScrollArea className="flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="filmstrip">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-1 space-y-1"
              >
                {slides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          'group relative rounded border transition-all cursor-pointer',
                          selectedSlideId === slide.id
                            ? 'border-primary ring-1 ring-primary/40'
                            : 'border-border hover:border-primary/50',
                          snapshot.isDragging && 'shadow-lg'
                        )}
                        onClick={() => onSelectSlide(slide.id)}
                      >
                        <div className="p-0.5">
                          <div className="flex items-center gap-0.5 mb-0.5">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing text-muted-foreground"
                            >
                              <GripVertical className="h-2.5 w-2.5" />
                            </div>
                            <span className="text-[8px] font-medium text-muted-foreground">{index + 1}</span>
                            {/* Phase badge from skeleton */}
                            {(() => {
                              const phaseKey = (slide as any).phase as SlidePhase | undefined;
                              if (phaseKey && PHASE_COLORS[phaseKey]) {
                                const phaseConfig = PHASE_COLORS[phaseKey];
                                return (
                                  <span className={cn('text-[6px] px-1 py-0 rounded-full font-medium ml-auto leading-tight', phaseConfig.bg, phaseConfig.text)}>
                                    {phaseConfig.label.split(' ')[0]}
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          <div className="aspect-video bg-muted rounded-sm overflow-hidden relative group/thumb">
                            {slide.imageUrl ? (
                              <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[7px] text-muted-foreground/50">Empty</span>
                              </div>
                            )}
                            <button
                              onClick={(e) => handleUploadClick(slide.id, e)}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <Upload className="h-3 w-3 text-white" />
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={(el) => { fileInputRefs.current[slide.id] = el; }}
                              onChange={(e) => handleFileChange(slide.id, e)}
                            />
                          </div>
                        </div>
                        {onDeleteSlide && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); onDeleteSlide(slide.id); }}
                          >
                            <Trash2 className="h-2 w-2 text-destructive" />
                          </Button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ScrollArea>

      {/* Add Slide button */}
        {onAddSlide && (
          <div className="px-1 py-1 border-t border-border">
            <Button onClick={onAddSlide} size="sm" variant="outline" className="w-full h-6 text-[9px] gap-0.5">
              <Plus className="h-2.5 w-2.5" /> Slide
            </Button>
          </div>
        )}

      {/* Merged Element Toolbar */}
      {onAddElement && (
        <Collapsible open={elementsOpen} onOpenChange={setElementsOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-2 py-1 border-t border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider hover:bg-accent/20 transition-colors">
              Elements
              {elementsOpen ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronUp className="h-2.5 w-2.5" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-3 gap-0.5 p-1 border-t border-border">
              {ELEMENTS.map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full flex flex-col gap-0 px-0 hover:bg-primary/10"
                  onClick={() => onAddElement(type)}
                  title={label}
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-[7px] leading-none">{label}</span>
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
