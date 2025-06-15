
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
  Move,
  Link
} from "lucide-react";
import { InfiniteWhiteboard } from "@/components/classroom/whiteboard/InfiniteWhiteboard";
import { useWhiteboardState } from "./whiteboard/useWhiteboardState";
import { EmbedLinkDialog } from "./whiteboard/EmbedLinkDialog";
import { validateAndProcessUrl } from "./whiteboard/SafeUrlValidator";
import { useToast } from "@/hooks/use-toast";

interface EmbeddedContent {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EnhancedOneOnOneWhiteboardProps {
  currentUser: {
    role: 'teacher' | 'student';
    name: string;
  };
}

export function EnhancedOneOnOneWhiteboard({ currentUser }: EnhancedOneOnOneWhiteboardProps) {
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "shape" | "pan" | "link">("pencil");
  const [color, setColor] = useState("#2563eb");
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  const [embeddedContent, setEmbeddedContent] = useState<EmbeddedContent[]>([]);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  
  const { clearCanvas } = useWhiteboardState();
  const { toast } = useToast();
  const isTeacher = currentUser.role === 'teacher';

  const tools = [
    { id: "pencil", icon: PenTool, label: "Draw" },
    { id: "eraser", icon: Eraser, label: "Erase" },
    { id: "text", icon: Type, label: "Text" },
    { id: "shape", icon: activeShape === "rectangle" ? Square : Circle, label: "Shape" },
    { id: "link", icon: Link, label: "Embed Link" },
    { id: "pan", icon: Move, label: "Pan" }
  ];

  const colors = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed", "#000000"];

  const handleLinkTool = () => {
    if (!isTeacher) {
      toast({
        title: "Permission Required",
        description: "Only teachers can embed content",
        variant: "destructive"
      });
      return;
    }
    setActiveTool("link");
    setIsLinkDialogOpen(true);
  };

  const handleEmbedContent = () => {
    if (!linkUrl || !linkTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and URL",
        variant: "destructive"
      });
      return;
    }

    const validation = validateAndProcessUrl(linkUrl);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid URL",
        description: validation.warning || "Please provide a valid HTTPS URL",
        variant: "destructive"
      });
      return;
    }

    if (validation.warning && !validation.isTrusted) {
      toast({
        title: "Security Warning",
        description: validation.warning,
      });
    }

    const newContent: EmbeddedContent = {
      id: Date.now().toString(),
      title: linkTitle,
      url: validation.processedUrl,
      x: 100,
      y: 100,
      width: 640,
      height: 480
    };

    setEmbeddedContent(prev => [...prev, newContent]);
    setLinkUrl("");
    setLinkTitle("");
    setIsLinkDialogOpen(false);
    
    toast({
      title: "Content Embedded",
      description: `${linkTitle} has been added to the whiteboard`,
    });
  };

  const removeEmbeddedContent = (id: string) => {
    setEmbeddedContent(prev => prev.filter(content => content.id !== id));
    toast({
      title: "Content Removed",
      description: "The embedded content has been removed",
    });
  };

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
                  onClick={() => tool.id === "link" ? handleLinkTool() : setActiveTool(tool.id as any)}
                  className="flex items-center gap-1"
                  disabled={tool.id === "link" && !isTeacher}
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
        >
          {/* Embedded Content */}
          {embeddedContent.map((content) => (
            <div
              key={content.id}
              className="absolute border border-gray-300 rounded-lg shadow-lg bg-white"
              style={{
                left: content.x,
                top: content.y,
                width: content.width,
                height: content.height,
              }}
            >
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
                <span className="text-sm font-medium truncate">{content.title}</span>
                {isTeacher && (
                  <SoundButton
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmbeddedContent(content.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    soundType="error"
                  >
                    <Trash2 size={12} />
                  </SoundButton>
                )}
              </div>
              <iframe
                src={content.url}
                className="w-full h-full rounded-b-lg"
                style={{ height: content.height - 40 }}
                frameBorder="0"
                allowFullScreen
                onError={() => {
                  toast({
                    title: "Content Blocked",
                    description: "This content cannot be embedded due to security restrictions",
                    variant: "destructive"
                  });
                }}
              />
            </div>
          ))}
        </InfiniteWhiteboard>
      </div>

      {/* Embed Link Dialog */}
      <EmbedLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        url={linkUrl}
        setUrl={setLinkUrl}
        title={linkTitle}
        setTitle={setLinkTitle}
        onEmbed={handleEmbedContent}
      />
    </div>
  );
}
