
import { PlannerRequest, PlannerResponse, CurriculumPlan } from '@/types/curriculum';
import { CurriculumPhase } from '@/types/curriculumTypes';
import { CURRICULUM_PHASES } from '@/data/curriculumPhases';
import { WeekPlannerService } from './weekPlannerService';

class CurriculumPlannerService {
  private weekPlanner = new WeekPlannerService();

  generateEnhancedCurriculum(request: PlannerRequest): PlannerResponse {
    const { studentProfile } = request;
    
    const currentPhase = this.determineStartingPhase(studentProfile);
    const weeks = this.weekPlanner.generateSystematicWeeks(currentPhase, studentProfile);
    
    const plan: CurriculumPlan = {
      id: `enhanced_plan_${Date.now()}`,
      studentId: studentProfile.id,
      weeks,
      badgeRule: `Enhanced Learning Phase ${currentPhase.name} = 400 XP`,
      createdAt: new Date(),
      status: 'draft' as const,
      metadata: {
        framework: 'NLEFP',
        progressTracking: {
          skillsToTrack: ['sentence_building', 'pattern_recognition', 'comprehension_speed'],
          nlpAnchorsUsed: ['visual_timeline', 'kinesthetic_building', 'pattern_visualization'],
          metacognitionPrompts: [
            'What sentence pattern did you use?',
            'How did you build this sentence step by step?',
            'Which strategy helped you understand fastest?'
          ]
        },
        nlpIntegration: true
      }
    };

    return {
      success: true,
      plan
    };
  }

  private determineStartingPhase(profile: any): CurriculumPhase {
    if (profile.cefrLevel === 'A1' || !profile.diagnosticResults) {
      return CURRICULUM_PHASES[0];
    } else if (profile.cefrLevel === 'A2') {
      return CURRICULUM_PHASES[1];
    } else if (profile.cefrLevel === 'B1') {
      return CURRICULUM_PHASES[2];
    } else {
      return CURRICULUM_PHASES[3];
    }
  }
}

export const curriculumPlannerService = new CurriculumPlannerService();
