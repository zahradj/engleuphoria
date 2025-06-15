
import React, { useState } from "react";
import { SoundButton } from "@/components/ui/sound-button";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Trash2, 
  Move
} from "lucide-react";
import { InfiniteWhiteboard } from "@/components/classroom/whiteboard/InfiniteWhiteboard";
import { useWhiteboardState } from "./whiteboard/useWhiteboardState";

interface EnhancedOneOnOneWhiteboardProps {
  currentUser: {
    role: 'teacher' | 'student';
    name: string;
  };
}

export function EnhancedOneOnOneWhiteboard({ currentUser }: EnhancedOneOnOneWhiteboardProps) {
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "shape" | "pan">("pencil");
  const [color, setColor] = useState("#2563eb");
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  
  const { clearCanvas } = useWhiteboardState();
  const isTeacher = currentUser.role === 'teacher';

  const tools = [
    { id: "pencil", icon: PenTool, label: "Draw" },
    { id: "eraser", icon: Eraser, label: "Erase" },
    { id: "text", icon: Type, label: "Text" },
    { id: "shape", icon: activeShape === "rectangle" ? Square : Circle, label: "Shape" },
    { id: "pan", icon: Move, label: "Pan" }
  ];

  const colors = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed", "#000000"];

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Toolbar */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <SoundButton
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool(tool.id as any)}
                  className="flex items-center gap-1"
                >
                  <IconComponent size={16} />
                  <span className="hidden sm:inline text-xs">{tool.label}</span>
                </SoundButton>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <SoundButton
              variant="outline"
              size="sm"
              onClick={clearCanvas}
              soundType="error"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline text-xs ml-1">Clear</span>
            </SoundButton>
          </div>
        </div>
        
        {/* Color Palette */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Colors:</span>
          {colors.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                color === c ? "border-gray-400 scale-110" : "border-gray-200 hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
          
          <Badge variant="secondary" className="ml-4 text-xs">
            {isTeacher ? "Teacher Mode" : "Student Mode"}
          </Badge>
        </div>
      </div>

      {/* Full Width Whiteboard */}
      <div className="flex-1">
        <InfiniteWhiteboard
          activeTool={activeTool}
          color={color}
        />
      </div>
    </div>
  );
}
