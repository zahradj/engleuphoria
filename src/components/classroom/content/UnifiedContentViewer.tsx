
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { ContentLibrary } from "./ContentLibrary";
import { MaterialViewer } from "./MaterialViewer";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { FilePreviewModal } from "./FilePreviewModal";
import { EmbeddedContentManager } from "./EmbeddedContentManager";
import { EmbeddedContentDisplay } from "./EmbeddedContentDisplay";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { SoundButton } from "@/components/ui/sound-button";
import { Upload, Plus } from "lucide-react";

interface EmbeddedContent {
  id: string;
  type: 'youtube' | 'docs' | 'game' | 'website';
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UnifiedContentViewerProps {
  isTeacher: boolean;
  studentName: string;
}

export function UnifiedContentViewer({ isTeacher, studentName }: UnifiedContentViewerProps) {
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape" | "move">("pencil");
  const [color, setColor] = useState("#9B87F5");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  
  // Embedded content state
  const [embeddedContents, setEmbeddedContents] = useState<EmbeddedContent[]>([]);
  
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
    isUploadDialogOpen,
    openUploadDialog,
    closeUploadDialog,
    handleEnhancedUpload,
    previewFile,
    openPreview,
    closePreview,
    handleFileDelete,
    handleFileDownload
  } = useEnhancedContentManager(initialContent, studentName, isTeacher);

  const handleAddEmbeddedContent = (content: Omit<EmbeddedContent, 'id'>) => {
    const newContent: EmbeddedContent = {
      ...content,
      id: Date.now().toString()
    };
    setEmbeddedContents(prev => [...prev, newContent]);
  };

  const handleRemoveEmbeddedContent = (id: string) => {
    setEmbeddedContents(prev => prev.filter(content => content.id !== id));
  };

  const handleUpdateEmbeddedContent = (id: string, updates: Partial<EmbeddedContent>) => {
    setEmbeddedContents(prev => prev.map(content => 
      content.id === id ? { ...content, ...updates } : content
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Upload Controls */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <SoundButton
          variant="outline"
          size="sm"
          onClick={openUploadDialog}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Files
        </SoundButton>
        
        {isTeacher && (
          <SoundButton
            variant="outline"
            size="sm"
            onClick={() => console.log("Add interactive content")}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Content
          </SoundButton>
        )}
        
        <div className="text-xs text-gray-600">
          Enhanced whiteboard with embedded content, zoom, pan, and improved drawing tools
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whiteboard">Enhanced Whiteboard</TabsTrigger>
          <TabsTrigger value="material">Lesson Material</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="embedded">Embedded Content</TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboard" className="flex-1 flex flex-col mt-4">
          <EnhancedWhiteboardToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            activeShape={activeShape}
            setActiveShape={setActiveShape}
            color={color}
            setColor={setColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
          />
          <div className="flex-1 mt-4 relative">
            <EnhancedWhiteboardCanvas
              activeTool={activeTool}
              color={color}
              strokeWidth={strokeWidth}
            >
              {embeddedContents.map((content) => (
                <EmbeddedContentDisplay
                  key={content.id}
                  content={content}
                  onRemove={handleRemoveEmbeddedContent}
                  onUpdate={handleUpdateEmbeddedContent}
                  isTeacher={isTeacher}
                />
              ))}
            </EnhancedWhiteboardCanvas>
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
            onPreviewFile={openPreview}
            onDeleteFile={isTeacher ? handleFileDelete : undefined}
          />
        </TabsContent>

        <TabsContent value="embedded" className="flex-1 mt-4">
          <EmbeddedContentManager
            isTeacher={isTeacher}
            contents={embeddedContents}
            onAddContent={handleAddEmbeddedContent}
            onRemoveContent={handleRemoveEmbeddedContent}
            onUpdateContent={handleUpdateEmbeddedContent}
          />
        </TabsContent>
      </Tabs>

      {/* Enhanced Upload Dialog */}
      <EnhancedUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={closeUploadDialog}
        onUpload={handleEnhancedUpload}
        maxFiles={10}
        maxSizeMB={100}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={closePreview}
        file={previewFile}
        onDelete={isTeacher ? handleFileDelete : undefined}
        onDownload={handleFileDownload}
      />
    </div>
  );
}
