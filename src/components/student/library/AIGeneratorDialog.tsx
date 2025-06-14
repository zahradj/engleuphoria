
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { materialLibraryService } from "@/services/materialLibraryService";
import { Material, AIGenerationRequest } from "@/types/materialLibrary";
import { Loader2, Sparkles, Zap, BookOpen, FileText, HelpCircle, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialGenerated: (material: Material) => void;
}

export function AIGeneratorDialog({ open, onOpenChange, onMaterialGenerated }: AIGeneratorDialogProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    topic: '',
    level: '',
    duration: 20,
    specificRequirements: ''
  });

  const types = [
    { value: 'worksheet', label: 'Worksheet', icon: FileText, description: 'Printable exercises and activities' },
    { value: 'activity', label: 'Activity', icon: Gamepad2, description: 'Interactive classroom activities' },
    { value: 'quiz', label: 'Quiz', icon: HelpCircle, description: 'Assessment questions and tests' },
    { value: 'flashcards', label: 'Flashcards', icon: BookOpen, description: 'Study cards for vocabulary' }
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner (A1-A2)', description: 'Basic vocabulary and simple sentences' },
    { value: 'intermediate', label: 'Intermediate (B1-B2)', description: 'Complex grammar and conversations' },
    { value: 'advanced', label: 'Advanced (C1-C2)', description: 'Academic and professional language' }
  ];

  const popularTopics = [
    'Animals', 'Food & Drinks', 'Family & Friends', 'Daily Routines', 
    'Hobbies', 'Travel', 'Weather', 'Colors & Numbers', 'Body Parts', 
    'Clothing', 'School', 'Home', 'Transportation', 'Jobs'
  ];

  const handleGenerate = async () => {
    if (!formData.type || !formData.topic || !formData.level) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const request: AIGenerationRequest = {
        type: formData.type as any,
        topic: formData.topic,
        level: formData.level as any,
        duration: formData.duration,
        specificRequirements: formData.specificRequirements
      };

      const generatedMaterial = await materialLibraryService.generateAIMaterial(request);
      onMaterialGenerated(generatedMaterial);
      
      // Reset form
      setFormData({
        type: '',
        topic: '',
        level: '',
        duration: 20,
        specificRequirements: ''
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate material. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Material Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Material Type Selection */}
          <div>
            <Label className="text-base font-medium">Material Type *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {types.map((type) => (
                <Card 
                  key={type.value}
                  className={`p-3 cursor-pointer transition-colors ${
                    formData.type === type.value 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, type: type.value})}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <type.icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <Label htmlFor="topic" className="text-base font-medium">Topic *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              placeholder="Enter a topic (e.g., Animals, Food, Travel)"
              className="mt-2"
            />
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-2">Popular topics:</p>
              <div className="flex flex-wrap gap-1">
                {popularTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setFormData({...formData, topic})}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Level Selection */}
          <div>
            <Label className="text-base font-medium">Level *</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {levels.map((level) => (
                <Card 
                  key={level.value}
                  className={`p-3 cursor-pointer transition-colors ${
                    formData.level === level.value 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, level: level.value})}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm">{level.label}</span>
                      <p className="text-xs text-gray-600">{level.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-base font-medium">Duration (minutes)</Label>
            <Select value={formData.duration.toString()} onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specific Requirements */}
          <div>
            <Label htmlFor="requirements" className="text-base font-medium">Specific Requirements (Optional)</Label>
            <Textarea
              id="requirements"
              value={formData.specificRequirements}
              onChange={(e) => setFormData({...formData, specificRequirements: e.target.value})}
              placeholder="Any specific requirements or focus areas for your material..."
              rows={3}
              className="mt-2"
            />
          </div>

          {/* AI Features Info */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-800 mb-1">AI Features:</p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Level-appropriate content generation</li>
                  <li>• Interactive exercises and activities</li>
                  <li>• Customized to your learning needs</li>
                  <li>• Ready-to-use materials in seconds</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !formData.type || !formData.topic || !formData.level}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Material...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate AI Material
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
