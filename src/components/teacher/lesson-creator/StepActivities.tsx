import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, 
  Gamepad2, 
  MessageSquare, 
  Mic, 
  Music, 
  Puzzle,
  Sparkles,
  Target
} from "lucide-react";
import { LessonFormData } from "./LessonCreatorModal";

interface StepActivitiesProps {
  formData: LessonFormData;
  setFormData: (data: LessonFormData) => void;
}

const activityTypes = [
  {
    id: "matching",
    label: "Matching Game",
    description: "Match words to images or definitions",
    icon: Puzzle,
    recommended: true
  },
  {
    id: "dragdrop",
    label: "Drag & Drop",
    description: "Drag items to correct categories",
    icon: Target,
    recommended: true
  },
  {
    id: "quiz",
    label: "Multiple Choice Quiz",
    description: "Test understanding with questions",
    icon: BookOpen,
    recommended: true
  },
  {
    id: "dialogue",
    label: "Dialogue Practice",
    description: "Role-play conversations",
    icon: MessageSquare,
    recommended: false
  },
  {
    id: "speaking",
    label: "Speaking Practice",
    description: "Pronunciation and speaking activities",
    icon: Mic,
    recommended: false
  },
  {
    id: "phonics",
    label: "Phonics Activity",
    description: "Letter sounds and pronunciation",
    icon: Music,
    recommended: false
  },
  {
    id: "memory",
    label: "Memory Cards",
    description: "Flip and match pairs",
    icon: Gamepad2,
    recommended: false
  },
  {
    id: "sentence-builder",
    label: "Sentence Builder",
    description: "Arrange words to build sentences",
    icon: Sparkles,
    recommended: false
  }
];

export const StepActivities = ({ formData, setFormData }: StepActivitiesProps) => {
  const toggleActivity = (activityId: string) => {
    const isSelected = formData.selectedActivities.includes(activityId);
    
    if (isSelected) {
      setFormData({
        ...formData,
        selectedActivities: formData.selectedActivities.filter(id => id !== activityId)
      });
    } else {
      setFormData({
        ...formData,
        selectedActivities: [...formData.selectedActivities, activityId]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg">Select Interactive Activities *</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Choose at least one activity type for your lesson
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activityTypes.map((activity) => {
          const isSelected = formData.selectedActivities.includes(activity.id);
          const Icon = activity.icon;
          
          return (
            <Card 
              key={activity.id}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => toggleActivity(activity.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {activity.label}
                        {activity.recommended && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {activity.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => toggleActivity(activity.id)}
                    className="mt-1"
                  />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
