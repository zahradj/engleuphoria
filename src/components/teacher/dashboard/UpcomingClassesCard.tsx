
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Play, Eye, Users, DollarSign } from "lucide-react";
import { useClassStartTiming } from "@/hooks/useClassStartTiming";

interface ClassInfo {
  id: string;
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
  onStartClass: (classId: string) => void;
}

export const UpcomingClassesCard = ({ classes, onJoinClass, onStartClass }: UpcomingClassesCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-secondary text-white";
      case "live": return "bg-destructive text-white animate-pulse";
      default: return "bg-muted text-muted-foreground";
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
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Today's Classes</h3>
              <p className="text-sm text-muted-foreground">{classes.length} scheduled</p>
            </div>
          </div>
          {classes.some(c => c.status === "live") && (
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              Live Now
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No classes scheduled for today</p>
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} className="group/item hover:shadow-md transition-all duration-300 p-4 border border-border rounded-xl bg-card hover:bg-accent/5">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-card-foreground group-hover/item:text-primary transition-colors">
                      {cls.title}
                    </h4>
                    <Badge className={`${getStatusColor(cls.status)} text-xs font-medium`}>
                      {getStatusText(cls.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{cls.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <Users className="h-4 w-4" />
                    <span>{cls.student}</span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      €10/lesson
                    </span>
                    <span className="flex items-center gap-1 text-secondary font-semibold">
                      <span>Total: €{cls.studentCount * 10}</span>
                    </span>
                  </div>
                </div>
                
                <ClassActionButton 
                  classItem={cls}
                  onJoinClass={onJoinClass}
                  onStartClass={onStartClass}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

function ClassActionButton({ 
  classItem, 
  onJoinClass, 
  onStartClass 
}: { 
  classItem: ClassInfo;
  onJoinClass: () => void;
  onStartClass: (classId: string) => void;
}) {
  const timing = useClassStartTiming(classItem.time, 55); // Assuming 55 min lessons

  if (classItem.status === "live") {
    return (
      <Button
        onClick={onJoinClass}
        size="sm"
        className="bg-destructive hover:bg-destructive/90 text-white"
      >
        <Play className="h-4 w-4 mr-2" />
        Join Live
      </Button>
    );
  }

  if (classItem.status === "ready" && timing.canStart) {
    return (
      <Button
        onClick={() => onStartClass(classItem.id)}
        size="sm"
        className="bg-secondary hover:bg-secondary/90 text-white"
      >
        <Play className="h-4 w-4 mr-2" />
        Start Class
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button 
        size="sm"
        variant="outline"
        disabled={!timing.canStart}
        className="cursor-not-allowed disabled:opacity-50"
        onClick={() => timing.canStart && onStartClass(classItem.id)}
      >
        <Clock className="h-4 w-4 mr-2" />
        Start Class
      </Button>
      {!timing.canStart && timing.minutesUntil > 0 && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {timing.statusMessage}
        </span>
      )}
    </div>
  );
}
