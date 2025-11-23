import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepObjectives } from "./StepObjectives";
import { StepActivities } from "./StepActivities";
import { StepPreview } from "./StepPreview";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useGenerateInteractiveLesson } from "@/hooks/useGenerateInteractiveLesson";

interface LessonCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onLessonCreated?: () => void;
}

export interface LessonFormData {
  // Step 1: Basic Info
  topic: string;
  cefrLevel: string;
  ageGroup: string;
  duration: number;
  
  // Step 2: Objectives
  vocabularyList: string[];
  grammarFocus: string[];
  learningObjectives: string[];
  
  // Step 3: Activities
  selectedActivities: string[];
  
  // Generation
  isGenerating: boolean;
  generatedLesson: any;
}

export const LessonCreatorModal = ({ open, onClose, onLessonCreated }: LessonCreatorModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { generateLesson, isGenerating } = useGenerateInteractiveLesson();
  const [formData, setFormData] = useState<LessonFormData>({
    topic: "",
    cefrLevel: "A1",
    ageGroup: "8-11",
    duration: 30,
    vocabularyList: [],
    grammarFocus: [],
    learningObjectives: [],
    selectedActivities: [],
    isGenerating: false,
    generatedLesson: null,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    "Basic Information",
    "Learning Objectives",
    "Interactive Activities",
    "Preview & Generate"
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setFormData({ ...formData, isGenerating: true });
    
    try {
      const lesson = await generateLesson({
        topic: formData.topic,
        cefrLevel: formData.cefrLevel,
        ageGroup: formData.ageGroup,
        duration: formData.duration,
        vocabularyList: formData.vocabularyList,
        grammarFocus: formData.grammarFocus,
        learningObjectives: formData.learningObjectives,
        selectedActivities: formData.selectedActivities
      });
      
      setFormData({ 
        ...formData, 
        generatedLesson: lesson, 
        isGenerating: false 
      });

      // Close modal and refresh library after short delay
      setTimeout(() => {
        onLessonCreated?.();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Failed to generate lesson:", error);
      setFormData({ ...formData, isGenerating: false });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo formData={formData} setFormData={setFormData} />;
      case 2:
        return <StepObjectives formData={formData} setFormData={setFormData} />;
      case 3:
        return <StepActivities formData={formData} setFormData={setFormData} />;
      case 4:
        return <StepPreview formData={formData} onGenerate={handleGenerate} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.topic && formData.cefrLevel && formData.ageGroup;
      case 2:
        return formData.vocabularyList.length > 0 && formData.learningObjectives.length > 0;
      case 3:
        return formData.selectedActivities.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Create Interactive Lesson
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{stepTitles[currentStep - 1]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="py-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || formData.generatedLesson}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Lesson"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
