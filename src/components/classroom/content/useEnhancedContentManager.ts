
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ContentItem, MaterialType } from "./types";

interface UploadFile {
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'pdf' | 'other';
}

export function useEnhancedContentManager(
  initialContent: ContentItem[], 
  userName: string, 
  isTeacher: boolean
) {
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContent);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    initialContent.length > 0 ? initialContent[0] : null
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ContentItem | null>(null);
  
  const { toast } = useToast();

  const handleEnhancedUpload = useCallback((uploadFiles: UploadFile[]) => {
    const newItems: ContentItem[] = uploadFiles.map(uploadFile => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: uploadFile.type as MaterialType,
      title: uploadFile.file.name,
      source: URL.createObjectURL(uploadFile.file),
      uploadedBy: isTeacher ? "Teacher" : userName,
      timestamp: new Date(),
      size: uploadFile.file.size,
      fileType: uploadFile.file.type
    }));

    setContentItems(prev => [...prev, ...newItems]);
    
    if (newItems.length === 1) {
      setSelectedContent(newItems[0]);
    }

    toast({
      title: "Files uploaded successfully!",
      description: `${newItems.length} file(s) added to your library`
    });
  }, [isTeacher, userName, toast]);

  const handleFileDelete = useCallback((id: string) => {
    const fileToDelete = contentItems.find(item => item.id === id);
    
    if (fileToDelete) {
      if (fileToDelete.source.startsWith('blob:')) {
        URL.revokeObjectURL(fileToDelete.source);
      }
      
      setContentItems(prev => prev.filter(item => item.id !== id));
      
      if (selectedContent?.id === id) {
        const remainingItems = contentItems.filter(item => item.id !== id);
        setSelectedContent(remainingItems.length > 0 ? remainingItems[0] : null);
      }

      toast({
        title: "File deleted",
        description: `${fileToDelete.title} has been removed`
      });
    }
  }, [contentItems, selectedContent, toast]);

  const handleFileDownload = useCallback((file: ContentItem) => {
    try {
      const link = document.createElement('a');
      link.href = file.source;
      link.download = file.title;
      link.target = '_blank';
      
      if (file.source.startsWith('blob:')) {
        link.click();
      } else {
        window.open(file.source, '_blank');
      }

      toast({
        title: "Download started",
        description: `Downloading ${file.title}`
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the file",
        variant: "destructive"
      });
    }
  }, [toast]);

  const openUploadDialog = useCallback(() => {
    setIsUploadDialogOpen(true);
  }, []);

  const closeUploadDialog = useCallback(() => {
    setIsUploadDialogOpen(false);
  }, []);

  const openPreview = useCallback((file: ContentItem) => {
    setPreviewFile(file);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewFile(null);
  }, []);

  return {
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
  };
}
