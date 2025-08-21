import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, BookOpen, Clock, Target } from 'lucide-react';

interface LessonGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonGenerated?: () => void;
}

const CEFR_LEVELS = ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'];

const COMMON_TOPICS = [
  'Introductions & Greetings',
  'Family & Relationships', 
  'Food & Dining',
  'Travel & Transportation',
  'Shopping & Money',
  'Work & Career',
  'Health & Body',
  'Hobbies & Entertainment',
  'Weather & Seasons',
  'Technology & Communication'
];

export function LessonGeneratorModal({ isOpen, onClose, onLessonGenerated }: LessonGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    topic: '',
    cefrLevel: 'A1',
    moduleNumber: 1,
    lessonNumber: 1,
    learningObjectives: '',
    customRequirements: ''
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a lesson topic.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('ai-lesson-generator', {
        body: {
          topic: formData.topic,
          cefrLevel: formData.cefrLevel,
          moduleNumber: formData.moduleNumber,
          lessonNumber: formData.lessonNumber,
          learningObjectives: formData.learningObjectives.split(',').map(obj => obj.trim()).filter(Boolean),
          customRequirements: formData.customRequirements
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        console.error('Generation error:', error);
        throw new Error(error.message || 'Failed to generate lesson');
      }

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      toast({
        title: "Lesson Generated Successfully!",
        description: `Created "${data.lesson.title}" with ${data.lesson.slides_content.slides.length} interactive slides.`
      });

      onLessonGenerated?.();
      onClose();
      
      // Reset form
      setFormData({
        topic: '',
        cefrLevel: 'A1',
        moduleNumber: 1,
        lessonNumber: 1,
        learningObjectives: '',
        customRequirements: ''
      });

    } catch (error) {
      console.error('Lesson generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Lesson Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-3">
            <Label htmlFor="topic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Lesson Topic
            </Label>
            <div className="space-y-2">
              <Input
                id="topic"
                placeholder="Enter a custom topic or select from suggestions"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              />
              <div className="flex flex-wrap gap-2">
                {COMMON_TOPICS.map(topic => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setFormData(prev => ({ ...prev, topic }))}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Level and Module */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>CEFR Level</Label>
              <Select value={formData.cefrLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, cefrLevel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CEFR_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Module #</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={formData.moduleNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, moduleNumber: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Lesson #</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.lessonNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, lessonNumber: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label htmlFor="objectives" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Learning Objectives (comma-separated)
            </Label>
            <Textarea
              id="objectives"
              placeholder="Students will be able to introduce themselves, ask for personal information, use present tense..."
              value={formData.learningObjectives}
              onChange={(e) => setFormData(prev => ({ ...prev, learningObjectives: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Custom Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Custom Requirements (optional)</Label>
            <Textarea
              id="requirements"
              placeholder="Focus on pronunciation, include role-play activities, avoid complex grammar..."
              value={formData.customRequirements}
              onChange={(e) => setFormData(prev => ({ ...prev, customRequirements: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Generating interactive lesson slides...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-muted-foreground">
                Creating 22 professional slides with interactive elements
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Takes 30-60 seconds
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Lesson
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}