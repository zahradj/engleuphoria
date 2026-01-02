import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pencil, 
  Eraser, 
  Type, 
  MousePointer2, 
  Circle,
  Trash2,
  Palette
} from 'lucide-react';
import { CollaborativeCanvas } from '@/components/classroom/shared/CollaborativeCanvas';
import { QuizSlideRenderer } from '@/components/classroom/shared/QuizSlideRenderer';
import { PollSlideRenderer } from '@/components/classroom/shared/PollSlideRenderer';
import { QuizControlPanel } from './QuizControlPanel';
import { PollControlPanel } from './PollControlPanel';
import { QuizResponsesGrid } from './QuizResponsesGrid';
import { PollResultsChart } from '@/components/classroom/shared/PollResultsChart';
import { WhiteboardStroke } from '@/services/whiteboardService';
import { useQuizInteraction } from '@/hooks/useQuizInteraction';
import { usePollInteraction } from '@/hooks/usePollInteraction';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface PollOption {
  id: string;
  text: string;
}

interface Slide {
  id: string;
  title: string;
  content?: React.ReactNode;
  imageUrl?: string;
  type?: string;
  quizQuestion?: string;
  quizOptions?: QuizOption[];
  pollQuestion?: string;
  pollOptions?: PollOption[];
}

interface CenterStageProps {
  slides: Slide[];
  currentSlideIndex: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  activeTool: string;
  onToolChange: (tool: string) => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  strokes: WhiteboardStroke[];
  roomId: string;
  userId: string;
  userName: string;
  sessionId?: string;
  onAddStroke: (stroke: Omit<WhiteboardStroke, 'id' | 'roomId' | 'timestamp'>) => void;
  onClearCanvas: () => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
  '#F38181', '#AA96DA', '#FCBAD3', '#2D4059',
  '#FFFFFF', '#000000'
];

export const CenterStage: React.FC<CenterStageProps> = ({
  slides,
  currentSlideIndex,
  onPrevSlide,
  onNextSlide,
  activeTool,
  onToolChange,
  activeColor,
  onColorChange,
  strokes,
  roomId,
  userId,
  userName,
  sessionId,
  onAddStroke,
  onClearCanvas
}) => {
  const currentSlide = slides[currentSlideIndex];
  const isQuizSlide = currentSlide?.type === 'quiz';
  
  const {
    responses,
    quizActive,
    quizLocked,
    quizRevealAnswer,
    startQuiz,
    lockQuiz,
    revealAnswer,
    resetQuiz
  } = useQuizInteraction({
    sessionId,
    slideId: currentSlide?.id,
    roomId,
    isTeacher: true
  });

  const tools = [
    { id: 'pointer', icon: MousePointer2, label: 'Pointer' },
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'highlighter', icon: Type, label: 'Highlighter' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'laser', icon: Circle, label: 'Laser' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Main Slide Display */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-4xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden">
          {isQuizSlide && currentSlide.quizQuestion && currentSlide.quizOptions ? (
            <QuizSlideRenderer
              question={currentSlide.quizQuestion}
              options={currentSlide.quizOptions}
              selectedOptionId={null}
              showResult={quizRevealAnswer}
              disabled={true}
              onSelectOption={() => {}}
            />
          ) : isPollSlide && currentSlide.pollQuestion && currentSlide.pollOptions ? (
            <PollSlideRenderer
              question={currentSlide.pollQuestion}
              options={currentSlide.pollOptions}
              selectedOptionId={null}
              showResults={pollShowResults}
              disabled={true}
              voteDistribution={voteDistribution}
              onSelectOption={() => {}}
            />
          ) : currentSlide?.imageUrl ? (
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

          {/* Collaborative Canvas Overlay (not for quiz or poll slides) */}
          {!isQuizSlide && !isPollSlide && (
            <CollaborativeCanvas
              roomId={roomId}
              userId={userId}
              userName={userName}
              role="teacher"
              canDraw={activeTool !== 'pointer' && activeTool !== 'laser'}
              activeTool={activeTool as any}
              activeColor={activeColor}
              strokes={strokes}
              onAddStroke={onAddStroke}
            />
          )}
          
          {/* Slide Number Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        </div>

        {/* Quiz Responses Panel */}
        {isQuizSlide && currentSlide.quizOptions && (
          <div className="ml-4 w-72 shrink-0">
            <QuizResponsesGrid
              responses={responses}
              showResults={quizRevealAnswer}
              options={currentSlide.quizOptions.map(o => ({ id: o.id, text: o.text }))}
            />
          </div>
        )}

        {/* Poll Responses Panel */}
        {isPollSlide && currentSlide.pollOptions && (
          <div className="ml-4 w-72 shrink-0 bg-card rounded-xl p-4 border border-border">
            <h3 className="font-semibold mb-3">Live Results</h3>
            <PollResultsChart
              options={currentSlide.pollOptions}
              voteDistribution={voteDistribution}
            />
          </div>
        )}
      </div>

      {/* Quiz Control Panel */}
      {isQuizSlide && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <QuizControlPanel
            quizActive={quizActive}
            quizLocked={quizLocked}
            quizRevealAnswer={quizRevealAnswer}
            responsesCount={responses.length}
            onStartQuiz={startQuiz}
            onLockQuiz={lockQuiz}
            onRevealAnswer={revealAnswer}
            onResetQuiz={resetQuiz}
          />
        </div>
      )}

      {/* Poll Control Panel */}
      {isPollSlide && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <PollControlPanel
            pollActive={pollActive}
            pollShowResults={pollShowResults}
            responsesCount={pollResponses.length}
            onStartPoll={startPoll}
            onToggleResults={toggleResults}
            onClosePoll={closePoll}
            onResetPoll={resetPoll}
          />
        </div>
      )}

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

          {/* Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
                title="Color"
              >
                <div 
                  className="h-5 w-5 rounded-full border-2 border-gray-400"
                  style={{ backgroundColor: activeColor }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-gray-800 border-gray-700">
              <div className="grid grid-cols-5 gap-1">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      activeColor === color 
                        ? 'ring-2 ring-white scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear Canvas */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-gray-400 hover:text-red-400 hover:bg-gray-700"
            onClick={onClearCanvas}
            title="Clear Canvas"
          >
            <Trash2 className="h-5 w-5" />
          </Button>

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
