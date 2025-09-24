
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./StatsCard";
import { ActivityItem } from "./ActivityItem";
import { ClassCard } from "./ClassCard";
import { WelcomeSection } from "./WelcomeSection";
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

  // Mock classes that teachers can start
  const upcomingClasses = [
    {
      id: "class-1",
      title: "Beginner English",
      time: "Today, 10:00 AM",
      students: 5,
      status: "ready" as const
    },
    {
      id: "class-2", 
      title: "Intermediate Conversation",
      time: "Today, 2:00 PM",
      students: 3,
      status: "ready" as const
    },
    {
      id: "class-3",
      title: "Vocabulary Practice", 
      time: "Tomorrow, 11:00 AM",
      students: 4,
      status: "scheduled" as const
    },
    {
      id: "class-4",
      title: "Grammar Workshop",
      time: "Today, 4:00 PM", 
      students: 7,
      status: "ready" as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeSection 
        teacherName="Teacher"
        onJoinClassroom={() => onStartScheduledClass("Next Class")}
        weeklyEarnings={2847}
        todaysClasses={upcomingClasses.filter(c => c.status === "ready").length}
        totalStudents={upcomingClasses.reduce((total, c) => total + c.students, 0)}
        rating="4.8"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Overview */}
      <StatsCard 
        title={languageText.upcomingClasses}
        value={upcomingClasses.filter(c => c.status === "ready").length.toString()}
        icon={<Calendar className="h-5 w-5 text-primary" />}
      />
      <StatsCard 
        title={languageText.activeStudents}
        value={upcomingClasses.reduce((total, c) => total + c.students, 0).toString()}
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
      
      {/* Upcoming Classes - Full Width */}
      <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{languageText.upcomingClasses}</CardTitle>
          <Button size="sm" onClick={onScheduleClass}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule New Class
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingClasses.map((classInfo) => (
                <ClassCard 
                  key={classInfo.id}
                  title={classInfo.title}
                  time={classInfo.time}
                  students={classInfo.students}
                  buttonText={classInfo.status === "ready" ? languageText.startClass : languageText.viewDetails}
                  onButtonClick={() => {
                    if (classInfo.status === "ready") {
                      onStartScheduledClass(classInfo.title);
                    } else {
                      onViewClassDetails(classInfo.title);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming classes scheduled</p>
              <Button className="mt-4" onClick={onScheduleClass}>
                Schedule Your First Class
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
