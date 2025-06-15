
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfiniteWhiteboard } from "@/components/classroom/whiteboard/InfiniteWhiteboard";
import { ContentLibrary } from "./ContentLibrary";
import { MaterialViewer } from "./MaterialViewer";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { FilePreviewModal } from "./FilePreviewModal";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { SoundButton } from "@/components/ui/sound-button";
import { Upload, Plus } from "lucide-react";

interface UnifiedContentViewerProps {
  isTeacher: boolean;
  studentName: string;
}

export function UnifiedContentViewer({ isTeacher, studentName }: UnifiedContentViewerProps) {
  const [activeTab, setActiveTab] = useState("whiteboard");
  
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

  return (
    <div className="h-full flex flex-col">
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
          Drag & drop files directly onto the whiteboard
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
          <TabsTrigger value="material">Lesson Material</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboard" className="flex-1 mt-4">
          <InfiniteWhiteboard
            activeTool="pencil"
            color="#9B87F5"
            onCanvasClick={(e) => console.log("Canvas clicked", e)}
          />
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
      </Tabs>

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
