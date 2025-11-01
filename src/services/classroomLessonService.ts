import { supabase } from "@/integrations/supabase/client";
import { curriculumAssignmentService } from "./curriculumAssignmentService";
import { englishJourneyService } from "./englishJourneyService";

export interface LessonContent {
  id: string;
  title: string;
  topic: string;
  module_number: number;
  lesson_number: number;
  cefr_level: string;
  slides_content: {
    slides: Array<{
      id: string;
      title: string;
      content: string;
      imageUrl?: string;
      notes?: string;
      xpReward?: number;
    }>;
  };
  estimated_duration: number;
  xp_reward: number;
}

export interface LessonProgress {
  id: string;
  student_id: string;
  lesson_content_id: string;
  current_slide_index: number;
  total_slides: number;
  slides_completed: number[];
  xp_earned: number;
  status: 'in_progress' | 'completed' | 'paused';
  started_at: string;
  last_accessed_at: string;
  isResuming?: boolean;
}

class ClassroomLessonService {
  /**
   * Load lesson for a student - either specific lesson or next recommended
   */
  async loadLessonForStudent(studentId: string, lessonContentId?: string): Promise<LessonContent | null> {
    if (lessonContentId) {
      return this.loadLessonContent(lessonContentId);
    }
    return this.getNextRecommendedLesson(studentId);
  }

  /**
   * Get the next recommended lesson for a student based on their progress
   */
  async getNextRecommendedLesson(studentId: string): Promise<LessonContent | null> {
    // 1. Check for in-progress lesson
    const inProgress = await this.getInProgressLesson(studentId);
    if (inProgress) {
      console.log("Resuming in-progress lesson:", inProgress.id);
      return inProgress;
    }

    // 2. Get current curriculum assignment
    const assignment = await curriculumAssignmentService.getCurrentAssignment(studentId);
    if (!assignment) {
      console.log("No curriculum assignment found - needs placement test");
      return null;
    }

    // 3. Get next lesson from curriculum
    const stage = englishJourneyService.getStageById(assignment.stage_id);
    if (!stage) return null;

    const unit = stage.units.find(u => u.id === assignment.unit_id);
    if (!unit || !unit.lessons) return null;

    const nextLesson = unit.lessons[assignment.current_lesson_number - 1];
    if (!nextLesson || !nextLesson.contentId) return null;

    // 4. Load lesson content from database
    return this.loadLessonContent(nextLesson.contentId);
  }

  /**
   * Get in-progress lesson for a student
   */
  async getInProgressLesson(studentId: string): Promise<LessonContent | null> {
    const { data, error } = await supabase
      .from('lesson_progress_tracking')
      .select('lesson_content_id')
      .eq('student_id', studentId)
      .eq('status', 'in_progress')
      .order('last_accessed_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return this.loadLessonContent(data.lesson_content_id);
  }

  /**
   * Load lesson content by ID
   */
  async loadLessonContent(contentId: string): Promise<LessonContent | null> {
    const { data, error } = await supabase
      .from('lessons_content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (error || !data) {
      console.error("Error loading lesson content:", error);
      return null;
    }

    return data as LessonContent;
  }

  /**
   * Load or create progress for a lesson
   */
  async loadLessonProgress(studentId: string, lessonContentId: string): Promise<LessonProgress | null> {
    // Try to get existing progress
    const { data, error } = await supabase
      .from('lesson_progress_tracking')
      .select('*')
      .eq('student_id', studentId)
      .eq('lesson_content_id', lessonContentId)
      .eq('status', 'in_progress')
      .single();

    if (data) {
      return {
        ...data,
        isResuming: data.current_slide_index > 0
      } as LessonProgress;
    }

    // Create new progress record
    const lessonContent = await this.loadLessonContent(lessonContentId);
    if (!lessonContent) return null;

    const totalSlides = lessonContent.slides_content?.slides?.length || 0;

    const { data: newProgress, error: insertError } = await supabase
      .from('lesson_progress_tracking')
      .insert({
        student_id: studentId,
        lesson_content_id: lessonContentId,
        current_slide_index: 0,
        total_slides: totalSlides,
        slides_completed: [],
        xp_earned: 0,
        status: 'in_progress'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating lesson progress:", insertError);
      return null;
    }

    return newProgress as LessonProgress;
  }

  /**
   * Save slide progress
   */
  async saveSlideProgress(
    studentId: string,
    lessonContentId: string,
    slideIndex: number,
    xpEarned: number
  ): Promise<void> {
    const { error } = await supabase
      .from('lesson_progress_tracking')
      .update({
        current_slide_index: slideIndex,
        xp_earned: xpEarned,
        slides_completed: supabase.rpc('array_append', {
          arr: [],
          elem: slideIndex
        })
      })
      .eq('student_id', studentId)
      .eq('lesson_content_id', lessonContentId)
      .eq('status', 'in_progress');

    if (error) {
      console.error("Error saving slide progress:", error);
    }
  }

  /**
   * Complete a lesson
   */
  async completeLesson(
    studentId: string,
    lessonContentId: string,
    totalXP: number,
    metrics?: any
  ): Promise<void> {
    // 1. Update progress tracking status to completed
    const { error: progressError } = await supabase
      .from('lesson_progress_tracking')
      .update({
        status: 'completed',
        xp_earned: totalXP
      })
      .eq('student_id', studentId)
      .eq('lesson_content_id', lessonContentId);

    if (progressError) {
      console.error("Error completing lesson progress:", progressError);
    }

    // 2. Create lesson completion record
    const { error: completionError } = await supabase
      .from('lesson_completions')
      .insert({
        student_id: studentId,
        lesson_content_id: lessonContentId,
        xp_earned: totalXP,
        completion_data: metrics || {}
      });

    if (completionError) {
      console.error("Error creating lesson completion:", completionError);
    }

    // 3. Get lesson info to update curriculum assignment
    const lessonContent = await this.loadLessonContent(lessonContentId);
    if (!lessonContent) return;

    // 4. Update curriculum assignment - advance to next lesson
    const assignment = await curriculumAssignmentService.getCurrentAssignment(studentId);
    if (assignment) {
      await curriculumAssignmentService.updateLessonProgress(studentId, lessonContent.lesson_number);
    }
  }
}

export const classroomLessonService = new ClassroomLessonService();
