import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropItem, DragDropTarget } from '@/types/slides';
import { VocabularyImage } from '@/components/placement-test/VocabularyImage';

interface DragDropMatchProps {
  items: DragDropItem[];
  targets: DragDropTarget[];
  onComplete: (correct: boolean, attempts: number) => void;
  showFeedback?: boolean;
}

export function DragDropMatch({ items, targets, onComplete, showFeedback = false }: DragDropMatchProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [incorrectPlacements, setIncorrectPlacements] = useState<Set<string>>(new Set());

  const handleDragStart = useCallback((itemId: string) => {
    if (showFeedback) return;
    setDraggedItem(itemId);
  }, [showFeedback]);

  const handleDrop = useCallback((targetId: string) => {
    if (!draggedItem || showFeedback) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const item = items.find(i => i.id === draggedItem);
    const target = targets.find(t => t.id === targetId);
    
    if (item && target) {
      // Check if placement is correct
      const isCorrect = target.acceptsItemIds.includes(item.id);
      
      if (isCorrect) {
        setPlacements(prev => ({ ...prev, [draggedItem]: targetId }));
        setIncorrectPlacements(prev => {
          const newSet = new Set(prev);
          newSet.delete(draggedItem);
          return newSet;
        });
      } else {
        setIncorrectPlacements(prev => new Set([...prev, draggedItem]));
        // Remove from placements if incorrectly placed
        setPlacements(prev => {
          const newPlacements = { ...prev };
          delete newPlacements[draggedItem];
          return newPlacements;
        });
      }
    }

    setDraggedItem(null);

    // Check if all items are correctly placed
    const correctPlacements = Object.keys(placements).length + (item && target && target.acceptsItemIds.includes(item.id) ? 1 : 0);
    if (correctPlacements === items.length) {
      setTimeout(() => onComplete(true, newAttempts), 500);
    }
  }, [draggedItem, attempts, items, targets, placements, onComplete, showFeedback]);

  const getItemsInTarget = (targetId: string) => {
    return Object.entries(placements)
      .filter(([_, tId]) => tId === targetId)
      .map(([itemId, _]) => items.find(item => item.id === itemId))
      .filter(Boolean);
  };

  const unplacedItems = items.filter(item => !placements[item.id]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Unplaced Items */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-center text-text">Drag these items:</h4>
        <div className="flex flex-wrap gap-3 justify-center min-h-[80px] p-4 border-2 border-dashed border-border rounded-lg bg-surface/50">
          {unplacedItems.map((item) => {
            const isIncorrect = incorrectPlacements.has(item.id);
            
            return (
              <Button
                key={item.id}
                variant="outline"
                size="lg"
                draggable={!showFeedback}
                onDragStart={() => handleDragStart(item.id)}
                className={cn(
                  "cursor-grab active:cursor-grabbing hover-scale",
                  "min-h-[60px] px-4 py-2 flex items-center gap-2",
                  "transition-all duration-200",
                  isIncorrect && "bg-error-soft border-error text-error-on animate-pulse",
                  draggedItem === item.id && "opacity-50 scale-95"
                )}
              >
                <GripVertical className="h-4 w-4 text-text-muted" />
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span>{item.text}</span>
                {isIncorrect && (
                  <XCircle className="h-4 w-4 text-error" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Drop Targets */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-center text-text">Drop them here:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {targets.map((target) => {
            const itemsInTarget = getItemsInTarget(target.id);
            
            return (
              <div
                key={target.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(target.id)}
                className={cn(
                  "min-h-[120px] p-4 border-2 border-dashed rounded-lg",
                  "transition-all duration-200",
                  "bg-surface/30 border-border",
                  draggedItem && "border-primary-500 bg-primary-soft",
                  itemsInTarget.length > 0 && "bg-success-soft border-success"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  {target.image && (
                    <img
                      src={target.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <h5 className="font-medium text-text">{target.text}</h5>
                </div>
                
                <div className="space-y-2">
                  {itemsInTarget.map((item) => (
                    <div
                      key={item!.id}
                      className="flex items-center gap-2 p-2 bg-background rounded border border-success"
                    >
                      {item!.image && (
                        <img
                          src={item!.image}
                          alt=""
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span className="flex-1 text-sm">{item!.text}</span>
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {draggedItem && (
        <div className="text-center animate-fade-in">
          <p className="text-text-muted">Drop the item in the correct category</p>
        </div>
      )}
    </div>
  );
}