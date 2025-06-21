
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Upload, Download } from "lucide-react";

interface LevelActionsProps {
  onStartLearning: () => void;
  onUpload: () => void;
}

export function LevelActions({ onStartLearning, onUpload }: LevelActionsProps) {
  return (
    <div className="flex gap-3 mb-6">
      <Button onClick={onStartLearning} className="flex items-center gap-2">
        <Play size={16} />
        Start Learning Path
      </Button>
      <Button variant="outline" onClick={onUpload} className="flex items-center gap-2">
        <Upload size={16} />
        Upload Material
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Download size={16} />
        Download Resources
      </Button>
    </div>
  );
}
