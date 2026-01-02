import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  thumbnailUrl?: string;
}

interface SlideNavigatorProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
  lessonTitle: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SlideNavigator: React.FC<SlideNavigatorProps> = ({
  slides,
  currentSlideIndex,
  onSlideSelect,
  lessonTitle,
  isCollapsed,
  onToggleCollapse
}) => {
  if (isCollapsed) {
    return (
      <div className="w-10 bg-gray-900 border-l border-gray-800 flex flex-col items-center py-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white mb-4"
          onClick={onToggleCollapse}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">
            {currentSlideIndex + 1}/{slides.length}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-52 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{lessonTitle}</h3>
          <p className="text-xs text-gray-500">{slides.length} slides</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-white shrink-0"
          onClick={onToggleCollapse}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Thumbnails */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onSlideSelect(index)}
              className={`w-full aspect-[16/9] rounded-lg overflow-hidden relative transition-all ${
                index === currentSlideIndex
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-gray-900'
                  : 'hover:ring-1 hover:ring-gray-600'
              }`}
            >
              {slide.thumbnailUrl ? (
                <img
                  src={slide.thumbnailUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {index + 1}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                <span className="text-[10px] text-white truncate block">
                  {slide.title || `Slide ${index + 1}`}
                </span>
              </div>
              <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
