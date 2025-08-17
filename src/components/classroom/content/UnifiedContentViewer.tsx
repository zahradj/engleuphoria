
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { EnhancedContentLibrary } from "./EnhancedContentLibrary";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { FilePreviewModal } from "./FilePreviewModal";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { ContentItem } from "./types";
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
  currentUser?: {
    id: string;
    role: 'teacher' | 'student';
    name: string;
  };
}

export function UnifiedContentViewer({ isTeacher, studentName, currentUser }: UnifiedContentViewerProps) {
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

  const handleAddContentToWhiteboard = (item: ContentItem) => {
    console.log('🎯 Adding content to whiteboard:', item);
    
    let contentUrl = item.source;
    
    // Handle curriculum/lesson content by generating HTML
    const isCurriculumContent = item.type === 'curriculum' || item.type === 'lesson' || item.type === 'bulk-curriculum';
    
    if (isCurriculumContent) {
      const html = `
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
          <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">${item.title}</h1>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #475569;">Lesson Overview</h2>
            <p><strong>CEFR Level:</strong> ${item.level || 'B1'}</p>
            <p><strong>Duration:</strong> ${item.duration || item.metadata?.estimated_duration || 45} minutes</p>
            <p><strong>Theme:</strong> ${item.topic || item.theme || 'General English'}</p>
            <p><strong>Difficulty:</strong> ${item.difficulty || item.metadata?.difficulty_level || 'Intermediate'}</p>
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #475569;">Learning Objectives</h2>
            <ul>
              ${(item.metadata?.learning_objectives || [
                'Develop vocabulary and language skills',
                'Practice communication in English',
                'Build confidence in language use',
                'Apply new knowledge in practical contexts'
              ]).map((obj: string) => `<li style="margin: 5px 0;">${obj}</li>`).join('')}
            </ul>
          </div>

          ${item.content ? `
            <div style="margin: 20px 0;">
              <h2 style="color: #475569;">Lesson Content</h2>
              <div style="background: white; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px;">
                ${item.content}
              </div>
            </div>
          ` : ''}

          ${(item.metadata?.activities && item.metadata.activities.length > 0) ? `
            <div style="margin: 20px 0;">
              <h2 style="color: #475569;">Activities</h2>
              ${item.metadata.activities.map((activity: any, index: number) => `
                <div style="background: #f1f5f9; padding: 15px; margin: 10px 0; border-radius: 8px;">
                  <h3 style="color: #334155;">Activity ${index + 1}: ${activity.title || 'Practice Exercise'}</h3>
                  <p>${activity.description || activity.content || 'Interactive learning activity'}</p>
                  ${activity.duration ? `<p><em>Duration: ${activity.duration} minutes</em></p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
      
      const blob = new Blob([html], { type: 'text/html' });
      contentUrl = URL.createObjectURL(blob);
    }
    
    const newContent: EmbeddedContent = {
      id: Date.now().toString(),
      title: item.title,
      url: contentUrl,
      x: 100,
      y: 100,
      width: 800,
      height: 600,
      fileType: isCurriculumContent ? 'text/html' : item.fileType,
      originalType: item.type
    };
    
    console.log('✅ Created embedded content:', newContent);
    setEmbeddedContent(prev => [...prev, newContent]);
    
    // Switch to whiteboard tab
    setActiveTab('whiteboard');
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
              <EnhancedContentLibrary 
                contentItems={contentItems} 
                selectedContent={selectedContent} 
                onSelectContent={setSelectedContent}
                onPreviewFile={openPreview}
                onDeleteFile={isTeacher ? handleFileDelete : undefined}
                onAddToWhiteboard={handleAddContentToWhiteboard}
                currentUser={currentUser || {
                  id: 'default',
                  role: isTeacher ? 'teacher' : 'student',
                  name: studentName
                }}
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
