
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
        {/* Main Toolbar */}
        <div className="p-4 space-y-4">
          {/* Drawing Tools Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant={activeTool === "pencil" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("pencil")}
                className="flex items-center gap-2 h-9"
              >
                <Pencil size={16} />
                <span className="hidden sm:inline">Draw</span>
              </Button>
              
              <Button
                variant={activeTool === "highlighter" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("highlighter")}
                className="flex items-center gap-2 h-9"
              >
                <Highlighter size={16} />
                <span className="hidden sm:inline">Highlight</span>
              </Button>
              
              <Button
                variant={activeTool === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("text")}
                className="flex items-center gap-2 h-9"
              >
                <Type size={16} />
                <span className="hidden sm:inline">Text</span>
              </Button>
              
              <Button
                variant={activeTool === "shape" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("shape")}
                className="flex items-center gap-2 h-9"
              >
                {activeShape === "rectangle" ? <Square size={16} /> : <Circle size={16} />}
                <span className="hidden sm:inline">Shape</span>
              </Button>
              
              <Button
                variant={activeTool === "move" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("move")}
                className="flex items-center gap-2 h-9"
              >
                <Move size={16} />
                <span className="hidden sm:inline">Move</span>
              </Button>
              
              <Button
                variant={activeTool === "eraser" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("eraser")}
                className="flex items-center gap-2 h-9"
              >
                <Eraser size={16} />
                <span className="hidden sm:inline">Erase</span>
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmbedDialogOpen(true)}
                className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Link size={16} />
                <span className="hidden sm:inline">Embed</span>
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Clear</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCanvas}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Color and Size Controls */}
          <div className="flex items-center justify-between gap-6">
            {/* Color Palette */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Palette size={16} className="text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">Color:</span>
              </div>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <div
                    key={c}
                    className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${
                      color === c ? "border-gray-400 scale-110 shadow-md" : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            
            {/* Stroke Width */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Size:</span>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <Slider
                    value={[strokeWidth]}
                    onValueChange={(value) => setStrokeWidth(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
                <Badge variant="outline" className="text-xs min-w-[40px] text-center">
                  {strokeWidth}px
                </Badge>
              </div>
            </div>
          </div>

          {/* Shape Selection (when shape tool is active) */}
          {activeTool === "shape" && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Shape Type:</span>
                <div className="flex gap-2">
                  <Button
                    variant={activeShape === "rectangle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveShape("rectangle")}
                    className="flex items-center gap-2"
                  >
                    <Square size={16} />
                    Rectangle
                  </Button>
                  <Button
                    variant={activeShape === "circle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveShape("circle")}
                    className="flex items-center gap-2"
                  >
                    <Circle size={16} />
                    Circle
                  </Button>
                </div>
              </div>
            </>
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
