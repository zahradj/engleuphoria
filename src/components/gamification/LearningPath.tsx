
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Lock, Play } from "lucide-react";

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  isCompleted: boolean;
  isLocked: boolean;
  points: number;
  activities: {
    id: string;
    title: string;
    type: "quiz" | "game" | "video" | "reading" | "practice";
    isCompleted: boolean;
    duration: number; // in minutes
  }[];
}

interface LearningPathProps {
  path: {
    title: string;
    description: string;
    milestones: LearningMilestone[];
  };
  onStartActivity: (milestoneId: string, activityId: string) => void;
  className?: string;
}

export function LearningPath({
  path,
  onStartActivity,
  className = "",
}: LearningPathProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const { languageText } = useLanguage();

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };
  
  // Calculate completion percentage for a milestone
  const calculateCompletionPercentage = (milestone: LearningMilestone) => {
    if (milestone.activities.length === 0) return 0;
    const completedActivities = milestone.activities.filter(a => a.isCompleted).length;
    return Math.round((completedActivities / milestone.activities.length) * 100);
  };

  // Get the appropriate activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz": return "🧩";
      case "game": return "🎮";
      case "video": return "🎬";
      case "reading": return "📖";
      case "practice": return "✏️";
      default: return "📝";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{path.title}</CardTitle>
        <p className="text-muted-foreground">{path.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {path.milestones.map((milestone, index) => (
            <div 
              key={milestone.id} 
              className={`border rounded-lg overflow-hidden ${
                milestone.isLocked ? "opacity-70" : ""
              }`}
            >
              {/* Milestone header */}
              <div 
                className={`flex items-center p-4 cursor-pointer ${
                  milestone.isCompleted ? "bg-green-50" : (
                    milestone.isLocked ? "bg-gray-50" : "bg-blue-50"
                  )
                }`}
                onClick={() => !milestone.isLocked && toggleMilestone(milestone.id)}
              >
                {/* Status indicator */}
                <div className="mr-3">
                  {milestone.isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : milestone.isLocked ? (
                    <Lock className="h-6 w-6 text-gray-400" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-sm">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                {/* Title and progress */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${
                      milestone.isLocked ? "text-gray-500" : ""
                    }`}>
                      {milestone.title}
                    </h3>
                    
                    <div className="text-sm font-medium bg-yellow-dark/10 text-yellow-dark px-2 py-1 rounded-full ml-2">
                      {milestone.points} {languageText.points}
                    </div>
                  </div>
                  
                  <p className={`text-sm ${
                    milestone.isLocked ? "text-gray-400" : "text-muted-foreground"
                  }`}>
                    {milestone.description}
                  </p>
                  
                  {/* Progress bar */}
                  {!milestone.isLocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>
                          {calculateCompletionPercentage(milestone)}% {languageText.complete}
                        </span>
                        <span>
                          {milestone.activities.filter(a => a.isCompleted).length}/{milestone.activities.length} {languageText.activities}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${milestone.isCompleted ? "bg-green-500" : "bg-blue-500"}`}
                          style={{width: `${calculateCompletionPercentage(milestone)}%`}}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Activities list (expanded) */}
              {!milestone.isLocked && expandedMilestone === milestone.id && (
                <div className="border-t p-2 divide-y divide-gray-100">
                  {milestone.activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between py-2 px-3"
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-xl" role="img" aria-label={activity.type}>
                          {getActivityIcon(activity.type)}
                        </span>
                        <div>
                          <h4 className="text-sm font-medium">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {activity.type} • {activity.duration} {languageText.min}
                          </p>
                        </div>
                      </div>
                      
                      {activity.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => onStartActivity(milestone.id, activity.id)}
                        >
                          <Play className="h-3.5 w-3.5" />
                          {languageText.start}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
