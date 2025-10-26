import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';

interface DragDropActivityProps {
  items: Array<{ id: string; content: string; correctPosition?: number }>;
  title?: string;
  instructions?: string;
  onComplete?: () => void;
}

export function DragDropActivity({ items, title, instructions, onComplete }: DragDropActivityProps) {
  const [draggedItems, setDraggedItems] = useState(items);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDragStart = (id: string) => {
    soundEffectsService.playButtonClick();
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = draggedItems.findIndex(item => item.id === draggedItem);
    const targetIndex = draggedItems.findIndex(item => item.id === targetId);

    const newItems = [...draggedItems];
    [newItems[draggedIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[draggedIndex]];
    
    setDraggedItems(newItems);
    setDraggedItem(null);
    soundEffectsService.playButtonClick();
  };

  const handleCheck = () => {
    setIsChecking(true);
    const isCorrect = draggedItems.every((item, index) => {
      return item.correctPosition === undefined || item.correctPosition === index;
    });

    if (isCorrect) {
      soundEffectsService.playCorrect();
      setFeedback('correct');
      setShowConfetti(true);
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } else {
      soundEffectsService.playIncorrect();
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setIsChecking(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    soundEffectsService.playButtonClick();
    setDraggedItems(items);
    setFeedback(null);
    setIsChecking(false);
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-6">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            {title}
          </motion.h3>
        )}

        {instructions && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            {instructions}
          </motion.p>
        )}

        <div className="space-y-3">
          {draggedItems.map((item, index) => (
            <motion.div
              key={item.id}
              draggable={!isChecking}
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: !isChecking ? 1.02 : 1 }}
              className={`p-4 rounded-xl border-2 cursor-move transition-all ${
                draggedItem === item.id
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg'
                  : 'border-border bg-card hover:border-purple-300'
              } ${isChecking ? 'cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-base md:text-lg font-medium">{item.content}</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm"
                >
                  {index + 1}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {feedback === 'correct' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center justify-center gap-2 p-4 bg-green-500/20 border-2 border-green-500 rounded-xl"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold text-green-600">Perfect! 🎉</span>
            </motion.div>
          )}

          {feedback === 'incorrect' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center justify-center gap-2 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl"
            >
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-xl font-bold text-red-600">Try again!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 justify-center">
          {!feedback && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              disabled={isChecking}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Check Order
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </motion.button>
        </div>
      </div>
    </>
  );
}
