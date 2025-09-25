import { ComponentType } from 'react';
import Lesson1Greetings from '@/components/lessons/Lesson1Greetings';

export interface LessonMetadata {
  component?: ComponentType<LessonComponentProps>;
  title: string;
  estimatedDuration: number; // minutes
  xpReward: number;
  completionDetection: 'slides' | 'manual';
  totalSlides?: number;
}

export interface LessonComponentProps {
  onComplete?: (completionData: LessonCompletionData) => void;
  onProgress?: (progress: number) => void;
}

export interface LessonCompletionData {
  moduleNumber: number;
  lessonNumber: number;
  timeSpent: number; // seconds
  completionRate: number; // 0-1
  score?: number;
  slidesCompleted: number;
}

export class LessonRegistry {
  private static lessons: Map<string, LessonMetadata> = new Map([
    ['1-1', {
      component: Lesson1Greetings,
      title: 'Basic Greetings and Introductions',
      estimatedDuration: 30,
      xpReward: 25,
      completionDetection: 'slides',
      totalSlides: 17
    }]
  ]);

  static getLesson(moduleNumber: number, lessonNumber: number): LessonMetadata | null {
    const key = `${moduleNumber}-${lessonNumber}`;
    return this.lessons.get(key) || null;
  }

  static getLessonKey(moduleNumber: number, lessonNumber: number): string {
    return `${moduleNumber}-${lessonNumber}`;
  }

  static hasStaticLesson(moduleNumber: number, lessonNumber: number): boolean {
    return this.lessons.has(this.getLessonKey(moduleNumber, lessonNumber));
  }

  static getAllStaticLessons(): Array<{ key: string; metadata: LessonMetadata }> {
    return Array.from(this.lessons.entries()).map(([key, metadata]) => ({ key, metadata }));
  }
}