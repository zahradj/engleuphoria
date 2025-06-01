
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ClassItem {
  id: number;
  title: string;
  date: string;
  time: string;
  teacher: string;
  color: string;
}

interface StudentUpcomingClassesProps {
  classes: ClassItem[];
}

export const StudentUpcomingClasses = ({ classes }: StudentUpcomingClassesProps) => {
  return (
    <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="flex items-center gap-3 text-blue-800">
          <div className="bg-blue-500 p-3 rounded-2xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          Upcoming Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div key={classItem.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`${classItem.color} p-3 rounded-2xl text-white`}>
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{classItem.title}</h4>
                  <p className="text-gray-600 font-medium">{classItem.date} at {classItem.time}</p>
                  <p className="text-sm text-gray-500">with {classItem.teacher}</p>
                </div>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 text-lg font-bold">
                Join Class
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
