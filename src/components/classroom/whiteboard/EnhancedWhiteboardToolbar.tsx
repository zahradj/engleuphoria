
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Pencil, 
  Eraser, 
  Type, 
  Highlighter, 
  Square, 
  Circle,
  Move,
  Palette,
  Undo,
  Redo
} from "lucide-react";

interface EnhancedWhiteboardToolbarProps {
  activeTool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "move";
  setActiveTool: (tool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "move") => void;
  activeShape?: "rectangle" | "circle";
  setActiveShape?: (shape: "rectangle" | "circle") => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
}

export function EnhancedWhiteboardToolbar({
  activeTool,
  setActiveTool,
  activeShape = "rectangle",
  setActiveShape,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth
}: EnhancedWhiteboardToolbarProps) {
  const { languageText } = useLanguage();
  
  const tools = [
    { id: "pencil" as const, icon: Pencil, label: languageText.draw },
    { id: "highlighter" as const, icon: Highlighter, label: "Highlight" },
    { id: "eraser" as const, icon: Eraser, label: languageText.erase },
    { id: "text" as const, icon: Type, label: languageText.text },
    { id: "shape" as const, icon: Square, label: languageText.shapes },
    { id: "move" as const, icon: Move, label: "Move" },
  ];

  const colors = [
    "#000000", // Black
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#9B87F5", // Purple theme
  ];

  return (
    <div className="flex items-center gap-4 p-3 bg-white border-b border-gray-200 overflow-x-auto">
      {/* Drawing Tools */}
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTool(tool.id)}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <tool.icon size={16} />
            <span className="hidden sm:inline">{tool.label}</span>
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Shape Selection */}
      {activeTool === "shape" && setActiveShape && (
        <>
          <div className="flex items-center gap-2">
            <Button
              variant={activeShape === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveShape("rectangle")}
            >
              <Square size={16} />
            </Button>
            <Button
              variant={activeShape === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveShape("circle")}
            >
              <Circle size={16} />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
        </>
      )}

      {/* Stroke Width */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <span className="text-sm text-gray-600 whitespace-nowrap">Size:</span>
        <Slider
          value={[strokeWidth]}
          onValueChange={(value) => setStrokeWidth(value[0])}
          max={20}
          min={1}
          step={1}
          className="w-16"
        />
        <span className="text-xs text-gray-500 w-6">{strokeWidth}</span>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Color Palette */}
      <div className="flex items-center gap-2">
        <Palette size={16} className="text-gray-600" />
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <div
              key={c}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${
                color === c ? "border-gray-400 scale-110" : "border-gray-200 hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <Undo size={16} />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Redo size={16} />
        </Button>
      </div>
    </div>
  );
}
