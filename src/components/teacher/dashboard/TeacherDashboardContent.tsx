
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { CleanDashboardTab } from "../CleanDashboardTab";
import { StudentsTab } from "./StudentsTab";
import { EnhancedCalendarTab } from "../EnhancedCalendarTab";
import { Users, Calendar, BarChart3 } from "lucide-react";

interface TeacherDashboardContentProps {
  lessonPlans: any[];
  teacherName?: string;
  teacherId: string;
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

export const TeacherDashboardContent = ({ lessonPlans, teacherName = "Teacher", teacherId, handlers }: TeacherDashboardContentProps) => {
  const { languageText } = useLanguage();

  return (
    <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-lg transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <BarChart3 className="h-4 w-4" />
            {languageText.overview}
          </TabsTrigger>
          <TabsTrigger 
            value="students" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-lg transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Users className="h-4 w-4" />
            {languageText.students}
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-lg transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Calendar className="h-4 w-4" />
            {languageText.schedule}
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <TabsContent value="overview" className="animate-fade-in">
            <CleanDashboardTab teacherName={teacherName} />
          </TabsContent>
          
          <TabsContent value="students" className="animate-fade-in">
            <StudentsTab
              onFilter={handlers.handleFilter}
              onAddStudent={handlers.handleAddStudent}
              onViewStudentDetails={handlers.handleViewStudentDetails}
            />
          </TabsContent>
          
          <TabsContent value="schedule" className="animate-fade-in">
            <EnhancedCalendarTab teacherId={teacherId} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
};
