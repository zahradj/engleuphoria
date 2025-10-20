import { CURRICULUM_STAGES } from '@/data/curriculumStages';
import { CurriculumStage, Unit, StudentProgress } from '@/types/englishJourney';

class EnglishJourneyService {
  getAllStages(): CurriculumStage[] {
    return CURRICULUM_STAGES;
  }

  getStageById(id: number): CurriculumStage | undefined {
    return CURRICULUM_STAGES.find(stage => stage.id === id);
  }

  getUnitsByStage(stageId: number): Unit[] {
    const stage = this.getStageById(stageId);
    return stage?.units || [];
  }

  getUnitById(unitId: string): Unit | undefined {
    for (const stage of CURRICULUM_STAGES) {
      const unit = stage.units.find(u => u.id === unitId);
      if (unit) return unit;
    }
    return undefined;
  }

  calculateProgress(completedUnits: string[], stageId: number): number {
    const stage = this.getStageById(stageId);
    if (!stage) return 0;
    
    const stageUnitIds = stage.units.map(u => u.id);
    const completed = completedUnits.filter(id => stageUnitIds.includes(id)).length;
    return Math.round((completed / stage.units.length) * 100);
  }

  awardXP(action: string, baseXP: number, multipliers?: any): number {
    let totalXP = baseXP;
    if (multipliers?.streak) totalXP *= multipliers.streak;
    if (multipliers?.perfectScore) totalXP *= multipliers.perfectScore;
    return Math.round(totalXP);
  }
}

export const englishJourneyService = new EnglishJourneyService();
