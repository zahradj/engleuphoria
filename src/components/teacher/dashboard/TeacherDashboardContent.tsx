
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { OverviewTab } from "./OverviewTab";
import { LessonsTab } from "./LessonsTab";
import { StudentsTab } from "./StudentsTab";
import { ScheduleTab } from "./ScheduleTab";
import { ResourceLibraryTab } from "../ResourceLibraryTab";
import { BookOpen, Users, Calendar, BarChart3, Library } from "lucide-react";

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
    <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-14 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 rounded-xl p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
          >
            <BarChart3 className="h-4 w-4" />
            {languageText.overview}
          </TabsTrigger>
          <TabsTrigger 
            value="lessons" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
          >
            <BookOpen className="h-4 w-4" />
            {languageText.lessons}
          </TabsTrigger>
          <TabsTrigger 
            value="students" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
          >
            <Users className="h-4 w-4" />
            {languageText.students}
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
          >
            <Calendar className="h-4 w-4" />
            {languageText.schedule}
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
          >
            <Library className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <TabsContent value="overview" className="animate-fade-in">
            <OverviewTab
              onCreateLessonPlan={handlers.handleCreateLessonPlan}
              onScheduleClass={handlers.handleScheduleClass}
              onViewProgress={handlers.handleViewProgress}
              onStartScheduledClass={handlers.handleStartScheduledClass}
              onViewClassDetails={handlers.handleViewClassDetails}
            />
          </TabsContent>
          
          <TabsContent value="lessons" className="animate-fade-in">
            <LessonsTab
              lessonPlans={lessonPlans}
              onCreateLessonPlan={handlers.handleCreateLessonPlan}
              onUploadMaterial={handlers.handleUploadMaterial}
              onViewLessonPlan={handlers.handleViewLessonPlan}
              onUseMaterial={handlers.handleUseMaterial}
            />
          </TabsContent>
          
          <TabsContent value="students" className="animate-fade-in">
            <StudentsTab
              onFilter={handlers.handleFilter}
              onAddStudent={handlers.handleAddStudent}
              onViewStudentDetails={handlers.handleViewStudentDetails}
            />
          </TabsContent>
          
          <TabsContent value="schedule" className="animate-fade-in">
            <ScheduleTab
              onScheduleClass={handlers.handleScheduleClass}
              onStartScheduledClass={handlers.handleStartScheduledClass}
            />
          </TabsContent>
          
          <TabsContent value="resources" className="animate-fade-in">
            <ResourceLibraryTab />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
};
