import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { useLessonAssets } from '@/hooks/useLessonAssets';
import { soundEffectsService } from '@/services/soundEffectsService';
import { useToast } from '@/hooks/use-toast';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';

interface DragDropActivityProps {
  slide: any;
  onNext?: () => void;
}

export function DragDropActivity({ slide, onNext }: DragDropActivityProps) {
  const { toast } = useToast();
  const { generateAudio } = useLessonAssets();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const items = slide.items || [];
  const zones = slide.zones || [];

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
    soundEffectsService.playButtonClick();
  };

  const handleDrop = (zoneId: string) => {
    if (draggedItem) {
      setPlacements({ ...placements, [draggedItem]: zoneId });
      setDraggedItem(null);
      soundEffectsService.playButtonClick();
    }
  };

  const handleCheck = () => {
    setChecked(true);
    let allCorrect = true;

    items.forEach((item: any) => {
      const placedZone = placements[item.id];
      if (placedZone !== item.targetZone) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      soundEffectsService.playCorrect();
      setShowConfetti(true);
      toast({
        title: slide.correctFeedback || "Perfect! 🎉",
        description: "You matched everything correctly!",
      });
    } else {
      soundEffectsService.playIncorrect();
      toast({
        title: slide.incorrectFeedback || "Not quite! 🤔",
        description: "Try again. Some items are in the wrong place.",
        variant: "destructive",
      });
    }
  };

  const handlePlayAudio = async (text: string) => {
    await generateAudio(text);
  };

  const isItemPlaced = (itemId: string) => !!placements[itemId];
  const getItemsInZone = (zoneId: string) => {
    return Object.entries(placements)
      .filter(([_, zone]) => zone === zoneId)
      .map(([itemId]) => items.find((item: any) => item.id === itemId));
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-6">
        {slide.instructions && (
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
            <p className="text-center font-medium">🎯 {slide.instructions}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Draggable Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Items to Match:</h3>
            <div className="space-y-3">
              {items.map((item: any) => {
                const placed = isItemPlaced(item.id);
                const isCorrect = checked && placements[item.id] === item.targetZone;
                const isIncorrect = checked && placements[item.id] && placements[item.id] !== item.targetZone;

                return (
                  <motion.div
                    key={item.id}
                    draggable={!checked}
                    onDragStart={() => handleDragStart(item.id)}
                    whileHover={!checked ? { scale: 1.05 } : {}}
                    className={`p-4 rounded-xl border-2 cursor-move transition-all ${
                      placed
                        ? checked
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/30 opacity-50'
                            : 'border-red-500 bg-red-50 dark:bg-red-950/30'
                          : 'opacity-50 border-dashed'
                        : 'border-primary bg-card hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-semibold">{item.text}</span>
                      {item.audioText && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlayAudio(item.audioText)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      )}
                      {checked && (
                        <div>
                          {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {isIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Drop Zones */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Drop Zones:</h3>
            <div className="space-y-3">
              {zones.map((zone: any) => {
                const itemsHere = getItemsInZone(zone.id);

                return (
                  <div
                    key={zone.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(zone.id)}
                    className="min-h-[100px] p-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    {zone.label && (
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        {zone.label}
                      </div>
                    )}
                    {zone.imagePrompt && (
                      <div className="text-4xl text-center mb-2">
                        {/* Placeholder for image */}
                        🖼️
                      </div>
                    )}
                    <div className="space-y-2">
                      <AnimatePresence>
                        {itemsHere.map((item: any) => (
                          <motion.div
                            key={item.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="p-2 bg-primary/10 rounded-lg text-sm"
                          >
                            {item.text}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          {!checked && Object.keys(placements).length === items.length && (
            <Button size="lg" onClick={handleCheck} className="bg-gradient-to-r from-blue-500 to-purple-500">
              Check Answers ✨
            </Button>
          )}
          {checked && onNext && (
            <Button size="lg" onClick={onNext} className="bg-gradient-to-r from-green-500 to-emerald-500">
              Continue ➡️
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
