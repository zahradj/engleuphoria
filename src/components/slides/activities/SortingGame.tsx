import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Package, ArrowRight } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';
import { useToast } from '@/hooks/use-toast';

interface SortingGameProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

interface SortItem {
  id: string;
  text: string;
  category: string;
}

export function SortingGame({ slide, slideNumber, onNext }: SortingGameProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<SortItem[]>(
    slide.activityData?.items || []
  );
  const [categories] = useState<string[]>(
    slide.activityData?.categories || ['Category A', 'Category B']
  );
  const [sortedItems, setSortedItems] = useState<Record<string, SortItem[]>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {})
  );
  const [showResults, setShowResults] = useState(false);
  const [draggedItem, setDraggedItem] = useState<SortItem | null>(null);

  const handleDragStart = (item: SortItem) => {
    setDraggedItem(item);
    soundEffectsService.playButtonClick();
  };

  const handleDrop = (category: string) => {
    if (!draggedItem) return;

    // Remove from items pool
    setItems(prev => prev.filter(i => i.id !== draggedItem.id));
    
    // Add to category
    setSortedItems(prev => ({
      ...prev,
      [category]: [...prev[category], draggedItem]
    }));

    soundEffectsService.playButtonClick();
    setDraggedItem(null);
  };

  const handleCheck = () => {
    setShowResults(true);
    
    let correctCount = 0;
    let totalCount = 0;

    categories.forEach(category => {
      sortedItems[category].forEach(item => {
        totalCount++;
        if (item.category === category) {
          correctCount++;
        }
      });
    });

    const isAllCorrect = correctCount === totalCount && totalCount > 0;

    if (isAllCorrect) {
      soundEffectsService.playCorrect();
      toast({
        title: "Perfect Sorting! 🎉",
        description: `All ${correctCount} items correctly sorted!`,
      });
    } else {
      soundEffectsService.playIncorrect();
      toast({
        title: "Not quite right! 🤔",
        description: `${correctCount} out of ${totalCount} correct. Try again!`,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setItems(slide.activityData?.items || []);
    setSortedItems(categories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {}));
    setShowResults(false);
    soundEffectsService.playButtonClick();
  };

  return (
    <Card className="border-2 border-blue-500/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-5 w-5 text-blue-500" />
          <div className="text-xs text-muted-foreground font-medium">
            Slide {slideNumber} • 🎯 Sorting Game
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {slide.prompt || 'Sort the Items'}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200"
          >
            <p className="font-medium text-blue-900">🎯 {slide.instructions}</p>
          </motion.div>
        )}

        {/* Items Pool */}
        {items.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Items to Sort:</h3>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className="cursor-move"
                  >
                    <div className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all hover:border-blue-500">
                      <span className="font-medium text-gray-900">{item.text}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Category Boxes */}
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const categoryItems = sortedItems[category] || [];
            
            return (
              <div
                key={category}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(category)}
                className="min-h-[200px] border-3 border-dashed border-blue-300 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50"
              >
                <h3 className="font-bold text-lg mb-3 text-blue-900 flex items-center gap-2">
                  {category}
                  {showResults && categoryItems.length > 0 && (
                    <span className="text-sm">
                      ({categoryItems.filter(item => item.category === category).length}/{categoryItems.length} ✓)
                    </span>
                  )}
                </h3>
                
                <div className="space-y-2">
                  <AnimatePresence>
                    {categoryItems.map((item) => {
                      const isCorrect = item.category === category;
                      
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`p-3 rounded-lg border-2 ${
                            showResults
                              ? isCorrect
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                              : 'bg-white border-blue-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.text}</span>
                            {showResults && (
                              isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-4">
          {!showResults && items.length === 0 && (
            <Button 
              size="lg" 
              onClick={handleCheck}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg px-8"
            >
              Check Answers ✨
            </Button>
          )}
          {showResults && (
            <>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleReset}
                className="border-2"
              >
                Try Again
              </Button>
              {onNext && (
                <Button 
                  size="lg" 
                  onClick={onNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg px-8"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
