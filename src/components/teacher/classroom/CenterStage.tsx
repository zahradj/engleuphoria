import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pencil, 
  Eraser, 
  Type, 
  MousePointer2, 
  Circle 
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  content?: React.ReactNode;
  imageUrl?: string;
}

interface CenterStageProps {
  slides: Slide[];
  currentSlideIndex: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const CenterStage: React.FC<CenterStageProps> = ({
  slides,
  currentSlideIndex,
  onPrevSlide,
  onNextSlide,
  activeTool,
  onToolChange
}) => {
  const currentSlide = slides[currentSlideIndex];
  const tools = [
    { id: 'pointer', icon: MousePointer2, label: 'Pointer' },
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'laser', icon: Circle, label: 'Laser' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Main Slide Display */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-4xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden">
          {currentSlide?.imageUrl ? (
            <img 
              src={currentSlide.imageUrl} 
              alt={currentSlide.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {currentSlide?.title || 'Slide ' + (currentSlideIndex + 1)}
                </h2>
                {currentSlide?.content && (
                  <div className="text-gray-600 text-lg">
                    {currentSlide.content}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Slide Number Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevSlide}
        disabled={currentSlideIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white disabled:opacity-30"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextSlide}
        disabled={currentSlideIndex === slides.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white disabled:opacity-30"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1 bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-2 shadow-xl border border-gray-700">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full ${
                activeTool === tool.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-5 w-5" />
            </Button>
          ))}
          <div className="h-6 w-px bg-gray-600 mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevSlide}
            disabled={currentSlideIndex === 0}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
