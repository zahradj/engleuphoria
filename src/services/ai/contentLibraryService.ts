
import { ContentLibraryItem, AIGeneratedContent } from './types';
import { supabase } from '@/integrations/supabase/client';
const isSupabaseConfigured = () => true; // Always configured in Engleuphoria deployments

export class ContentLibraryService {
  private contentLibrary: ContentLibraryItem[] = [];

  constructor() {
    // Don't auto-load content on initialization to prevent cache issues
    console.log('📚 ContentLibraryService initialized (no auto-load)');
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
    console.log('➕ Added item to content library:', content.title);
  }

  getContentLibrary(): ContentLibraryItem[] {
    return this.contentLibrary;
  }

  clearLibrary(): void {
    console.log('🧹 Clearing content library cache...');
    this.contentLibrary = [];
    
    // Clear localStorage cache
    try {
      localStorage.removeItem('ai_content_library');
      // Also try to clear user-specific cache if user is authenticated
      if (isSupabaseConfigured()) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            localStorage.removeItem(`ai_content_library_${user.id}`);
            console.log('🗑️ Cleared user-specific content cache');
          }
        });
      }
      console.log('✅ Content library cache cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear content library cache:', error);
    }
  }

  exportContent(content: ContentLibraryItem): string {
    return JSON.stringify(content, null, 2);
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

  // Method to manually load stored content if needed
  async loadStoredContent(): Promise<void> {
    console.log('📖 Loading stored content from cache...');
    
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage for development
      try {
        const stored = localStorage.getItem('ai_content_library');
        if (stored) {
          this.contentLibrary = JSON.parse(stored);
          console.log(`📚 Loaded ${this.contentLibrary.length} items from localStorage`);
        }
      } catch (error) {
        console.error('Failed to load stored content:', error);
      }
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('👤 No authenticated user, skipping cache load');
        return;
      }

      const stored = localStorage.getItem(`ai_content_library_${user.id}`);
      if (stored) {
        this.contentLibrary = JSON.parse(stored);
        console.log(`📚 Loaded ${this.contentLibrary.length} items from user cache`);
      }
    } catch (error) {
      console.error('Failed to load user content:', error);
    }
  }
}

export const contentLibraryService = new ContentLibraryService();
