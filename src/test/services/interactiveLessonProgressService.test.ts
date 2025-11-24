import { describe, it, expect, beforeEach, vi } from 'vitest';
import { interactiveLessonProgressService } from '@/services/interactiveLessonProgressService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Interactive Lesson Progress Service', () => {
  const mockStudentId = 'student-123';
  const mockLessonId = 'lesson-456';
  const mockTeacherId = 'teacher-789';
  const totalSlides = 20;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Auto-Continuation Feature', () => {
    it('should initialize progress at slide 0 for first-time access', async () => {
      // Mock no existing progress
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }, // Not found
              }),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'progress-1',
                lesson_id: mockLessonId,
                student_id: mockStudentId,
                current_slide_index: 0,
                total_slides: totalSlides,
                completed_slides: 0,
                completion_percentage: 0,
                lesson_status: 'not_started',
              },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      const progress = await interactiveLessonProgressService.initializeLessonProgress(
        mockStudentId,
        mockLessonId,
        totalSlides
      );

      expect(progress).toBeTruthy();
      expect(progress?.current_slide_index).toBe(0);
      expect(progress?.lesson_status).toBe('not_started');
      expect(mockFrom).toHaveBeenCalledWith('interactive_lesson_progress');
    });

    it('should resume from last saved slide on subsequent access', async () => {
      const mockProgress = {
        id: 'progress-1',
        lesson_id: mockLessonId,
        student_id: mockStudentId,
        current_slide_index: 7,
        total_slides: totalSlides,
        completed_slides: 7,
        completion_percentage: 35,
        lesson_status: 'in_progress',
        xp_earned: 140,
        stars_earned: 2,
      };

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockProgress,
                error: null,
              }),
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      const progress = await interactiveLessonProgressService.getStudentLessonProgress(
        mockStudentId,
        mockLessonId
      );

      expect(progress).toBeTruthy();
      expect(progress?.current_slide_index).toBe(7);
      expect(progress?.lesson_status).toBe('in_progress');
      expect(progress?.completion_percentage).toBe(35);
    });

    it('should save progress after each slide navigation', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'progress-1',
                  lesson_id: mockLessonId,
                  student_id: mockStudentId,
                  current_slide_index: 5,
                  total_slides: totalSlides,
                  completed_slides: 5,
                  completion_percentage: 25,
                  lesson_status: 'in_progress',
                  xp_earned: 100,
                  stars_earned: 1,
                },
                error: null,
              }),
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.updateSlideProgress(
        mockStudentId,
        mockLessonId,
        6,
        20,
        1
      );

      expect(mockFrom).toHaveBeenCalledWith('interactive_lesson_progress');
      const updateCall = mockFrom.mock.results[1]?.value;
      expect(updateCall.update).toHaveBeenCalledWith(
        expect.objectContaining({
          current_slide_index: 6,
          completed_slides: 6,
          xp_earned: 120, // 100 + 20
        })
      );
    });
  });

  describe('50% Completion Rule', () => {
    it('should mark lesson as "completed" when reaching exactly 50% (10/20 slides)', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      const status = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        mockLessonId,
        {
          totalSlides: 20,
          completedSlides: 10,
          xpEarned: 200,
          starsEarned: 2,
        }
      );

      expect(status).toBe('completed');
      expect(mockFrom).toHaveBeenCalledWith('interactive_lesson_progress');
      const updateCall = mockFrom.mock.results[0]?.value;
      expect(updateCall.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'completed',
          completion_percentage: 50,
        })
      );
    });

    it('should mark lesson as "completed" when reaching >50% (15/20 slides)', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      const status = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        mockLessonId,
        {
          totalSlides: 20,
          completedSlides: 15,
          xpEarned: 300,
          starsEarned: 3,
        }
      );

      expect(status).toBe('completed');
      expect(mockFrom).toHaveBeenCalledWith('interactive_lesson_progress');
      const updateCall = mockFrom.mock.results[0]?.value;
      expect(updateCall.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'completed',
          completion_percentage: 75,
        })
      );
    });

    it('should mark lesson as "redo_required" when <50% (9/20 slides)', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      const status = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        mockLessonId,
        {
          totalSlides: 20,
          completedSlides: 9,
          xpEarned: 180,
          starsEarned: 1,
        }
      );

      expect(status).toBe('redo_required');
      expect(mockFrom).toHaveBeenCalledWith('interactive_lesson_progress');
      const updateCall = mockFrom.mock.results[0]?.value;
      expect(updateCall.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'redo_required',
          completion_percentage: 45,
          completed_at: null, // Should NOT set completed_at for redo_required
        })
      );
    });

    it('should not unlock next lesson when lesson requires redo (<50%)', async () => {
      let unlockNextCalled = false;

      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      // Spy on unlockNextLesson
      const unlockSpy = vi.spyOn(interactiveLessonProgressService, 'unlockNextLesson');

      const status = await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        mockLessonId,
        {
          totalSlides: 20,
          completedSlides: 8,
          xpEarned: 160,
          starsEarned: 1,
        }
      );

      expect(status).toBe('redo_required');
      expect(unlockSpy).not.toHaveBeenCalled();
    });

    it('should set completed_at timestamp only when status is "completed"', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        mockLessonId,
        {
          totalSlides: 20,
          completedSlides: 12,
          xpEarned: 240,
          starsEarned: 2,
        }
      );

      const updateCall = mockFrom.mock.results[0]?.value;
      const updateData = updateCall.update.mock.calls[0][0];
      
      expect(updateData.lesson_status).toBe('completed');
      expect(updateData.completed_at).toBeTruthy();
      expect(new Date(updateData.completed_at).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Auto-Progression Feature', () => {
    it('should unlock next lesson when current lesson is completed (≥50%)', async () => {
      const mockLessonId2 = 'lesson-999';
      
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValueOnce({
                    data: { order_in_sequence: 1 },
                    error: null,
                  }).mockResolvedValueOnce({
                    data: {
                      id: 'assignment-2',
                      lesson_id: mockLessonId2,
                      order_in_sequence: 2,
                      is_unlocked: false,
                      status: 'locked',
                    },
                    error: null,
                  }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                error: null,
              }),
            }),
          };
        }
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                error: null,
              }),
            }),
          }),
        };
      });

      (supabase.from as any) = mockFrom;

      const nextLessonId = await interactiveLessonProgressService.unlockNextLesson(
        mockStudentId,
        mockLessonId
      );

      expect(nextLessonId).toBe(mockLessonId2);
      expect(mockFrom).toHaveBeenCalledWith('interactive_lesson_assignments');
    });

    it('should NOT unlock lesson beyond the next in sequence', async () => {
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValueOnce({
                    data: { order_in_sequence: 1 },
                    error: null,
                  }).mockResolvedValueOnce({
                    data: null, // No next lesson (end of sequence)
                    error: { code: 'PGRST116' },
                  }),
                }),
              }),
            }),
          };
        }
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                error: null,
              }),
            }),
          }),
        };
      });

      (supabase.from as any) = mockFrom;

      const nextLessonId = await interactiveLessonProgressService.unlockNextLesson(
        mockStudentId,
        mockLessonId
      );

      expect(nextLessonId).toBeNull();
    });

    it('should update next lesson status to "unlocked"', async () => {
      const mockLessonId2 = 'lesson-next';
      let updateCalled = false;
      
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValueOnce({
                    data: { order_in_sequence: 1 },
                    error: null,
                  }).mockResolvedValueOnce({
                    data: {
                      id: 'assignment-next',
                      lesson_id: mockLessonId2,
                      order_in_sequence: 2,
                    },
                    error: null,
                  }),
                }),
              }),
            }),
            update: vi.fn().mockImplementation((data) => {
              updateCalled = true;
              expect(data.is_unlocked).toBe(true);
              expect(data.status).toBe('unlocked');
              return {
                eq: vi.fn().mockResolvedValue({
                  error: null,
                }),
              };
            }),
          };
        }
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                error: null,
              }),
            }),
          }),
        };
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.unlockNextLesson(
        mockStudentId,
        mockLessonId
      );

      expect(updateCalled).toBe(true);
    });

    it('should trigger auto-progression from completeLessonSession when ≥50%', async () => {
      const mockLessonId2 = 'lesson-auto-unlock';
      
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'interactive_lesson_assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValueOnce({
                    data: { order_in_sequence: 1 },
                    error: null,
                  }).mockResolvedValueOnce({
                    data: {
                      id: 'assignment-auto',
                      lesson_id: mockLessonId2,
                      order_in_sequence: 2,
                    },
                    error: null,
                  }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                error: null,
              }),
            }),
          }),
        };
      });

      (supabase.from as any) = mockFrom;

      const unlockSpy = vi.spyOn(interactiveLessonProgressService, 'unlockNextLesson');

      await interactiveLessonProgressService.completeLessonSession(
        mockStudentId,
        mockLessonId,
        {
          totalSlides: 20,
          completedSlides: 11,
          xpEarned: 220,
          starsEarned: 2,
        }
      );

      expect(unlockSpy).toHaveBeenCalledWith(mockStudentId, mockLessonId);
    });
  });

  describe('Teacher Override Functions', () => {
    it('should allow teacher to mark lesson as completed regardless of progress', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
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
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.markLessonCompleted(
        mockStudentId,
        mockLessonId
      );

      const updateCall = mockFrom.mock.results[0]?.value;
      expect(updateCall.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'completed',
          completion_percentage: 100,
        })
      );
    });

    it('should allow teacher to mark lesson as redo required', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.markLessonRedo(
        mockStudentId,
        mockLessonId
      );

      const updateCall = mockFrom.mock.results[0]?.value;
      expect(updateCall.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_status: 'redo_required',
        })
      );
    });

    it('should reset lesson progress completely when teacher restarts', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.resetLessonProgress(
        mockStudentId,
        mockLessonId
      );

      const updateCall = mockFrom.mock.results[0]?.value;
      expect(updateCall.update).toHaveBeenCalledWith(
        expect.objectContaining({
          current_slide_index: 0,
          completed_slides: 0,
          completion_percentage: 0,
          lesson_status: 'not_started',
          completed_at: null,
        })
      );
    });
  });

  describe('Lesson Assignment', () => {
    it('should assign lesson to student with correct sequence order', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.assignLessonToStudent(
        mockLessonId,
        mockStudentId,
        mockTeacherId,
        1,
        true
      );

      expect(mockFrom).toHaveBeenCalledWith('interactive_lesson_assignments');
      const insertCall = mockFrom.mock.results[0]?.value;
      expect(insertCall.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          lesson_id: mockLessonId,
          student_id: mockStudentId,
          assigned_by: mockTeacherId,
          order_in_sequence: 1,
          is_unlocked: true,
          status: 'assigned',
        })
      );
    });

    it('should create locked assignment when isUnlocked is false', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      (supabase.from as any) = mockFrom;

      await interactiveLessonProgressService.assignLessonToStudent(
        mockLessonId,
        mockStudentId,
        mockTeacherId,
        2,
        false
      );

      const insertCall = mockFrom.mock.results[0]?.value;
      expect(insertCall.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          is_unlocked: false,
          status: 'locked',
        })
      );
    });
  });
});
