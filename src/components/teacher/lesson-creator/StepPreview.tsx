import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Users, Target, Sparkles, Loader2 } from "lucide-react";
import { LessonFormData } from "./LessonCreatorModal";

interface StepPreviewProps {
  formData: LessonFormData;
  onGenerate: () => void;
}

export const StepPreview = ({ formData, onGenerate }: StepPreviewProps) => {
  if (formData.isGenerating) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Creating your lesson...</h3>
        <p className="text-muted-foreground">
          AI is generating 20 interactive screens with activities, games, and assessments
        </p>
      </div>
    );
  }

  if (formData.generatedLesson) {
    return (
      <div className="text-center py-12">
        <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-primary">Lesson Created Successfully!</h3>
        <p className="text-muted-foreground mb-6">
          Your interactive lesson is ready to use
        </p>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          View in Library
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Review Your Lesson</h3>
        <p className="text-muted-foreground">
          Preview the lesson details before generating
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {formData.topic}
          </CardTitle>
          <CardDescription>
            Interactive ESL lesson with gamification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{formData.ageGroup} years</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{formData.cefrLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formData.duration} minutes</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Vocabulary ({formData.vocabularyList.length})</h4>
            <div className="flex flex-wrap gap-2">
              {formData.vocabularyList.slice(0, 10).map((word, index) => (
                <Badge key={index} variant="secondary">
                  {word}
                </Badge>
              ))}
              {formData.vocabularyList.length > 10 && (
                <Badge variant="outline">+{formData.vocabularyList.length - 10} more</Badge>
              )}
            </div>
          </div>

          {formData.grammarFocus.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Grammar Focus</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.grammarFocus.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Learning Objectives</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {formData.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">
              Interactive Activities ({formData.selectedActivities.length})
            </h4>
            <p className="text-sm text-muted-foreground">
              {formData.selectedActivities.join(", ").replace(/-/g, " ")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">AI will generate:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 20 interactive screens with smooth transitions</li>
                <li>• Vocabulary cards with IPA pronunciation</li>
                <li>• Interactive games (drag-drop, matching, quiz)</li>
                <li>• Speaking and listening activities</li>
                <li>• Progress tracking with XP and badges</li>
                <li>• Animated mascot with encouragement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
