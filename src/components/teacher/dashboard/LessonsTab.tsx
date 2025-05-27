
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LessonPlanItem } from "./LessonPlanItem";
import { MaterialItem } from "./MaterialItem";
import { PlusCircle, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LessonsTabProps {
  lessonPlans: any[];
  onCreateLessonPlan: () => void;
  onUploadMaterial: () => void;
  onViewLessonPlan: (planId: string) => void;
  onUseMaterial: (materialName: string) => void;
}

export const LessonsTab = ({ 
  lessonPlans, 
  onCreateLessonPlan, 
  onUploadMaterial, 
  onViewLessonPlan, 
  onUseMaterial 
}: LessonsTabProps) => {
  const { languageText } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{languageText.lessonPlans}</CardTitle>
          <Button size="sm" onClick={onCreateLessonPlan}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {languageText.createLessonPlan}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lessonPlans.length > 0 ? (
              lessonPlans.map((plan, index) => (
                <LessonPlanItem
                  key={plan.id || index}
                  title={plan.title}
                  subject={plan.subject || languageText.vocabulary}
                  grade={plan.grade || languageText.beginner}
                  lastModified={new Date().toISOString().split('T')[0]}
                  onView={() => onViewLessonPlan(plan.id || plan.title)}
                  onUse={() => onUseMaterial(plan.title)}
                />
              ))
            ) : (
              <>
                <LessonPlanItem
                  title="Animal Vocabulary"
                  subject={languageText.vocabulary}
                  grade={languageText.beginner}
                  lastModified="2025-05-20"
                  onView={() => onViewLessonPlan("animal-vocabulary")}
                  onUse={() => onUseMaterial("Animal Vocabulary")}
                />
                <LessonPlanItem
                  title="Daily Routines"
                  subject={languageText.conversation}
                  grade={languageText.intermediate}
                  lastModified="2025-05-18"
                  onView={() => onViewLessonPlan("daily-routines")}
                  onUse={() => onUseMaterial("Daily Routines")}
                />
                <LessonPlanItem
                  title="Past Tense Practice"
                  subject={languageText.grammar}
                  grade={languageText.intermediate}
                  lastModified="2025-05-15"
                  onView={() => onViewLessonPlan("past-tense")}
                  onUse={() => onUseMaterial("Past Tense Practice")}
                />
                <LessonPlanItem
                  title="Reading Comprehension"
                  subject={languageText.reading}
                  grade={languageText.advanced}
                  lastModified="2025-05-10"
                  onView={() => onViewLessonPlan("reading-comprehension")}
                  onUse={() => onUseMaterial("Reading Comprehension")}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{languageText.teachingMaterials}</CardTitle>
          <Button size="sm" onClick={onUploadMaterial}>
            <Upload className="mr-2 h-4 w-4" />
            {languageText.uploadMaterial}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MaterialItem
              title="Animal Flashcards.pdf"
              type="PDF"
              size="2.4 MB"
              onView={() => onUseMaterial("Animal Flashcards.pdf")}
              onUse={() => onUseMaterial("Animal Flashcards.pdf")}
            />
            <MaterialItem
              title="Daily Routines Worksheet.pdf"
              type="PDF"
              size="1.8 MB"
              onView={() => onUseMaterial("Daily Routines Worksheet.pdf")}
              onUse={() => onUseMaterial("Daily Routines Worksheet.pdf")}
            />
            <MaterialItem
              title="Past Tense Exercise.docx"
              type="DOCX"
              size="1.2 MB"
              onView={() => onUseMaterial("Past Tense Exercise.docx")}
              onUse={() => onUseMaterial("Past Tense Exercise.docx")}
            />
            <MaterialItem
              title="Reading Story - The Lost Dog.pdf"
              type="PDF"
              size="3.1 MB"
              onView={() => onUseMaterial("Reading Story - The Lost Dog.pdf")}
              onUse={() => onUseMaterial("Reading Story - The Lost Dog.pdf")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
