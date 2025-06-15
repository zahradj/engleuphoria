
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SoundButton } from "@/components/ui/sound-button";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Trash2, 
  BookOpen,
  ExternalLink,
  Settings,
  Move
} from "lucide-react";
import { InfiniteWhiteboard } from "@/components/classroom/whiteboard/InfiniteWhiteboard";
import { DictionaryTaskPanel } from "@/components/classroom/dictionary/DictionaryTaskPanel";
import { EmbeddedContentManager } from "@/components/classroom/content/EmbeddedContentManager";
import { SoundSettings } from "@/components/classroom/settings/SoundSettings";
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
  const [embeddedContents, setEmbeddedContents] = useState<any[]>([]);
  
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

  const handleAddContent = (content: any) => {
    const newContent = { ...content, id: Date.now().toString() };
    setEmbeddedContents(prev => [...prev, newContent]);
  };

  const handleRemoveContent = (id: string) => {
    setEmbeddedContents(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateContent = (id: string, updates: any) => {
    setEmbeddedContents(prev => 
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    );
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

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-4 gap-4">
        {/* Whiteboard - Takes most space */}
        <div className="col-span-3">
          <InfiniteWhiteboard
            activeTool={activeTool}
            color={color}
          >
            {/* Render embedded content */}
            {embeddedContents.map((content) => (
              <div
                key={content.id}
                className="absolute border-2 border-blue-300 rounded-lg overflow-hidden bg-white shadow-lg"
                style={{
                  left: content.x,
                  top: content.y,
                  width: content.width,
                  height: content.height
                }}
              >
                <div className="h-8 bg-gray-100 flex items-center justify-between px-2 border-b">
                  <span className="text-xs font-medium truncate">{content.title}</span>
                  {isTeacher && (
                    <SoundButton
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveContent(content.id)}
                      soundType="error"
                    >
                      <Trash2 size={12} />
                    </SoundButton>
                  )}
                </div>
                <iframe
                  src={content.url}
                  className="w-full h-[calc(100%-2rem)]"
                  frameBorder="0"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            ))}
          </InfiniteWhiteboard>
        </div>

        {/* Side Panel - Tools and Features */}
        <div className="col-span-1">
          <Tabs defaultValue="dictionary" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dictionary" className="text-xs">
                <BookOpen size={14} className="mr-1" />
                Dict
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs">
                <ExternalLink size={14} className="mr-1" />
                Links
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings size={14} className="mr-1" />
                Audio
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 min-h-0">
              <TabsContent value="dictionary" className="h-full m-0">
                <DictionaryTaskPanel isTeacher={isTeacher} />
              </TabsContent>
              
              <TabsContent value="content" className="h-full m-0">
                <EmbeddedContentManager
                  isTeacher={isTeacher}
                  contents={embeddedContents}
                  onAddContent={handleAddContent}
                  onRemoveContent={handleRemoveContent}
                  onUpdateContent={handleUpdateContent}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="h-full m-0">
                <SoundSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
