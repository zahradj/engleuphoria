import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slide } from '@/types/slides';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';

interface SentenceBuilderProps {
  slide: Slide;
  onComplete: (isCorrect: boolean) => void;
  selectedOptions: string[];
  onOptionSelect: (optionId: string) => void;
}

export function SentenceBuilder({ 
  slide, 
  onComplete, 
  selectedOptions, 
  onOptionSelect 
}: SentenceBuilderProps) {
  const [draggedWords, setDraggedWords] = React.useState<string[]>([]);
  const [availableWords] = React.useState(
    slide.options?.map(opt => opt.text) || []
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(draggedWords);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDraggedWords(items);
  };

  const addWord = (word: string) => {
    setDraggedWords([...draggedWords, word]);
  };

  const removeWord = (index: number) => {
    const newWords = draggedWords.filter((_, i) => i !== index);
    setDraggedWords(newWords);
  };

  const checkAnswer = () => {
    const userSentence = draggedWords.join(' ');
    const correctSentence = Array.isArray(slide.correct) 
      ? slide.correct.join(' ') 
      : slide.correct || '';
    
    const isCorrect = userSentence.toLowerCase().trim() === 
                     correctSentence.toLowerCase().trim();
    onComplete(isCorrect);
  };

  const resetSentence = () => {
    setDraggedWords([]);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Instructions */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">{slide.prompt}</h3>
        <p className="text-muted-foreground text-sm">
          Drag words to build the correct sentence
        </p>
      </div>

      {/* Sentence Building Area */}
      <Card className="p-4 min-h-[120px] bg-surface-2 border-2 border-dashed border-border">
        <CardContent className="p-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sentence" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "flex flex-wrap gap-2 min-h-[80px] p-4 rounded-lg transition-colors",
                    snapshot.isDraggingOver && "bg-primary/10"
                  )}
                >
                  {draggedWords.map((word, index) => (
                    <Draggable key={`${word}-${index}`} draggableId={`${word}-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "px-3 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm cursor-move user-select-none mobile-touch-target",
                            snapshot.isDragging && "shadow-lg scale-105 rotate-2"
                          )}
                          onClick={() => removeWord(index)}
                        >
                          {word}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {draggedWords.length === 0 && (
                    <div className="text-muted-foreground text-center w-full py-8">
                      Drop words here to build your sentence
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Word Bank */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">Word Bank:</h4>
        <div className="flex flex-wrap gap-2">
          {availableWords.map((word, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => addWord(word)}
              className="mobile-touch-target hover:scale-105 transition-transform"
              disabled={draggedWords.includes(word)}
            >
              {word}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={resetSentence}
          disabled={draggedWords.length === 0}
        >
          Reset
        </Button>
        <Button
          onClick={checkAnswer}
          disabled={draggedWords.length === 0}
          className="bg-success hover:bg-success/90"
        >
          Check Answer
        </Button>
      </div>

      {/* Current Sentence Preview */}
      {draggedWords.length > 0 && (
        <Card className="p-3 bg-accent-soft">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Preview</Badge>
            <p className="text-lg font-medium">
              "{draggedWords.join(' ')}"
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}