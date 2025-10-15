
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { OverviewTab } from "./OverviewTab";
import { StudentsTab } from "./StudentsTab";
import { ScheduleTab } from "./ScheduleTab";
import { Users, Calendar, BarChart3 } from "lucide-react";

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
        <TabsList className="grid w-full grid-cols-3 h-14 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 backdrop-blur-sm shadow-lg border border-purple-200/50 rounded-xl p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-sm font-medium text-purple-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all data-[state=active]:shadow-md"
          >
            <BarChart3 className="h-4 w-4" />
            {languageText.overview} ✨
          </TabsTrigger>
          <TabsTrigger 
            value="students" 
            className="flex items-center gap-2 text-sm font-medium text-purple-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all data-[state=active]:shadow-md"
          >
            <Users className="h-4 w-4" />
            {languageText.students} 🎓
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="flex items-center gap-2 text-sm font-medium text-purple-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all data-[state=active]:shadow-md"
          >
            <Calendar className="h-4 w-4" />
            {languageText.schedule} 📅
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
        </div>
      </Tabs>
    </main>
  );
};
