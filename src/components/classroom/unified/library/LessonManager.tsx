import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LessonRenderer } from './LessonRenderer';
import { LessonCompletionData } from '@/services/lessonRegistry';
import { Maximize2, Minimize2, X } from 'lucide-react';

interface LessonManagerProps {
  isOpen: boolean;
  onClose: () => void;
  moduleNumber: number;
  lessonNumber: number;
  lessonTitle: string;
  studentId: string;
  onComplete?: (data: LessonCompletionData) => void;
  onFullscreen?: (moduleNumber: number, lessonNumber: number) => void;
}

export function LessonManager({
  isOpen,
  onClose,
  moduleNumber,
  lessonNumber,
  lessonTitle,
  studentId,
  onComplete,
  onFullscreen
}: LessonManagerProps) {
  const [progress, setProgress] = useState(0);

  const handleComplete = (data: LessonCompletionData) => {
    onComplete?.(data);
    onClose();
  };

  const handleFullscreen = () => {
    onFullscreen?.(moduleNumber, lessonNumber);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>
              Module {moduleNumber}, Lesson {lessonNumber}: {lessonTitle}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                className="flex items-center gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                Full Screen
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {progress > 0 && (
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <LessonRenderer
            moduleNumber={moduleNumber}
            lessonNumber={lessonNumber}
            studentId={studentId}
            onComplete={handleComplete}
            onProgress={setProgress}
            mode="overlay"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}