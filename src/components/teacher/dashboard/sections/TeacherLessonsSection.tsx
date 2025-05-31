
import { LessonsTab } from "../LessonsTab";

interface TeacherLessonsSectionProps {
  lessonPlans: any[];
  handlers: {
    handleCreateLessonPlan: () => void;
    handleUploadMaterial: () => void;
    handleViewLessonPlan: (planId: string) => void;
    handleUseMaterial: (materialName: string) => void;
  };
}

export const TeacherLessonsSection = ({ lessonPlans, handlers }: TeacherLessonsSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lesson Plans</h2>
      <LessonsTab 
        lessonPlans={lessonPlans}
        onCreateLessonPlan={handlers.handleCreateLessonPlan}
        onUploadMaterial={handlers.handleUploadMaterial}
        onViewLessonPlan={handlers.handleViewLessonPlan}
        onUseMaterial={handlers.handleUseMaterial}
      />
    </div>
  );
};
