import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface DragDropSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function DragDropSlide({ slide, onComplete, onNext }: DragDropSlideProps) {
  const [droppedItems, setDroppedItems] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = (targetId: string) => {
    if (draggedItem) {
      setDroppedItems(prev => ({ ...prev, [targetId]: draggedItem }));
      setDraggedItem(null);
      
      // Check if all items are placed
      if (slide.dragDropTargets && Object.keys(droppedItems).length === slide.dragDropTargets.length - 1) {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Draggable Items */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Drag these words:</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {slide.dragDropItems?.map((item) => (
              <motion.div
                key={item.id}
                drag
                dragElastic={0.2}
                whileDrag={{ scale: 1.1 }}
                className={`cursor-grab ${
                  Object.values(droppedItems).includes(item.id) ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={() => handleDragStart(item.id)}
              >
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-4">
                    <span className="font-semibold">{item.text}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drop Targets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slide.dragDropTargets?.map((target) => (
            <div
              key={target.id}
              onDrop={() => handleDrop(target.id)}
              onDragOver={handleDragOver}
              className="min-h-32"
            >
              <Card className={`h-full border-2 border-dashed transition-colors ${
                droppedItems[target.id] ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}>
                <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                  <h4 className="font-semibold mb-2">{target.text}</h4>
                  {droppedItems[target.id] && (
                    <div className="bg-primary text-primary-foreground p-2 rounded">
                      {slide.dragDropItems?.find(item => item.id === droppedItems[target.id])?.text}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {Object.keys(droppedItems).length === slide.dragDropTargets?.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <div className="text-lg font-semibold text-green-600">
              🎉 Great job! You matched all the greetings!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}