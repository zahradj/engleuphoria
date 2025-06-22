
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SoundButton } from "@/components/ui/sound-button";
import { 
  Pencil, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Trash2, 
  Download,
  Highlighter,
  Move,
  Link,
  Palette
} from "lucide-react";

interface EnhancedWhiteboardToolbarProps {
  activeTool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "move";
  setActiveTool: (tool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "move") => void;
  activeShape: "rectangle" | "circle";
  setActiveShape: (shape: "rectangle" | "circle") => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
}

export function EnhancedWhiteboardToolbar({
  activeTool,
  setActiveTool,
  activeShape,
  setActiveShape,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth
}: EnhancedWhiteboardToolbarProps) {
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");

  const colors = [
    "#9B87F5", "#14B8A6", "#F97316", "#FACC15", "#000000", 
    "#EF4444", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"
  ];

  const handleEmbedLink = () => {
    if (!embedTitle.trim() || !embedUrl.trim()) return;
    
    // Process the URL to ensure it's properly formatted
    let processedUrl = embedUrl.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    console.log("Embedding link:", { title: embedTitle, url: processedUrl });
    
    // Reset form and close dialog
    setEmbedTitle("");
    setEmbedUrl("");
    setIsEmbedDialogOpen(false);
  };

  const clearCanvas = () => {
    console.log("Clear canvas functionality");
  };

  const downloadCanvas = () => {
    console.log("Download canvas functionality");
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 bg-white border rounded-lg shadow-sm">
        {/* Main Tools */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("pencil")}
              className="flex items-center gap-1"
            >
              <Pencil size={16} />
              <span className="hidden sm:inline">Draw</span>
            </Button>
            
            <Button
              variant={activeTool === "highlighter" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("highlighter")}
              className="flex items-center gap-1"
            >
              <Highlighter size={16} />
              <span className="hidden sm:inline">Highlight</span>
            </Button>
            
            <Button
              variant={activeTool === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("text")}
              className="flex items-center gap-1"
            >
              <Type size={16} />
              <span className="hidden sm:inline">Text</span>
            </Button>
            
            <Button
              variant={activeTool === "shape" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("shape")}
              className="flex items-center gap-1"
            >
              {activeShape === "rectangle" ? <Square size={16} /> : <Circle size={16} />}
              <span className="hidden sm:inline">Shape</span>
            </Button>
            
            <Button
              variant={activeTool === "move" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("move")}
              className="flex items-center gap-1"
            >
              <Move size={16} />
              <span className="hidden sm:inline">Move</span>
            </Button>
            
            <Button
              variant={activeTool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("eraser")}
              className="flex items-center gap-1"
            >
              <Eraser size={16} />
              <span className="hidden sm:inline">Erase</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEmbedDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Link size={16} />
              <span className="hidden sm:inline">Embed Link</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
              className="flex items-center gap-1"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCanvas}
              className="flex items-center gap-1"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Palette size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">Color:</span>
          </div>
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <div
                key={c}
                className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${
                  color === c ? "border-gray-400 scale-110" : "border-gray-200 hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          
          {/* Stroke Width */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600">Size:</span>
            <div className="w-20">
              <Slider
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                max={10}
                min={1}
                step={1}
                className="cursor-pointer"
              />
            </div>
            <Badge variant="outline" className="text-xs">
              {strokeWidth}px
            </Badge>
          </div>
        </div>

        {/* Shape Options */}
        {activeTool === "shape" && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm text-gray-600">Shape:</span>
            <Button
              variant={activeShape === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveShape("rectangle")}
            >
              <Square size={16} />
              Rectangle
            </Button>
            <Button
              variant={activeShape === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveShape("circle")}
            >
              <Circle size={16} />
              Circle
            </Button>
          </div>
        )}
      </div>

      {/* Embed Link Dialog */}
      <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link size={20} />
              Embed Link to Whiteboard
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="embedTitle">Content Title</Label>
              <Input
                id="embedTitle"
                value={embedTitle}
                onChange={(e) => setEmbedTitle(e.target.value)}
                placeholder="Enter a title for this content..."
              />
            </div>
            
            <div>
              <Label htmlFor="embedUrl">URL</Label>
              <Input
                id="embedUrl"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="Paste URL (YouTube, Google Docs, etc.)..."
                onKeyDown={(e) => e.key === 'Enter' && handleEmbedLink()}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <SoundButton variant="outline" onClick={() => setIsEmbedDialogOpen(false)}>
                Cancel
              </SoundButton>
              <SoundButton 
                onClick={handleEmbedLink}
                disabled={!embedUrl.trim() || !embedTitle.trim()}
                soundType="success"
              >
                Embed Content
              </SoundButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
