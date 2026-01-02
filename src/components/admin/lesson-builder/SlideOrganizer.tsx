import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Trash2, GripVertical, Image, Video, HelpCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Slide, SlideType } from './types';

interface SlideOrganizerProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onAddSlide: () => void;
  onDeleteSlide: (id: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
}

const slideTypeIcons: Record<SlideType, React.ElementType> = {
  image: Image,
  video: Video,
  quiz: HelpCircle,
  draw: Pencil,
};

export const SlideOrganizer: React.FC<SlideOrganizerProps> = ({
  slides,
  selectedSlideId,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderSlides(result.source.index, result.destination.index);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-3">Slides</h3>
        <Button onClick={onAddSlide} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-2 space-y-2"
              >
                {slides.map((slide, index) => {
                  const TypeIcon = slideTypeIcons[slide.type];
                  return (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "group relative rounded-lg border-2 transition-all cursor-pointer",
                            selectedSlideId === slide.id
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:border-primary/50",
                            snapshot.isDragging && "shadow-lg"
                          )}
                          onClick={() => onSelectSlide(slide.id)}
                        >
                          <div className="p-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">
                                Slide {index + 1}
                              </span>
                              <TypeIcon className="h-3 w-3 text-muted-foreground ml-auto" />
                            </div>

                            {/* Thumbnail */}
                            <div className="aspect-video bg-muted rounded overflow-hidden mb-2">
                              {slide.imageUrl ? (
                                <img
                                  src={slide.imageUrl}
                                  alt={`Slide ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <TypeIcon className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>

                            {slide.title && (
                              <p className="text-xs text-foreground truncate">
                                {slide.title}
                              </p>
                            )}
                          </div>

                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSlide(slide.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ScrollArea>
    </div>
  );
};
