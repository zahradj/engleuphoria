
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Play, Eye, Users, DollarSign } from "lucide-react";

interface ClassInfo {
  id: number;
  title: string;
  time: string;
  student: string;
  studentCount: number;
  status: "upcoming" | "ready" | "live";
  earnings: number;
}

interface UpcomingClassesCardProps {
  classes: ClassInfo[];
  onJoinClass: () => void;
  onStartClass: (classId: number) => void;
}

export const UpcomingClassesCard = ({ classes, onJoinClass, onStartClass }: UpcomingClassesCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-500";
      case "live": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready": return "Ready to Start";
      case "live": return "Live Now";
      default: return "Scheduled";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-teal-500" />
          Today's Classes ({classes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-800">{cls.title}</h4>
                  <Badge className={`${getStatusColor(cls.status)} text-white text-xs`}>
                    {getStatusText(cls.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                  <Clock className="h-4 w-4" />
                  {cls.time}
                </p>
                <p className="text-sm text-teal-600 mb-1">{cls.student}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${cls.earnings}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {cls.status === "ready" || cls.status === "live" ? (
                  <Button 
                    size="sm" 
                    className={cls.status === "live" ? "bg-red-500 hover:bg-red-600" : "bg-teal-500 hover:bg-teal-600"}
                    onClick={() => onStartClass(cls.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {cls.status === "live" ? "Join Live" : "Start"}
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
