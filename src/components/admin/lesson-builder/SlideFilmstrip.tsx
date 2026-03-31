import React, { useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Trash2, GripVertical, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Slide } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SlideFilmstripProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onAddSlide: () => void;
  onDeleteSlide: (id: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onImageUploaded?: (slideId: string, imageUrl: string) => void;
}

export const SlideFilmstrip: React.FC<SlideFilmstripProps> = ({
  slides,
  selectedSlideId,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides,
  onImageUploaded,
}) => {
  const { toast } = useToast();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderSlides(result.source.index, result.destination.index);
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
    <div className="h-full flex flex-col bg-card/50 border-r border-border" style={{ width: 140 }}>
      <ScrollArea className="flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="filmstrip">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-1.5 space-y-1.5"
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
                        <div className="p-1">
                          <div className="flex items-center gap-1 mb-0.5">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing text-muted-foreground"
                            >
                              <GripVertical className="h-3 w-3" />
                            </div>
                            <span className="text-[9px] font-medium text-muted-foreground">{index + 1}</span>
                          </div>
                          <div className="aspect-video bg-muted rounded-sm overflow-hidden relative group/thumb">
                            {slide.imageUrl ? (
                              <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[8px] text-muted-foreground/50">Empty</span>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0.5 right-0.5 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); onDeleteSlide(slide.id); }}
                        >
                          <Trash2 className="h-2.5 w-2.5 text-destructive" />
                        </Button>
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
      <div className="p-1.5 border-t border-border">
        <Button onClick={onAddSlide} size="sm" variant="outline" className="w-full h-7 text-[10px] gap-1">
          <Plus className="h-3 w-3" /> Add Slide
        </Button>
      </div>
    </div>
  );
};
