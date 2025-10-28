import { supabase } from '@/integrations/supabase/client';
import { englishJourneyService } from './englishJourneyService';

class CurriculumAssignmentService {
  /**
   * Assign initial curriculum to student based on CEFR level from placement test
   */
  async assignInitialCurriculum(studentId: string, cefrLevel: string) {
    try {
      // Map CEFR level to English Journey stage
      const stageMapping: Record<string, number> = {
        'Pre-A1': 1,
        'A1': 2,
        'A2': 3,
        'B1': 4,
        'B2': 5,
        'C1': 5, // Advanced students start at B2/C1 stage
        'C2': 5
      };

      const stageId = stageMapping[cefrLevel] || 2; // Default to Stage 2 if not found
      const stage = englishJourneyService.getStageById(stageId);

      if (!stage) {
        throw new Error(`Stage not found for CEFR level ${cefrLevel}`);
      }

      // Get first unit of the stage
      const firstUnit = stage.units[0];

      if (!firstUnit) {
        throw new Error(`No units found in stage ${stageId}`);
      }

      // Create curriculum assignment
      const { data, error } = await supabase
        .from('student_curriculum_assignments')
        .insert({
          student_id: studentId,
          stage_id: stageId,
          stage_name: stage.name,
          unit_id: firstUnit.id,
          unit_name: firstUnit.topic,
          current_lesson_number: 1,
          lessons_completed: [],
          total_lessons_in_unit: firstUnit.lessons?.length || 6,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error assigning curriculum:', error);
      throw error;
    }
  }

  /**
   * Get student's current curriculum assignment
   */
  async getCurrentAssignment(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('student_curriculum_assignments')
        .select('*')
        .eq('student_id', studentId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

      return data;
    } catch (error) {
      console.error('Error getting current assignment:', error);
      return null;
    }
  }

  /**
   * Update lesson progress when student completes a lesson
   */
  async updateLessonProgress(studentId: string, lessonNumber: number) {
    try {
      const assignment = await this.getCurrentAssignment(studentId);
      
      if (!assignment) {
        throw new Error('No active curriculum assignment found');
      }

      // Add lesson to completed array if not already there
      const completedLessons = assignment.lessons_completed || [];
      const lessonId = `lesson-${lessonNumber}`;
      
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      // Update assignment
      const { data, error } = await supabase
        .from('student_curriculum_assignments')
        .update({
          current_lesson_number: lessonNumber + 1,
          lessons_completed: completedLessons,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignment.id)
        .select()
        .single();

      if (error) throw error;

      // Check if unit is completed
      if (completedLessons.length >= assignment.total_lessons_in_unit) {
        await this.completeUnit(studentId, assignment.unit_id);
      }

      return data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  }

  /**
   * Mark unit as completed and unlock next unit
   */
  async completeUnit(studentId: string, unitId: string) {
    try {
      const assignment = await this.getCurrentAssignment(studentId);
      
      if (!assignment) return;

      // Mark current unit as completed
      await supabase
        .from('student_curriculum_assignments')
        .update({ status: 'completed' })
        .eq('id', assignment.id);

      // Get next unit in the stage
      const stage = englishJourneyService.getStageById(assignment.stage_id);
      const units = stage?.units || [];
      const currentUnitIndex = units.findIndex(u => u.id === unitId);
      const nextUnit = units[currentUnitIndex + 1];

      if (nextUnit) {
        // Assign next unit
        await supabase
          .from('student_curriculum_assignments')
          .insert({
            student_id: studentId,
            stage_id: assignment.stage_id,
            stage_name: assignment.stage_name,
            unit_id: nextUnit.id,
            unit_name: nextUnit.topic,
            current_lesson_number: 1,
            lessons_completed: [],
            total_lessons_in_unit: nextUnit.lessons?.length || 6,
            status: 'active'
          });
      }
    } catch (error) {
      console.error('Error completing unit:', error);
      throw error;
    }
  }

  /**
   * Get unit progress percentage
   */
  calculateUnitProgress(assignment: any): number {
    if (!assignment) return 0;
    
    const completed = assignment.lessons_completed?.length || 0;
    const total = assignment.total_lessons_in_unit || 1;
    
    return Math.round((completed / total) * 100);
  }
}

export const curriculumAssignmentService = new CurriculumAssignmentService();
