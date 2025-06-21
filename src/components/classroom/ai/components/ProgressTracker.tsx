
import React from "react";
import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  isGenerating: boolean;
  generationStep: string;
  generationProgress: number;
  elapsedTime: number;
}

export function ProgressTracker({ 
  isGenerating, 
  generationStep, 
  generationProgress, 
  elapsedTime 
}: ProgressTrackerProps) {
  if (!isGenerating) return null;

  return (
    <div className="px-4 py-2 bg-purple-50 border-b flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-purple-700">{generationStep}</span>
        <div className="flex items-center gap-2 text-xs text-purple-600">
          <Clock size={12} />
          <span>{Math.round(elapsedTime / 1000)}s</span>
        </div>
      </div>
      <Progress value={generationProgress} className="h-2" />
    </div>
  );
}
