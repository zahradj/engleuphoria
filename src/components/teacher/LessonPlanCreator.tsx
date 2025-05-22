
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash, Save } from "lucide-react";

export interface LessonActivity {
  id: string;
  title: string;
  description: string;
  duration: number;
  materials: string[];
}

export interface LessonPlan {
  id: string;
  title: string;
  objectives: string[];
  activities: LessonActivity[];
  notes: string;
  grade: string;
  subject: string;
}

interface LessonPlanCreatorProps {
  initialPlan?: LessonPlan;
  onSave: (plan: LessonPlan) => void;
  className?: string;
}

export function LessonPlanCreator({
  initialPlan,
  onSave,
  className = "",
}: LessonPlanCreatorProps) {
  const [plan, setPlan] = useState<LessonPlan>(initialPlan || {
    id: crypto.randomUUID(),
    title: "",
    objectives: [""],
    activities: [{
      id: crypto.randomUUID(),
      title: "",
      description: "",
      duration: 15,
      materials: [""],
    }],
    notes: "",
    grade: "",
    subject: "",
  });
  const { languageText } = useLanguage();
  const { toast } = useToast();

  // Handle changes to the plan title, grade, etc.
  const handlePlanChange = (field: keyof LessonPlan, value: string) => {
    setPlan((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes to objectives
  const handleObjectiveChange = (index: number, value: string) => {
    setPlan((prev) => {
      const newObjectives = [...prev.objectives];
      newObjectives[index] = value;
      return { ...prev, objectives: newObjectives };
    });
  };

  // Add a new objective
  const addObjective = () => {
    setPlan((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  };

  // Remove an objective
  const removeObjective = (index: number) => {
    setPlan((prev) => {
      const newObjectives = [...prev.objectives];
      newObjectives.splice(index, 1);
      return { ...prev, objectives: newObjectives };
    });
  };

  // Handle changes to activities
  const handleActivityChange = (activityIndex: number, field: keyof LessonActivity, value: any) => {
    setPlan((prev) => {
      const newActivities = [...prev.activities];
      newActivities[activityIndex] = {
        ...newActivities[activityIndex],
        [field]: value,
      };
      return { ...prev, activities: newActivities };
    });
  };

  // Add a new activity
  const addActivity = () => {
    setPlan((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        {
          id: crypto.randomUUID(),
          title: "",
          description: "",
          duration: 15,
          materials: [""],
        },
      ],
    }));
  };

  // Remove an activity
  const removeActivity = (index: number) => {
    setPlan((prev) => {
      const newActivities = [...prev.activities];
      newActivities.splice(index, 1);
      return { ...prev, activities: newActivities };
    });
  };

  // Handle changes to materials
  const handleMaterialChange = (activityIndex: number, materialIndex: number, value: string) => {
    setPlan((prev) => {
      const newActivities = [...prev.activities];
      const newMaterials = [...newActivities[activityIndex].materials];
      newMaterials[materialIndex] = value;
      newActivities[activityIndex] = {
        ...newActivities[activityIndex],
        materials: newMaterials,
      };
      return { ...prev, activities: newActivities };
    });
  };

  // Add a new material
  const addMaterial = (activityIndex: number) => {
    setPlan((prev) => {
      const newActivities = [...prev.activities];
      newActivities[activityIndex] = {
        ...newActivities[activityIndex],
        materials: [...newActivities[activityIndex].materials, ""],
      };
      return { ...prev, activities: newActivities };
    });
  };

  // Remove a material
  const removeMaterial = (activityIndex: number, materialIndex: number) => {
    setPlan((prev) => {
      const newActivities = [...prev.activities];
      const newMaterials = [...newActivities[activityIndex].materials];
      newMaterials.splice(materialIndex, 1);
      newActivities[activityIndex] = {
        ...newActivities[activityIndex],
        materials: newMaterials,
      };
      return { ...prev, activities: newActivities };
    });
  };

  // Save the lesson plan
  const handleSave = () => {
    // Validate required fields
    if (!plan.title.trim()) {
      toast({
        title: languageText.validationError,
        description: languageText.lessonTitleRequired,
        variant: "destructive",
      });
      return;
    }

    if (plan.objectives.length === 0 || !plan.objectives.some(obj => obj.trim())) {
      toast({
        title: languageText.validationError,
        description: languageText.objectivesRequired,
        variant: "destructive",
      });
      return;
    }

    // Clean up empty fields
    const cleanedObjectives = plan.objectives.filter(obj => obj.trim());
    const cleanedActivities = plan.activities.map(activity => ({
      ...activity,
      materials: activity.materials.filter(mat => mat.trim()),
    })).filter(activity => activity.title.trim());

    const finalPlan = {
      ...plan,
      objectives: cleanedObjectives,
      activities: cleanedActivities,
    };

    onSave(finalPlan);
    toast({
      title: languageText.lessonPlanSaved,
      description: languageText.lessonPlanSavedDesc,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{initialPlan ? languageText.editLessonPlan : languageText.createLessonPlan}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic lesson info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{languageText.lessonTitle}</Label>
            <Input
              id="title"
              value={plan.title}
              onChange={(e) => handlePlanChange("title", e.target.value)}
              placeholder={languageText.enterLessonTitle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grade">{languageText.grade}</Label>
              <Input
                id="grade"
                value={plan.grade}
                onChange={(e) => handlePlanChange("grade", e.target.value)}
                placeholder={languageText.enterGrade}
              />
            </div>
            <div>
              <Label htmlFor="subject">{languageText.subject}</Label>
              <Input
                id="subject"
                value={plan.subject}
                onChange={(e) => handlePlanChange("subject", e.target.value)}
                placeholder={languageText.enterSubject}
              />
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>{languageText.objectives}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addObjective}
              className="h-8 px-2"
            >
              <Plus size={16} className="mr-1" />
              {languageText.addObjective}
            </Button>
          </div>

          <div className="space-y-2">
            {plan.objectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder={`${languageText.objective} ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeObjective(index)}
                  disabled={plan.objectives.length === 1}
                  className="h-9 px-2"
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>{languageText.activities}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addActivity}
              className="h-8 px-2"
            >
              <Plus size={16} className="mr-1" />
              {languageText.addActivity}
            </Button>
          </div>

          <div className="space-y-6">
            {plan.activities.map((activity, activityIndex) => (
              <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{languageText.activity} {activityIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivity(activityIndex)}
                    disabled={plan.activities.length === 1}
                    className="h-8 px-2"
                  >
                    <Trash size={16} />
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`activity-${activityIndex}-title`}>{languageText.title}</Label>
                  <Input
                    id={`activity-${activityIndex}-title`}
                    value={activity.title}
                    onChange={(e) => handleActivityChange(activityIndex, "title", e.target.value)}
                    placeholder={languageText.enterActivityTitle}
                  />
                </div>

                <div>
                  <Label htmlFor={`activity-${activityIndex}-desc`}>{languageText.description}</Label>
                  <Textarea
                    id={`activity-${activityIndex}-desc`}
                    value={activity.description}
                    onChange={(e) => handleActivityChange(activityIndex, "description", e.target.value)}
                    placeholder={languageText.enterActivityDescription}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor={`activity-${activityIndex}-duration`}>{languageText.duration} (min)</Label>
                  <Input
                    id={`activity-${activityIndex}-duration`}
                    type="number"
                    min="1"
                    value={activity.duration}
                    onChange={(e) => handleActivityChange(activityIndex, "duration", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>{languageText.materials}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addMaterial(activityIndex)}
                      className="h-7 px-2"
                    >
                      <Plus size={14} className="mr-1" />
                      {languageText.addMaterial}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {activity.materials.map((material, materialIndex) => (
                      <div key={materialIndex} className="flex items-center gap-2">
                        <Input
                          value={material}
                          onChange={(e) => handleMaterialChange(activityIndex, materialIndex, e.target.value)}
                          placeholder={`${languageText.material} ${materialIndex + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(activityIndex, materialIndex)}
                          disabled={activity.materials.length === 1}
                          className="h-9 px-2"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">{languageText.additionalNotes}</Label>
          <Textarea
            id="notes"
            value={plan.notes}
            onChange={(e) => handlePlanChange("notes", e.target.value)}
            placeholder={languageText.enterAdditionalNotes}
            rows={4}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSave} className="ml-auto flex items-center gap-2">
          <Save size={16} />
          {languageText.saveLessonPlan}
        </Button>
      </CardFooter>
    </Card>
  );
}
