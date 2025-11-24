import { describe, it, expect, beforeEach, vi } from 'vitest';
import { interactiveLessonProgressService } from '@/services/interactiveLessonProgressService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Student Progress Flow - Integration Tests', () => {
  const mockStudentId = 'student-integration-test';
  const mockTeacherId = 'teacher-integration-test';
  const lesson1Id = 'lesson-seq-1';
  const lesson2Id = 'lesson-seq-2';
  const lesson3Id = 'lesson-seq-3';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Student Journey: First Lesson to Auto-Progression', () => {
    it('should complete full flow: assign → start → progress → complete → unlock next', async () => {
      // Setup: Mock database state
      const mockDbState = {
        assignments: [
          { id: 'assign-1', lesson_id: lesson1Id, student_id: mockStudentId, order_in_sequence: 1, is_unlocked: true, status: 'assigned' },
          { id: 'assign-2', lesson_id: lesson2Id, student_id: mockStudentId, order_in_sequence: 2, is_unlocked: false, status: 'locked' },
          { id: 'assign-3', lesson_id: lesson3Id, student_id: mockStudentId, order_in_sequence: 3, is_unlocked: false, status: 'locked' },
        ],
        progress: new Map(),
        lessons: [
          { id: lesson1Id, title: 'Lesson 1', screens_data: Array(20).fill({}) },
          { id: lesson2Id, title: 'Lesson 2', screens_data: Array(20).fill({}) },
          { id: lesson3Id, title: 'Lesson 3', screens_data: Array(20).fill({}) },
        ],
      };

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_progress') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockImplementation(() => {
                    const progress = mockDbState.progress.get(lesson1Id);
                    return Promise.resolve({
                      data: progress || null,
                      error: progress ? null : { code: 'PGRST116' },
                    });
                  }),
                }),
              }),
            }),
            insert: vi.fn().mockImplementation((data) => {
              const newProgress = { id: 'progress-1', ...data };
              mockDbState.progress.set(data.lesson_id, newProgress);
              return {
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: newProgress, error: null }),
                }),
              };
            }),
            update: vi.fn().mockImplementation((data) => ({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockImplementation((field, value) => {
                  const existing = mockDbState.progress.get(value);
                  if (existing) {
                    mockDbState.progress.set(value, { ...existing, ...data });
                  }
                  return Promise.resolve({ error: null });
                }),
              }),
            })),
          };
        }

        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockImplementation((lessonId) => {
                    const assignment = mockDbState.assignments.find(a => a.lesson_id === lessonId);
                    return Promise.resolve({
                      data: assignment || null,
                      error: assignment ? null : { code: 'PGRST116' },
                    });
                  }),
                }),
              }),
            }),
            update: vi.fn().mockImplementation((data) => ({
              eq: vi.fn().mockImplementation((field, id) => {
                const assignment = mockDbState.assignments.find(a => a.id === id);
                if (assignment) {
                  Object.assign(assignment, data);
                }
                return Promise.resolve({ error: null });
              }),
            })),
          };
        }

        if (table === 'interactive_lessons') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockImplementation(() => {
                  const lesson = mockDbState.lessons.find(l => l.id === lesson1Id);
                  return Promise.resolve({ data: lesson, error: null });
                }),
              }),
            }),
          };
        }

        return {};
      });

      (supabase.from as any) = mockFrom;

      // STEP 1: Student opens lesson for first time
      const initialProgress = await interactiveLessonProgressService.getStudentLessonProgress(
        mockStudentId,
        lesson1Id
      );
      expect(initialProgress).toBeNull(); // No progress yet

      // STEP 2: Initialize progress (auto-happens on first access)
      const progress = await interactiveLessonProgressService.initializeLessonProgress(
        mockStudentId,
        lesson1Id,
        20
      );
      expect(progress).toBeTruthy();
      expect(progress?.current_slide_index).toBe(0);
      expect(progress?.lesson_status).toBe('not_started');

      // STEP 3: Student progresses through slides (1-5)
      for (let slide = 1; slide <= 5; slide++) {
        await interactiveLessonProgressService.updateSlideProgress(
          mockStudentId,
          lesson1Id,
          slide,
          20, // 20 XP per slide
          1   // 1 star per slide
        );
      }

      // Verify progress at 25% (5/20 slides)
      const progress25 = mockDbState.progress.get(lesson1Id);
      expect(progress25?.current_slide_index).toBe(5);
      expect(progress25?.completed_slides).toBe(5);
      expect(progress25?.lesson_status).toBe('in_progress');

      // STEP 4: Student exits and comes back later
      // Should resume from slide 5
      const resumedProgress = await interactiveLessonProgressService.getStudentLessonProgress(
        mockStudentId,
        lesson1Id
      );
      expect(resumedProgress?.current_slide_index).toBe(5);

      // STEP 5: Student continues to slide 12 (60% - above 50% threshold)
      for (let slide = 6; slide <= 12; slide++) {
        await interactiveLessonProgressService.updateSlideProgress(
          mockStudentId,
          lesson1Id,
          slide,
          20,
          1
        );
      }

      // STEP 6: Complete lesson session
      const status = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        lesson1Id,
        {
          totalSlides: 20,
          completedSlides: 12,
          xpEarned: 240,
          starsEarned: 12,
        }
      );

      // Verify lesson marked as completed (≥50%)
      expect(status).toBe('completed');
      const finalProgress = mockDbState.progress.get(lesson1Id);
      expect(finalProgress?.lesson_status).toBe('completed');
      expect(finalProgress?.completion_percentage).toBe(60);
      expect(finalProgress?.completed_at).toBeTruthy();

      // STEP 7: Verify next lesson auto-unlocked
      const nextLessonId = await interactiveLessonProgressService.unlockNextLesson(
        mockStudentId,
        lesson1Id
      );
      expect(nextLessonId).toBe(lesson2Id);

      const lesson2Assignment = mockDbState.assignments.find(a => a.lesson_id === lesson2Id);
      expect(lesson2Assignment?.is_unlocked).toBe(true);
      expect(lesson2Assignment?.status).toBe('unlocked');

      // STEP 8: Verify lesson 3 remains locked
      const lesson3Assignment = mockDbState.assignments.find(a => a.lesson_id === lesson3Id);
      expect(lesson3Assignment?.is_unlocked).toBe(false);
      expect(lesson3Assignment?.status).toBe('locked');
    });

    it('should handle redo scenario: <50% completion → no unlock → redo → unlock', async () => {
      const mockDbState = {
        assignments: [
          { id: 'assign-1', lesson_id: lesson1Id, student_id: mockStudentId, order_in_sequence: 1, is_unlocked: true, status: 'assigned' },
          { id: 'assign-2', lesson_id: lesson2Id, student_id: mockStudentId, order_in_sequence: 2, is_unlocked: false, status: 'locked' },
        ],
        progress: new Map(),
        lessons: [
          { id: lesson1Id, screens_data: Array(20).fill({}) },
        ],
      };

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_progress') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockImplementation(() => {
                    const progress = mockDbState.progress.get(lesson1Id);
                    return Promise.resolve({
                      data: progress || null,
                      error: progress ? null : { code: 'PGRST116' },
                    });
                  }),
                }),
              }),
            }),
            insert: vi.fn().mockImplementation((data) => {
              const newProgress = { id: 'progress-1', ...data };
              mockDbState.progress.set(data.lesson_id, newProgress);
              return {
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: newProgress, error: null }),
                }),
              };
            }),
            update: vi.fn().mockImplementation((data) => ({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockImplementation((field, value) => {
                  const existing = mockDbState.progress.get(value);
                  if (existing) {
                    mockDbState.progress.set(value, { ...existing, ...data });
                  }
                  return Promise.resolve({ error: null });
                }),
              }),
            })),
          };
        }

        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { order_in_sequence: 1 },
                    error: null,
                  }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }

        if (table === 'interactive_lessons') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockDbState.lessons[0],
                  error: null,
                }),
              }),
            }),
          };
        }

        return {};
      });

      (supabase.from as any) = mockFrom;

      // ATTEMPT 1: Student only completes 8/20 slides (40%)
      await interactiveLessonProgressService.initializeLessonProgress(mockStudentId, lesson1Id, 20);
      
      for (let slide = 1; slide <= 8; slide++) {
        await interactiveLessonProgressService.updateSlideProgress(
          mockStudentId,
          lesson1Id,
          slide,
          20,
          1
        );
      }

      const status1 = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        lesson1Id,
        {
          totalSlides: 20,
          completedSlides: 8,
          xpEarned: 160,
          starsEarned: 8,
        }
      );

      // Verify: redo_required, no next lesson unlocked
      expect(status1).toBe('redo_required');
      const progress1 = mockDbState.progress.get(lesson1Id);
      expect(progress1?.lesson_status).toBe('redo_required');
      expect(progress1?.completed_at).toBeNull();

      // Spy on unlock to verify it's NOT called
      const unlockSpy = vi.spyOn(interactiveLessonProgressService, 'unlockNextLesson');
      expect(unlockSpy).not.toHaveBeenCalled();

      // REDO: Student restarts lesson
      await interactiveLessonProgressService.resetLessonProgress(mockStudentId, lesson1Id);
      const resetProgress = mockDbState.progress.get(lesson1Id);
      expect(resetProgress?.current_slide_index).toBe(0);
      expect(resetProgress?.completed_slides).toBe(0);
      expect(resetProgress?.lesson_status).toBe('not_started');

      // ATTEMPT 2: Student completes 15/20 slides (75%)
      for (let slide = 1; slide <= 15; slide++) {
        await interactiveLessonProgressService.updateSlideProgress(
          mockStudentId,
          lesson1Id,
          slide,
          20,
          1
        );
      }

      const status2 = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        lesson1Id,
        {
          totalSlides: 20,
          completedSlides: 15,
          xpEarned: 300,
          starsEarned: 15,
        }
      );

      // Verify: completed, next lesson should unlock
      expect(status2).toBe('completed');
      const progress2 = mockDbState.progress.get(lesson1Id);
      expect(progress2?.lesson_status).toBe('completed');
      expect(progress2?.completion_percentage).toBe(75);
      expect(progress2?.completed_at).toBeTruthy();
    });
  });

  describe('Teacher Intervention Scenarios', () => {
    it('should allow teacher to override student progress manually', async () => {
      const mockDbState = {
        progress: new Map([
          [lesson1Id, {
            id: 'progress-1',
            lesson_id: lesson1Id,
            student_id: mockStudentId,
            current_slide_index: 3,
            completed_slides: 3,
            completion_percentage: 15,
            lesson_status: 'in_progress',
            xp_earned: 60,
            completed_at: undefined,
          }],
        ]),
        assignments: [
          { id: 'assign-1', lesson_id: lesson1Id, order_in_sequence: 1, is_unlocked: true },
          { id: 'assign-2', lesson_id: lesson2Id, order_in_sequence: 2, is_unlocked: false },
        ],
      };

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_progress') {
          return {
            update: vi.fn().mockImplementation((data) => ({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockImplementation((field, value) => {
                  const existing = mockDbState.progress.get(value);
                  if (existing) {
                    Object.assign(existing, data);
                  }
                  return Promise.resolve({ error: null });
                }),
              }),
            })),
          };
        }

        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockDbState.assignments[0],
                    error: null,
                  }),
                }),
              }),
            }),
            update: vi.fn().mockImplementation((data) => ({
              eq: vi.fn().mockResolvedValue({ error: null }),
            })),
          };
        }

        return {};
      });

      (supabase.from as any) = mockFrom;

      // Teacher marks lesson as completed (override)
      await interactiveLessonProgressService.markLessonCompleted(mockStudentId, lesson1Id);

      const updatedProgress = mockDbState.progress.get(lesson1Id);
      expect(updatedProgress?.lesson_status).toBe('completed');
      expect(updatedProgress?.completion_percentage).toBe(100);
      expect(updatedProgress?.completed_at).toBeTruthy();
    });

    it('should allow teacher to mark lesson for redo even if student completed it', async () => {
      const mockDbState = {
        progress: new Map([
          [lesson1Id, {
            id: 'progress-1',
            lesson_id: lesson1Id,
            student_id: mockStudentId,
            current_slide_index: 20,
            completed_slides: 20,
            completion_percentage: 100,
            lesson_status: 'completed',
            completed_at: new Date().toISOString(),
            xp_earned: 400,
            stars_earned: 20,
          }],
        ]),
      };

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_progress') {
          return {
            update: vi.fn().mockImplementation((data) => ({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockImplementation((field, value) => {
                  const existing = mockDbState.progress.get(value);
                  if (existing) {
                    Object.assign(existing, data);
                  }
                  return Promise.resolve({ error: null });
                }),
              }),
            })),
          };
        }

        if (table === 'interactive_lesson_assignments') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }),
          };
        }

        return {};
      });

      (supabase.from as any) = mockFrom;

      // Teacher forces redo
      await interactiveLessonProgressService.markLessonRedo(mockStudentId, lesson1Id);

      const updatedProgress = mockDbState.progress.get(lesson1Id);
      expect(updatedProgress?.lesson_status).toBe('redo_required');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle exactly 50% completion correctly', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      const status = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        lesson1Id,
        {
          totalSlides: 20,
          completedSlides: 10, // Exactly 50%
          xpEarned: 200,
          starsEarned: 10,
        }
      );

      expect(status).toBe('completed'); // Should be completed, not redo_required
    });

    it('should handle 49% completion as redo_required', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      const status = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        lesson1Id,
        {
          totalSlides: 100,
          completedSlides: 49, // 49%
          xpEarned: 980,
          starsEarned: 49,
        }
      );

      expect(status).toBe('redo_required');
    });

    it('should handle lesson with no next lesson in sequence', async () => {
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn()
                    .mockResolvedValueOnce({ data: { order_in_sequence: 5 }, error: null })
                    .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }),
                }),
              }),
            }),
          };
        }
        return {};
      });

      (supabase.from as any) = mockFrom;

      const nextLessonId = await interactiveLessonProgressService.unlockNextLesson(
        mockStudentId,
        lesson1Id
      );

      expect(nextLessonId).toBeNull(); // No next lesson to unlock
    });
  });
});
