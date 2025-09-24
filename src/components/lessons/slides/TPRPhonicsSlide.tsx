import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface TPRPhonicsSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function TPRPhonicsSlide({ slide, onComplete, onNext }: TPRPhonicsSlideProps) {
  const [droppedItems, setDroppedItems] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = () => {
    if (draggedItem && !droppedItems.includes(draggedItem)) {
      setDroppedItems(prev => [...prev, draggedItem]);
      setDraggedItem(null);
      
      // Check if all items are placed
      if (slide.dragDropItems && droppedItems.length === slide.dragDropItems.length - 1) {
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
          <h3 className="text-xl font-semibold mb-4 text-center">Letter A Words:</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {slide.dragDropItems?.map((item) => (
              <motion.div
                key={item.id}
                drag
                dragElastic={0.2}
                whileDrag={{ scale: 1.1 }}
                className={`cursor-grab ${
                  droppedItems.includes(item.id) ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={() => handleDragStart(item.id)}
              >
                <Card className="bg-white border-2 border-primary/20">
                  <CardContent className="p-4 text-center">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.text}
                        className="w-20 h-20 mx-auto mb-2 rounded-lg object-cover"
                      />
                    )}
                    <span className="font-semibold text-lg">{item.text}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drop Target */}
        <div className="flex justify-center">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="min-h-48 w-80"
          >
            <Card className={`h-full border-4 border-dashed transition-colors ${
              droppedItems.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}>
              <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                <div className="text-6xl mb-4">🧺</div>
                <h4 className="text-2xl font-bold mb-2 text-primary">Aa Basket</h4>
                <p className="text-muted-foreground mb-4">Drop A words here</p>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {droppedItems.map((itemId) => {
                    const item = slide.dragDropItems?.find(i => i.id === itemId);
                    return (
                      <div key={itemId} className="bg-primary text-primary-foreground p-2 rounded">
                        {item?.text}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {droppedItems.length === slide.dragDropItems?.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <div className="text-2xl font-bold text-green-600 mb-2">
              🎉 Amazing! You found all the A words!
            </div>
            <div className="text-lg text-muted-foreground">
              Apple, Ant - they all start with the letter A!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}