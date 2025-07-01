
import { ContentLibraryItem, AIGeneratedContent } from './types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export class ContentLibraryService {
  private contentLibrary: ContentLibraryItem[] = [];

  constructor() {
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

  private async loadStoredContent(): Promise<void> {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage for development
      try {
        const stored = localStorage.getItem('ai_content_library');
        if (stored) {
          this.contentLibrary = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load stored content:', error);
      }
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In production, you could load from a user-specific content table
      const stored = localStorage.getItem(`ai_content_library_${user.id}`);
      if (stored) {
        this.contentLibrary = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load user content:', error);
    }
  }

  private async saveContentLibrary(): Promise<void> {
    try {
      if (!isSupabaseConfigured()) {
        localStorage.setItem('ai_content_library', JSON.stringify(this.contentLibrary));
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        localStorage.setItem(`ai_content_library_${user.id}`, JSON.stringify(this.contentLibrary));
      }
    } catch (error) {
      console.error('Failed to save content library:', error);
    }
  }

  isProduction(): boolean {
    return isSupabaseConfigured();
  }
}

export const contentLibraryService = new ContentLibraryService();
