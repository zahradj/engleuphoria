/**
 * Lesson Analytics Service
 * Tracks teacher interactions with external lessons
 */

export interface LessonAnalyticsEvent {
  eventName: string;
  lessonId: string;
  lessonTitle?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class LessonAnalyticsService {
  private events: LessonAnalyticsEvent[] = [];

  /**
   * Track a lesson-related event
   */
  trackEvent(
    eventName: string,
    lessonId: string,
    lessonTitle?: string,
    metadata?: Record<string, any>
  ): void {
    const event: LessonAnalyticsEvent = {
      eventName,
      lessonId,
      lessonTitle,
      timestamp: new Date(),
      metadata
    };

    this.events.push(event);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Lesson Analytics:', event);
    }

    // Store in localStorage for persistence
    this.persistEvent(event);
  }

  /**
   * Track when a teacher previews a lesson
   */
  trackLessonPreview(lessonId: string, lessonTitle: string, lessonUrl: string): void {
    this.trackEvent('lesson_preview_clicked', lessonId, lessonTitle, {
      url: lessonUrl,
      action: 'preview'
    });
  }

  /**
   * Track when import dialog is opened
   */
  trackImportDialogOpened(lessonId: string, lessonTitle: string): void {
    this.trackEvent('lesson_import_dialog_opened', lessonId, lessonTitle, {
      action: 'import_dialog'
    });
  }

  /**
   * Track when lesson URL is copied
   */
  trackUrlCopied(lessonId: string, lessonTitle: string): void {
    this.trackEvent('lesson_url_copied', lessonId, lessonTitle, {
      action: 'copy_url'
    });
  }

  /**
   * Track when lesson is opened in external tab
   */
  trackLessonOpened(lessonId: string, lessonTitle: string, lessonUrl: string): void {
    this.trackEvent('lesson_opened_external', lessonId, lessonTitle, {
      url: lessonUrl,
      action: 'open_external'
    });
  }

  /**
   * Get all tracked events
   */
  getEvents(): LessonAnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Get events for a specific lesson
   */
  getEventsByLesson(lessonId: string): LessonAnalyticsEvent[] {
    return this.events.filter(event => event.lessonId === lessonId);
  }

  /**
   * Get event count by type
   */
  getEventCountByType(eventName: string): number {
    return this.events.filter(event => event.eventName === eventName).length;
  }

  /**
   * Get most popular lessons
   */
  getMostPopularLessons(limit: number = 5): Array<{ lessonId: string; lessonTitle: string; count: number }> {
    const lessonCounts = new Map<string, { title: string; count: number }>();

    this.events.forEach(event => {
      const current = lessonCounts.get(event.lessonId) || { title: event.lessonTitle || '', count: 0 };
      current.count++;
      lessonCounts.set(event.lessonId, current);
    });

    return Array.from(lessonCounts.entries())
      .map(([lessonId, data]) => ({
        lessonId,
        lessonTitle: data.title,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Persist event to localStorage
   */
  private persistEvent(event: LessonAnalyticsEvent): void {
    try {
      const stored = localStorage.getItem('lesson_analytics');
      const events: LessonAnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      events.push(event);
      
      // Keep only last 100 events to avoid localStorage bloat
      const recentEvents = events.slice(-100);
      localStorage.setItem('lesson_analytics', JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to persist analytics event:', error);
    }
  }

  /**
   * Load events from localStorage
   */
  loadPersistedEvents(): void {
    try {
      const stored = localStorage.getItem('lesson_analytics');
      if (stored) {
        const events: LessonAnalyticsEvent[] = JSON.parse(stored);
        this.events = events.map(e => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
    }
  }

  /**
   * Clear all analytics data
   */
  clearAnalytics(): void {
    this.events = [];
    try {
      localStorage.removeItem('lesson_analytics');
    } catch (error) {
      console.error('Failed to clear analytics:', error);
    }
  }
}

// Export singleton instance
export const lessonAnalytics = new LessonAnalyticsService();

// Load persisted events on initialization
lessonAnalytics.loadPersistedEvents();
