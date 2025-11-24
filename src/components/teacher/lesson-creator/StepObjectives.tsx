import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { LessonFormData } from "./LessonCreatorModal";
import { VocabularyImageUploader } from "../VocabularyImageUploader";

interface StepObjectivesProps {
  formData: LessonFormData;
  setFormData: (data: LessonFormData) => void;
  lessonId: string;
}

export const StepObjectives = ({ formData, setFormData, lessonId }: StepObjectivesProps) => {
  const [vocabInput, setVocabInput] = useState("");
  const [grammarInput, setGrammarInput] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");

  const addItem = (type: 'vocabulary' | 'grammar' | 'objective', value: string) => {
    if (!value.trim()) return;
    
    switch (type) {
      case 'vocabulary':
        setFormData({ 
          ...formData, 
          vocabularyList: [...formData.vocabularyList, value.trim()] 
        });
        setVocabInput("");
        break;
      case 'grammar':
        setFormData({ 
          ...formData, 
          grammarFocus: [...formData.grammarFocus, value.trim()] 
        });
        setGrammarInput("");
        break;
      case 'objective':
        setFormData({ 
          ...formData, 
          learningObjectives: [...formData.learningObjectives, value.trim()] 
        });
        setObjectiveInput("");
        break;
    }
  };

  const removeItem = (type: 'vocabulary' | 'grammar' | 'objective', index: number) => {
    switch (type) {
      case 'vocabulary':
        setFormData({
          ...formData,
          vocabularyList: formData.vocabularyList.filter((_, i) => i !== index)
        });
        break;
      case 'grammar':
        setFormData({
          ...formData,
          grammarFocus: formData.grammarFocus.filter((_, i) => i !== index)
        });
        break;
      case 'objective':
        setFormData({
          ...formData,
          learningObjectives: formData.learningObjectives.filter((_, i) => i !== index)
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Vocabulary */}
      <div>
        <Label>Vocabulary Words *</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Add key vocabulary words students will learn
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., family, mother, father..."
            value={vocabInput}
            onChange={(e) => setVocabInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem('vocabulary', vocabInput)}
          />
          <Button 
            type="button"
            onClick={() => addItem('vocabulary', vocabInput)}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.vocabularyList.map((word, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {word}
              <button
                onClick={() => removeItem('vocabulary', index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Grammar Focus */}
      <div>
        <Label>Grammar Focus</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Grammar points to teach (optional)
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., present simple, possessive adjectives..."
            value={grammarInput}
            onChange={(e) => setGrammarInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem('grammar', grammarInput)}
          />
          <Button 
            type="button"
            onClick={() => addItem('grammar', grammarInput)}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.grammarFocus.map((item, index) => (
            <Badge key={index} variant="outline" className="px-3 py-1">
              {item}
              <button
                onClick={() => removeItem('grammar', index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      <div>
        <Label>Learning Objectives *</Label>
        <p className="text-sm text-muted-foreground mb-2">
          What will students be able to do by the end?
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Students will be able to introduce family members..."
            value={objectiveInput}
            onChange={(e) => setObjectiveInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem('objective', objectiveInput)}
          />
          <Button 
            type="button"
            onClick={() => addItem('objective', objectiveInput)}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-3">
          {formData.learningObjectives.map((objective, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm flex-1">{objective}</span>
              <button
                onClick={() => removeItem('objective', index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {formData.vocabularyList.length > 0 && (
        <>
          <Separator className="my-8" />
          
          <div>
            <Label className="text-lg">Vocabulary Images</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Upload or generate images for your vocabulary words
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formData.vocabularyList.map((word) => (
                <VocabularyImageUploader
                  key={word}
                  word={word}
                  lessonId={lessonId}
                  ageGroup={formData.ageGroup}
                  cefrLevel={formData.cefrLevel}
                  currentImageUrl={formData.vocabularyImages[word]?.url}
                  onImageChange={(url) => {
                    const updatedImages = { ...formData.vocabularyImages };
                    if (url) {
                      updatedImages[word] = {
                        source: updatedImages[word]?.source || 'upload',
                        url
                      };
                    } else {
                      delete updatedImages[word];
                    }
                    setFormData({ ...formData, vocabularyImages: updatedImages });
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
