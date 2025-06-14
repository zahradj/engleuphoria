
import { CurriculumPhase, PhaseProgress } from '@/types/curriculumTypes';
import { CURRICULUM_PHASES } from '@/data/curriculumPhases';

class ProgressTrackingService {
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
}

export const progressTrackingService = new ProgressTrackingService();
