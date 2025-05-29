
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { OverviewTab } from "./OverviewTab";
import { LessonsTab } from "./LessonsTab";
import { StudentsTab } from "./StudentsTab";
import { ScheduleTab } from "./ScheduleTab";

interface TeacherDashboardContentProps {
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

export const TeacherDashboardContent = ({ lessonPlans, handlers }: TeacherDashboardContentProps) => {
  const { languageText } = useLanguage();

  return (
    <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{languageText.overview}</TabsTrigger>
          <TabsTrigger value="lessons">{languageText.lessons}</TabsTrigger>
          <TabsTrigger value="students">{languageText.students}</TabsTrigger>
          <TabsTrigger value="schedule">{languageText.schedule}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab
            onCreateLessonPlan={handlers.handleCreateLessonPlan}
            onScheduleClass={handlers.handleScheduleClass}
            onViewProgress={handlers.handleViewProgress}
            onStartScheduledClass={handlers.handleStartScheduledClass}
            onViewClassDetails={handlers.handleViewClassDetails}
          />
        </TabsContent>
        
        <TabsContent value="lessons">
          <LessonsTab
            lessonPlans={lessonPlans}
            onCreateLessonPlan={handlers.handleCreateLessonPlan}
            onUploadMaterial={handlers.handleUploadMaterial}
            onViewLessonPlan={handlers.handleViewLessonPlan}
            onUseMaterial={handlers.handleUseMaterial}
          />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentsTab
            onFilter={handlers.handleFilter}
            onAddStudent={handlers.handleAddStudent}
            onViewStudentDetails={handlers.handleViewStudentDetails}
          />
        </TabsContent>
        
        <TabsContent value="schedule">
          <ScheduleTab
            onScheduleClass={handlers.handleScheduleClass}
            onStartScheduledClass={handlers.handleStartScheduledClass}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};
