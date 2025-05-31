
import { TeacherOverviewSection } from "./sections/TeacherOverviewSection";
import { TeacherScheduleSection } from "./sections/TeacherScheduleSection";
import { TeacherStudentsSection } from "./sections/TeacherStudentsSection";
import { TeacherLessonsSection } from "./sections/TeacherLessonsSection";
import { TeacherMaterialsSection } from "./sections/TeacherMaterialsSection";
import { TeacherGradingSection } from "./sections/TeacherGradingSection";
import { TeacherMessagesSection } from "./sections/TeacherMessagesSection";
import { TeacherSettingsSection } from "./sections/TeacherSettingsSection";

interface TeacherMainContentProps {
  activeSection: string;
  lessonPlans: any[];
  handlers: {
    handleCreateLessonPlan: () => void;
    handleScheduleClass: () => void;
    handleViewProgress: () => void;
    handleStartScheduledClass: (className: string) => void;
    handleViewClassDetails: (className: string) => void;
    handleUploadMaterial: () => void;
    handleViewLessonPlan: (planId: string) => void;
    handleUseMaterial: (materialName: string) => void;
    handleFilter: () => void;
    handleAddStudent: () => void;
    handleViewStudentDetails: (studentName: string) => void;
  };
}

export const TeacherMainContent = ({ activeSection, lessonPlans, handlers }: TeacherMainContentProps) => {
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <TeacherOverviewSection handlers={handlers} />;
      case "schedule":
        return <TeacherScheduleSection handlers={handlers} />;
      case "students":
        return <TeacherStudentsSection handlers={handlers} />;
      case "lessons":
        return <TeacherLessonsSection lessonPlans={lessonPlans} handlers={handlers} />;
      case "materials":
        return <TeacherMaterialsSection handlers={handlers} />;
      case "grading":
        return <TeacherGradingSection handlers={handlers} />;
      case "messages":
        return <TeacherMessagesSection handlers={handlers} />;
      case "settings":
        return <TeacherSettingsSection handlers={handlers} />;
      default:
        return <TeacherOverviewSection handlers={handlers} />;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {renderSection()}
    </div>
  );
};
