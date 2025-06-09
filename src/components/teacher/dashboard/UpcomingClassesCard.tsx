
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Play, Eye } from "lucide-react";

interface ClassInfo {
  id: number;
  title: string;
  time: string;
  student: string;
  studentCount: number;
  status: "upcoming" | "ready";
}

interface UpcomingClassesCardProps {
  classes: ClassInfo[];
  onJoinClass: () => void;
}

export const UpcomingClassesCard = ({ classes, onJoinClass }: UpcomingClassesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-teal-500" />
          Today's Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-800">{cls.title}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {cls.time}
                </p>
                <p className="text-sm text-teal-600">{cls.student}</p>
              </div>
              <div className="flex gap-2">
                {cls.status === "ready" ? (
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600" onClick={onJoinClass}>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
