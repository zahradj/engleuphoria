
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./StatsCard";
import { ActivityItem } from "./ActivityItem";
import { ClassCard } from "./ClassCard";
import { Calendar, Users, FileText, PlusCircle, CheckCircle, LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OverviewTabProps {
  onCreateLessonPlan: () => void;
  onScheduleClass: () => void;
  onViewProgress: () => void;
  onStartScheduledClass: (className: string) => void;
  onViewClassDetails: (className: string) => void;
}

export const OverviewTab = ({ 
  onCreateLessonPlan, 
  onScheduleClass, 
  onViewProgress, 
  onStartScheduledClass, 
  onViewClassDetails 
}: OverviewTabProps) => {
  const { languageText } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stats Overview */}
      <StatsCard 
        title={languageText.upcomingClasses}
        value="4"
        icon={<Calendar className="h-5 w-5 text-primary" />}
      />
      <StatsCard 
        title={languageText.activeStudents}
        value="12"
        icon={<Users className="h-5 w-5 text-blue-500" />}
      />
      <StatsCard 
        title={languageText.lessonPlans}
        value="8"
        icon={<FileText className="h-5 w-5 text-green-500" />}
      />
      
      {/* Recent Activity */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{languageText.recentActivity}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ActivityItem 
            icon={<CheckCircle className="h-4 w-4 text-green-500" />}
            title={`${languageText.lessonCompleted}: Animal Vocabulary`}
            time="2h ago"
          />
          <ActivityItem 
            icon={<Users className="h-4 w-4 text-blue-500" />}
            title={languageText.newStudentEnrolled}
            time="Yesterday"
          />
          <ActivityItem 
            icon={<FileText className="h-4 w-4 text-purple-500" />}
            title={`${languageText.lessonPlanCreated}: Daily Routines`}
            time="3 days ago"
          />
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{languageText.quickActions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={onCreateLessonPlan}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {languageText.createLessonPlan}
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={onScheduleClass}>
            <Calendar className="mr-2 h-4 w-4" />
            {languageText.scheduleClass}
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={onViewProgress}>
            <LineChart className="mr-2 h-4 w-4" />
            {languageText.viewProgress}
          </Button>
        </CardContent>
      </Card>
      
      {/* Upcoming Classes */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>{languageText.upcomingClasses}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClassCard 
              title="Beginner English"
              time="Today, 10:00 AM"
              students={5}
              buttonText={languageText.startClass}
              onButtonClick={() => onStartScheduledClass("Beginner English")}
            />
            
            <ClassCard 
              title="Intermediate Conversation"
              time="Today, 2:00 PM"
              students={3}
              buttonText={languageText.startClass}
              onButtonClick={() => onStartScheduledClass("Intermediate Conversation")}
            />
            
            <ClassCard 
              title="Vocabulary Practice"
              time="Tomorrow, 11:00 AM"
              students={4}
              buttonText={languageText.viewDetails}
              onButtonClick={() => onViewClassDetails("Vocabulary Practice")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
