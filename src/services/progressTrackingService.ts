
import { CurriculumPhase, PhaseProgress } from '@/types/curriculumTypes';
import { CURRICULUM_PHASES } from '@/data/curriculumPhases';

interface StudentProgress {
  studentId: string;
  currentPhase: number;
  completedWeeks: number[];
  completedLessons: Array<{ weekIndex: number; lessonIndex: number }>;
  totalXP: number;
  badges: string[];
  lastActivityDate: Date;
}

interface WeekCompletion {
  xpEarned: number;
  skillsImproved: string[];
}

interface LessonCompletion {
  score: number;
  timeSpent: number;
  skillsAssessed: string[];
}

class ProgressTrackingService {
  private studentProgressMap = new Map<string, StudentProgress>();

  getPhaseProgress(studentId: string, currentPhase: number): PhaseProgress {
    const current = CURRICULUM_PHASES.find(p => p.id === currentPhase);
    const next = CURRICULUM_PHASES.find(p => p.id === currentPhase + 1);
    
    return {
      currentPhase: current!,
      nextPhase: next || null,
      progressPercentage: (currentPhase / CURRICULUM_PHASES.length) * 100,
      skillsMastered: current?.skills || [],
      nextSkills: next?.skills || []
    };
  }

  getStudentProgress(studentId: string): StudentProgress | null {
    return this.studentProgressMap.get(studentId) || null;
  }

  initializeStudentProgress(studentId: string, initialWeek: any, initialPhase: CurriculumPhase): void {
    const progress: StudentProgress = {
      studentId,
      currentPhase: initialPhase.id,
      completedWeeks: [],
      completedLessons: [],
      totalXP: 0,
      badges: [],
      lastActivityDate: new Date()
    };
    
    this.studentProgressMap.set(studentId, progress);
  }

  completeWeek(studentId: string, weekIndex: number, week: any, completion: WeekCompletion): StudentProgress | null {
    const progress = this.studentProgressMap.get(studentId);
    if (!progress) return null;

    if (!progress.completedWeeks.includes(weekIndex)) {
      progress.completedWeeks.push(weekIndex);
      progress.totalXP += completion.xpEarned;
      progress.lastActivityDate = new Date();
    }

    this.studentProgressMap.set(studentId, progress);
    return progress;
  }

  completeLesson(studentId: string, weekIndex: number, lessonIndex: number, completion: LessonCompletion): StudentProgress | null {
    const progress = this.studentProgressMap.get(studentId);
    if (!progress) return null;

    const lessonKey = { weekIndex, lessonIndex };
    const existingLesson = progress.completedLessons.find(
      l => l.weekIndex === weekIndex && l.lessonIndex === lessonIndex
    );

    if (!existingLesson) {
      progress.completedLessons.push(lessonKey);
      progress.totalXP += Math.round(completion.score * 2); // Convert score to XP
      progress.lastActivityDate = new Date();
    }

    this.studentProgressMap.set(studentId, progress);
    return progress;
  }
}

export const progressTrackingService = new ProgressTrackingService();
