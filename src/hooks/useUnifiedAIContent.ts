
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { unifiedAIContentService } from '@/services/unifiedAIContentService';
import type { AIContentRequest, AIGeneratedContent, ContentLibraryItem } from '@/services/ai/types';

export const useUnifiedAIContent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentLibrary, setContentLibrary] = useState<ContentLibraryItem[]>(
    unifiedAIContentService.getContentLibrary()
  );
  const { toast } = useToast();

  const generateContent = async (request: AIContentRequest): Promise<AIGeneratedContent | null> => {
    setIsGenerating(true);
    
    try {
      const generatedContent = await unifiedAIContentService.generateContent(request);
      
      // Update library state
      setContentLibrary(unifiedAIContentService.getContentLibrary());
      
      const isDemoMode = unifiedAIContentService.isDemoModeActive();
      
      toast({
        title: `🤖 Content Generated!`,
        description: `Your ${request.type.replace('_', ' ')} is ready to use${isDemoMode ? ' (demo mode)' : ''}.`,
      });

      return generatedContent;
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearContentLibrary = () => {
    unifiedAIContentService.clearLibrary();
    setContentLibrary([]);
    toast({
      title: "Library Cleared",
      description: "All generated content has been removed.",
    });
  };

  const exportContent = (content: ContentLibraryItem) => {
    try {
      const dataStr = unifiedAIContentService.exportContent(content);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Content Exported",
        description: `${content.title} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export content.",
        variant: "destructive"
      });
    }
  };

  const isDemoMode = unifiedAIContentService.isDemoModeActive();

  return {
    isGenerating,
    contentLibrary,
    generateContent,
    clearContentLibrary,
    exportContent,
    isDemoMode
  };
};
