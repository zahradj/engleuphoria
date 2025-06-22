
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

interface EmbeddedContent {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EnhancedWhiteboardToolbarProps {
  activeTool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "move";
  setActiveTool: (tool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "move") => void;
  activeShape: "rectangle" | "circle";
  setActiveShape: (shape: "rectangle" | "circle") => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onAddEmbeddedContent?: (content: Omit<EmbeddedContent, 'id'>) => void;
}

export function EnhancedWhiteboardToolbar({
  activeTool,
  setActiveTool,
  activeShape,
  setActiveShape,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onAddEmbeddedContent
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
    
    let processedUrl = embedUrl.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    // Process YouTube URLs to embed format
    if (processedUrl.includes('youtube.com/watch?v=')) {
      const videoId = new URL(processedUrl).searchParams.get('v');
      if (videoId) {
        processedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (processedUrl.includes('youtu.be/')) {
      const videoId = processedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        processedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    const newContent = {
      title: embedTitle,
      url: processedUrl,
      x: 50,
      y: 50,
      width: 400,
      height: 300
    };
    
    if (onAddEmbeddedContent) {
      onAddEmbeddedContent(newContent);
    }
    
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
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Compact Main Toolbar */}
        <div className="p-3">
          {/* Top Row - Drawing Tools */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Button
                variant={activeTool === "pencil" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("pencil")}
                className="h-8 px-2"
              >
                <Pencil size={14} />
              </Button>
              
              <Button
                variant={activeTool === "highlighter" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("highlighter")}
                className="h-8 px-2"
              >
                <Highlighter size={14} />
              </Button>
              
              <Button
                variant={activeTool === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("text")}
                className="h-8 px-2"
              >
                <Type size={14} />
              </Button>
              
              <Button
                variant={activeTool === "shape" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("shape")}
                className="h-8 px-2"
              >
                {activeShape === "rectangle" ? <Square size={14} /> : <Circle size={14} />}
              </Button>
              
              <Button
                variant={activeTool === "move" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("move")}
                className="h-8 px-2"
              >
                <Move size={14} />
              </Button>
              
              <Button
                variant={activeTool === "eraser" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("eraser")}
                className="h-8 px-2"
              >
                <Eraser size={14} />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmbedDialogOpen(true)}
                className="h-8 px-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Link size={14} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="h-8 px-2 hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 size={14} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCanvas}
                className="h-8 px-2"
              >
                <Download size={14} />
              </Button>
            </div>
          </div>

          {/* Bottom Row - Color and Size Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Color Palette */}
            <div className="flex items-center gap-2">
              <Palette size={14} className="text-gray-600" />
              <div className="flex items-center gap-1">
                {colors.map((c) => (
                  <div
                    key={c}
                    className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${
                      color === c ? "border-gray-400 scale-110 shadow-md" : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            
            {/* Stroke Width */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-medium">Size:</span>
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
              <Badge variant="outline" className="text-xs min-w-[35px] text-center px-1">
                {strokeWidth}px
              </Badge>
            </div>
          </div>

          {/* Shape Selection (when shape tool is active) */}
          {activeTool === "shape" && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t">
              <span className="text-xs text-gray-600 font-medium">Shape:</span>
              <div className="flex gap-1">
                <Button
                  variant={activeShape === "rectangle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveShape("rectangle")}
                  className="h-7 px-2 text-xs"
                >
                  <Square size={12} className="mr-1" />
                  Rectangle
                </Button>
                <Button
                  variant={activeShape === "circle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveShape("circle")}
                  className="h-7 px-2 text-xs"
                >
                  <Circle size={12} className="mr-1" />
                  Circle
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embed Link Dialog */}
      <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link size={20} />
              Embed Content to Whiteboard
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
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="embedUrl">URL</Label>
              <Input
                id="embedUrl"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="Paste URL (YouTube, Google Docs, etc.)..."
                className="mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleEmbedLink()}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports YouTube, Google Docs, and most embeddable content
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <SoundButton variant="outline" onClick={() => setIsEmbedDialogOpen(false)}>
                Cancel
              </SoundButton>
              <SoundButton 
                onClick={handleEmbedLink}
                disabled={!embedUrl.trim() || !embedTitle.trim()}
                soundType="success"
                className="bg-blue-600 hover:bg-blue-700"
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
