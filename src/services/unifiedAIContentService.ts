
import { AIContentRequest, AIGeneratedContent, ContentLibraryItem } from './ai/types';
import { aiContentApiService } from './ai/aiContentApiService';
import { contentLibraryService } from './ai/contentLibraryService';
import { contentTemplateService } from './ai/contentTemplateService';

// Re-export types for backward compatibility
export type { AIContentRequest, AIGeneratedContent, ContentLibraryItem };

class UnifiedAIContentService {
  async generateContent(request: AIContentRequest): Promise<AIGeneratedContent> {
    const generatedContent = await aiContentApiService.generateContent(request);
    contentLibraryService.addToLibrary(generatedContent);
    return generatedContent;
  }

  getContentLibrary(): ContentLibraryItem[] {
    return contentLibraryService.getContentLibrary();
  }

  clearLibrary(): void {
    contentLibraryService.clearLibrary();
  }

  exportContent(content: ContentLibraryItem): string {
    return contentLibraryService.exportContent(content);
  }

  isDemoModeActive(): boolean {
    return contentLibraryService.isDemoModeActive();
  }

  getEstimatedGenerationTime(type: string): number {
    return contentTemplateService.getEstimatedGenerationTime(type);
  }
}

export const unifiedAIContentService = new UnifiedAIContentService();
