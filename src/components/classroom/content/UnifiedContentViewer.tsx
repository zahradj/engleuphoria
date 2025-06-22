
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { ContentLibrary } from "./ContentLibrary";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { FilePreviewModal } from "./FilePreviewModal";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { SoundButton } from "@/components/ui/sound-button";
import { Upload, Plus, Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  
  // Embedded link dialog state
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  
  // Initialize with empty content - no default PDF
  const initialContent: any[] = [];
  
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

  const handleEmbedLink = () => {
    if (!embedTitle.trim() || !embedUrl.trim()) return;
    
    // Process the URL to ensure it's properly formatted
    let processedUrl = embedUrl.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    const newContent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'interactive' as const,
      title: embedTitle.trim(),
      source: processedUrl,
      uploadedBy: isTeacher ? "Teacher" : studentName,
      timestamp: new Date(),
      size: 0,
      fileType: 'text/html'
    };

    // Add to content using the enhanced upload handler format
    handleEnhancedUpload([{
      file: new File([''], newContent.title, { type: 'text/html' }),
      type: 'other' as const
    }]);
    
    // Reset form and close dialog
    setEmbedTitle("");
    setEmbedUrl("");
    setIsEmbedDialogOpen(false);
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
        
        <SoundButton
          variant="outline"
          size="sm"
          onClick={() => setIsEmbedDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Link size={16} />
          Embed Link
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
          Enhanced whiteboard with zoom, pan, and improved drawing tools
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
          <TabsTrigger value="whiteboard">Enhanced Whiteboard</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboard" className="flex-1 flex flex-col mt-4 min-h-0">
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
          <div className="flex-1 mt-4 relative min-h-0">
            <EnhancedWhiteboardCanvas
              activeTool={activeTool}
              color={color}
              strokeWidth={strokeWidth}
            />
          </div>
        </TabsContent>

        <TabsContent value="library" className="flex-1 mt-4 min-h-0">
          <ContentLibrary 
            contentItems={contentItems} 
            selectedContent={selectedContent} 
            onSelectContent={setSelectedContent}
            onPreviewFile={openPreview}
            onDeleteFile={isTeacher ? handleFileDelete : undefined}
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
