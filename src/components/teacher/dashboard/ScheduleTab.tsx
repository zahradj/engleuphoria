
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduleItem } from "./ScheduleItem";
import { ClassScheduleItem } from "./ClassScheduleItem";
import { PlusCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ScheduleTabProps {
  onScheduleClass: () => void;
  onStartScheduledClass: (className: string) => void;
}

export const ScheduleTab = ({ onScheduleClass, onStartScheduledClass }: ScheduleTabProps) => {
  const { languageText } = useLanguage();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{languageText.schedule}</CardTitle>
        <Button size="sm" onClick={onScheduleClass}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {languageText.scheduleClass}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Weekly Schedule */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{languageText.thisWeek}</h3>
            <div className="grid grid-cols-5 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                <div key={day} className="border rounded-lg p-3">
                  <h4 className="font-medium mb-2">{day}</h4>
                  <div className="space-y-2">
                    <ScheduleItem time="10:00 AM" title="Beginner English" />
                    <ScheduleItem time="2:00 PM" title="Intermediate Conversation" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Schedule */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{languageText.upcomingClasses}</h3>
            <div className="space-y-3">
              <ClassScheduleItem 
                title="Beginner English"
                day="Monday"
                time="10:00 - 11:00 AM"
                students={5}
                onStart={() => onStartScheduledClass("Beginner English")}
              />
              <ClassScheduleItem 
                title="Intermediate Conversation"
                day="Monday"
                time="2:00 - 3:00 PM"
                students={3}
                onStart={() => onStartScheduledClass("Intermediate Conversation")}
              />
              <ClassScheduleItem 
                title="Vocabulary Practice"
                day="Tuesday"
                time="11:00 AM - 12:00 PM"
                students={4}
                onStart={() => onStartScheduledClass("Vocabulary Practice")}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
