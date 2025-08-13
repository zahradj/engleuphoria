
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { ContentLibrary } from "./ContentLibrary";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { FilePreviewModal } from "./FilePreviewModal";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { SoundButton } from "@/components/ui/sound-button";
import { TeacherAssignmentPanel } from "../assignment/TeacherAssignmentPanel";
import { StudentAssignmentPanel } from "../assignment/StudentAssignmentPanel";
import { Upload, Plus, BookOpen, PenTool, Gamepad2 } from "lucide-react";

interface EmbeddedContent {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fileType?: string;
  originalType?: string;
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
  const [embeddedContent, setEmbeddedContent] = useState<EmbeddedContent[]>([]);
  
  // Debug embedded content changes
  React.useEffect(() => {
    console.log('📋 EmbeddedContent state updated:', embeddedContent);
  }, [embeddedContent]);
  
  const initialContent: any[] = [];
  
  const {
    contentItems,
    selectedContent,
    setSelectedContent,
    isUploadDialogOpen,
    openUploadDialog,
    closeUploadDialog,
    handleEnhancedUpload: originalHandleEnhancedUpload,
    previewFile,
    openPreview,
    closePreview,
    handleFileDelete,
    handleFileDownload
  } = useEnhancedContentManager(initialContent, studentName, isTeacher);

  // Simple upload handler that only adds to content library
  const handleEnhancedUpload = (uploadFiles: any[]) => {
    console.log('🔄 UnifiedContentViewer: handleEnhancedUpload called with files:', uploadFiles);
    
    // Only handle the original upload logic to add files to content library
    originalHandleEnhancedUpload(uploadFiles);
  };

  const handleAddEmbeddedContent = (content: Omit<EmbeddedContent, 'id'>) => {
    const newContent: EmbeddedContent = {
      ...content,
      id: Date.now().toString(),
      width: Math.max(content.width, 1000),
      height: Math.max(content.height, 700),
      x: content.x || 100,
      y: content.y || 100
    };
    setEmbeddedContent(prev => [...prev, newContent]);
  };

  const handleRemoveEmbeddedContent = (id: string) => {
    setEmbeddedContent(prev => prev.filter(content => content.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between p-2 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <PenTool size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Interactive Learning Space</h2>
              <p className="text-xs text-gray-600">Enhanced whiteboard with assignment system</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <SoundButton
            variant="outline"
            size="sm"
            onClick={openUploadDialog}
            className="flex items-center gap-1 bg-white hover:bg-blue-50 h-7 px-2 text-xs"
          >
            <Upload size={12} />
            Upload
          </SoundButton>
          
          {isTeacher && (
            <SoundButton
              variant="outline"
              size="sm"
              onClick={() => console.log("Add interactive content")}
              className="flex items-center gap-1 bg-white hover:bg-green-50 h-7 px-2 text-xs"
            >
              <Plus size={12} />
              Add
            </SoundButton>
          )}
        </div>
      </div>

      <div className="flex-1 p-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-1 bg-white/80 backdrop-blur-sm h-8">
            <TabsTrigger value="whiteboard" className="flex items-center gap-1 text-xs">
              <PenTool size={12} />
              Whiteboard
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-1 text-xs">
              <Gamepad2 size={12} />
              {isTeacher ? "Create Assignments" : "My Assignments"}
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-1 text-xs">
              <BookOpen size={12} />
              Content Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whiteboard" className="flex-1 flex flex-col space-y-1 min-h-0">
            <div className="flex-shrink-0">
              <EnhancedWhiteboardToolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                activeShape={activeShape}
                setActiveShape={setActiveShape}
                color={color}
                setColor={setColor}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
                onAddEmbeddedContent={handleAddEmbeddedContent}
              />
            </div>
            <div className="flex-1 min-h-0" style={{ minHeight: '600px' }}>
              <EnhancedWhiteboardCanvas
                activeTool={activeTool}
                color={color}
                strokeWidth={strokeWidth}
                embeddedContent={embeddedContent}
                onRemoveEmbeddedContent={handleRemoveEmbeddedContent}
              />
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="flex-1 min-h-0">
            <div className="h-full bg-white rounded-lg border shadow-sm">
              {isTeacher ? (
                <TeacherAssignmentPanel />
              ) : (
                <StudentAssignmentPanel studentName={studentName} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="library" className="flex-1 min-h-0">
            <div className="h-full bg-white rounded-lg border shadow-sm">
              <ContentLibrary 
                contentItems={contentItems} 
                selectedContent={selectedContent} 
                onSelectContent={setSelectedContent}
                onPreviewFile={openPreview}
                onDeleteFile={isTeacher ? handleFileDelete : undefined}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EnhancedUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={closeUploadDialog}
        onUpload={handleEnhancedUpload}
        maxFiles={10}
        maxSizeMB={100}
      />

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
