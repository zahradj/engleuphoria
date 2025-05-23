
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhiteboardCanvas } from "@/components/classroom/whiteboard/WhiteboardCanvas";
import { WhiteboardToolbar } from "@/components/classroom/whiteboard/WhiteboardToolbar";
import { UploadControls } from "./UploadControls";
import { ContentLibrary } from "./ContentLibrary";
import { MaterialViewer } from "./MaterialViewer";
import { useContentManager } from "./useContentManager";

interface UnifiedContentViewerProps {
  isTeacher: boolean;
  studentName: string;
}

export function UnifiedContentViewer({ isTeacher, studentName }: UnifiedContentViewerProps) {
  const { languageText } = useLanguage();
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape">("pencil");
  const [color, setColor] = useState("#9B87F5");
  
  // Initialize with a sample PDF content
  const initialContent = [{
    id: "1",
    type: "pdf" as const,
    title: "ESL Animals Lesson",
    source: "ESL_Animals_Lesson.pdf",
    uploadedBy: "Ms. Johnson",
    timestamp: new Date()
  }];
  
  const {
    contentItems,
    selectedContent,
    setSelectedContent,
    handleUpload,
    handleEmbedVideo,
    handleAddGame
  } = useContentManager(initialContent, studentName, isTeacher);

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
      <UploadControls
        isTeacher={isTeacher}
        onUpload={handleUpload}
        onEmbedVideo={handleEmbedVideo}
        onAddGame={handleAddGame}
      />

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
          <MaterialViewer selectedContent={selectedContent} />
        </TabsContent>

        <TabsContent value="library" className="flex-1 mt-4">
          <ContentLibrary 
            contentItems={contentItems} 
            selectedContent={selectedContent} 
            onSelectContent={setSelectedContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
