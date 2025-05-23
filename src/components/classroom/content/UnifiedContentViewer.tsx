
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Video, Gamepad2, FileText, Image } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhiteboardCanvas } from "@/components/classroom/whiteboard/WhiteboardCanvas";
import { WhiteboardToolbar } from "@/components/classroom/whiteboard/WhiteboardToolbar";
import { MaterialContent } from "@/components/classroom/teaching-material/MaterialContent";

interface ContentItem {
  id: string;
  type: "pdf" | "image" | "video" | "game" | "text";
  title: string;
  source: string;
  uploadedBy: string;
  timestamp: Date;
}

interface UnifiedContentViewerProps {
  isTeacher: boolean;
  studentName: string;
}

export function UnifiedContentViewer({ isTeacher, studentName }: UnifiedContentViewerProps) {
  const { languageText } = useLanguage();
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: "1",
      type: "pdf",
      title: "ESL Animals Lesson",
      source: "ESL_Animals_Lesson.pdf",
      uploadedBy: "Ms. Johnson",
      timestamp: new Date()
    }
  ]);
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape">("pencil");
  const [color, setColor] = useState("#9B87F5");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(contentItems[0]);

  const handleUpload = (type: ContentItem['type']) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newItem: ContentItem = {
          id: Date.now().toString(),
          type,
          title: file.name,
          source: URL.createObjectURL(file),
          uploadedBy: isTeacher ? "Teacher" : studentName,
          timestamp: new Date()
        };
        setContentItems(prev => [...prev, newItem]);
        setSelectedContent(newItem);
        setActiveTab("material");
      }
    };
    
    input.click();
  };

  const handleEmbedVideo = () => {
    const url = prompt("Enter YouTube or video URL:");
    if (url) {
      const newItem: ContentItem = {
        id: Date.now().toString(),
        type: "video",
        title: "Embedded Video",
        source: url,
        uploadedBy: isTeacher ? "Teacher" : studentName,
        timestamp: new Date()
      };
      setContentItems(prev => [...prev, newItem]);
      setSelectedContent(newItem);
      setActiveTab("material");
    }
  };

  const handleAddGame = () => {
    const gameUrl = prompt("Enter game/interactive content URL:");
    if (gameUrl) {
      const newItem: ContentItem = {
        id: Date.now().toString(),
        type: "game",
        title: "Interactive Game",
        source: gameUrl,
        uploadedBy: isTeacher ? "Teacher" : studentName,
        timestamp: new Date()
      };
      setContentItems(prev => [...prev, newItem]);
      setSelectedContent(newItem);
      setActiveTab("material");
    }
  };

  const clearCanvas = () => {
    // Canvas clear logic will be handled by WhiteboardCanvas
    console.log("Clearing canvas");
  };

  const downloadCanvas = () => {
    // Canvas download logic will be handled by WhiteboardCanvas
    console.log("Downloading canvas");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Upload Controls */}
      <Card className="p-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => handleUpload('pdf')}>
            <FileText size={16} className="mr-1" />
            Upload PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleUpload('image')}>
            <Image size={16} className="mr-1" />
            Upload Image
          </Button>
          <Button size="sm" variant="outline" onClick={handleEmbedVideo}>
            <Video size={16} className="mr-1" />
            Embed Video
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddGame}>
            <Gamepad2 size={16} className="mr-1" />
            Add Game
          </Button>
          {isTeacher && (
            <Button size="sm" variant="outline" onClick={() => handleUpload('text')}>
              <Upload size={16} className="mr-1" />
              Upload File
            </Button>
          )}
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
          <TabsTrigger value="material">Lesson Material</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboard" className="flex-1 flex flex-col mt-4">
          <WhiteboardToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            activeShape="rectangle"
            color={color}
            setColor={setColor}
            clearCanvas={clearCanvas}
            downloadCanvas={downloadCanvas}
          />
          <div className="flex-1 mt-4">
            <WhiteboardCanvas
              pageId="main-board"
              activeTool={activeTool}
              color={color}
              isCollaborative={true}
              canvasRef={() => {}}
            />
          </div>
        </TabsContent>

        <TabsContent value="material" className="flex-1 mt-4">
          {selectedContent ? (
            <div className="h-full">
              <div className="mb-2 text-sm text-muted-foreground">
                {selectedContent.title} - uploaded by {selectedContent.uploadedBy}
              </div>
              <div className="h-[calc(100%-2rem)] border rounded-lg overflow-hidden">
                {selectedContent.type === "game" ? (
                  <iframe 
                    src={selectedContent.source}
                    className="w-full h-full border-0"
                    title={selectedContent.title}
                  />
                ) : (
                  <MaterialContent
                    materialType={selectedContent.type === "game" ? "interactive" : selectedContent.type}
                    source={selectedContent.source}
                    currentPage={1}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No content selected. Upload or select content from the library.
            </div>
          )}
        </TabsContent>

        <TabsContent value="library" className="flex-1 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems.map((item) => (
              <Card 
                key={item.id} 
                className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedContent?.id === item.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedContent(item)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.type === 'pdf' && <FileText size={16} />}
                  {item.type === 'image' && <Image size={16} />}
                  {item.type === 'video' && <Video size={16} />}
                  {item.type === 'game' && <Gamepad2 size={16} />}
                  <span className="font-medium truncate">{item.title}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  By {item.uploadedBy} • {item.timestamp.toLocaleDateString()}
                </div>
                <div className="text-xs text-blue-600 mt-1 capitalize">
                  {item.type}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
