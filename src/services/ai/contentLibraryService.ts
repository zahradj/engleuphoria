
import { ContentLibraryItem, AIGeneratedContent } from './types';
import { isSupabaseConfigured } from '@/lib/supabase';

export class ContentLibraryService {
  private contentLibrary: ContentLibraryItem[] = [];
  private isDemoMode: boolean;

  constructor() {
    this.isDemoMode = !isSupabaseConfigured();
    this.loadStoredContent();
  }

  addToLibrary(content: AIGeneratedContent): void {
    const libraryItem: ContentLibraryItem = {
      ...content,
      downloads: 0,
      rating: 0,
      tags: [content.topic, content.level, content.type],
      isPublic: false,
      createdBy: 'ai'
    };

    this.contentLibrary.unshift(libraryItem);
    this.saveContentLibrary();
  }

  getContentLibrary(): ContentLibraryItem[] {
    return this.contentLibrary;
  }

  clearLibrary(): void {
    this.contentLibrary = [];
    this.saveContentLibrary();
  }

  exportContent(content: ContentLibraryItem): string {
    return JSON.stringify(content, null, 2);
  }

  private loadStoredContent(): void {
    if (this.isDemoMode) {
      try {
        const stored = localStorage.getItem('ai_content_library');
        if (stored) {
          this.contentLibrary = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load stored content:', error);
      }
    }
  }

  private saveContentLibrary(): void {
    if (this.isDemoMode) {
      try {
        localStorage.setItem('ai_content_library', JSON.stringify(this.contentLibrary));
      } catch (error) {
        console.error('Failed to save content library:', error);
      }
    }
  }

  isDemoModeActive(): boolean {
    return this.isDemoMode;
  }
}

export const contentLibraryService = new ContentLibraryService();
