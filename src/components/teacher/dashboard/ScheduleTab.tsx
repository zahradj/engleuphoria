
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClassScheduleItem } from "./ClassScheduleItem";

interface ScheduleTabProps {
  onScheduleClass: () => void;
  onStartScheduledClass: (className: string) => void;
}

interface ScheduledLesson {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  students: string[];
  description: string;
  type: string;
}

export const ScheduleTab = ({ onScheduleClass, onStartScheduledClass }: ScheduleTabProps) => {
  const { languageText } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock scheduled lessons - in real app this would come from localStorage or API
  const scheduledLessons: ScheduledLesson[] = [
    {
      id: "1",
      title: "Beginner English",
      date: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      students: ["Alex", "Maria", "Li", "Sophia", "Emma"],
      description: "Basic English conversation",
      type: "conversation"
    },
    {
      id: "2", 
      title: "Intermediate Conversation",
      date: new Date(),
      startTime: "14:00",
      endTime: "15:00",
      students: ["Carlos", "Emma", "Noah"],
      description: "Intermediate level conversation practice",
      type: "conversation"
    },
    {
      id: "3",
      title: "Vocabulary Practice",
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: "11:00",
      endTime: "12:00",
      students: ["Alex", "Maria", "Li", "Carlos"],
      description: "Daily vocabulary building",
      type: "vocabulary"
    }
  ];

  // Filter lessons for selected date
  const selectedDateStr = selectedDate?.toDateString();
  const lessonsForSelectedDate = scheduledLessons.filter(
    lesson => lesson.date.toDateString() === selectedDateStr
  );

  // Get dates that have lessons for calendar highlighting
  const lessonDates = scheduledLessons.map(lesson => lesson.date);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{languageText.schedule}</CardTitle>
          <Button size="sm" onClick={onScheduleClass}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {languageText.scheduleClass}
          </Button>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-lg p-3 pointer-events-auto"
            modifiers={{
              hasLesson: lessonDates
            }}
            modifiersStyles={{
              hasLesson: {
                backgroundColor: '#e0e7ff',
                color: '#3730a3',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Selected Date Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? (
              selectedDate.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            ) : (
              "Select a date"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessonsForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {lessonsForSelectedDate.map((lesson) => (
                <ClassScheduleItem
                  key={lesson.id}
                  title={lesson.title}
                  day=""
                  time={`${lesson.startTime} - ${lesson.endTime}`}
                  students={lesson.students.length}
                  onStart={() => onStartScheduledClass(lesson.title)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <PlusCircle className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-center">No lessons scheduled for this day</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={onScheduleClass}
              >
                Schedule a Lesson
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
