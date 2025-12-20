import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Save, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AddLessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLevel: string;
  selectedAgeGroup: string;
  nextSequence: number;
  onSuccess: () => void;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  open,
  onOpenChange,
  selectedLevel,
  selectedAgeGroup,
  nextSequence,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState(nextSequence);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [objectives, setObjectives] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingWelcome, setIsCreatingWelcome] = useState(false);

  const handleQuickCreateWelcome = async () => {
    setIsCreatingWelcome(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-welcome-lesson', {
        body: {
          userId: user?.id,
          sequenceNumber: 1,
        }
      });

      if (error) throw error;

      if (data?.lesson) {
        toast.success('Welcome lesson created! Check the lesson library.');
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating welcome lesson:', error);
      toast.error('Failed to create welcome lesson');
    } finally {
      setIsCreatingWelcome(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic first');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('interactive-lesson-generator', {
        body: {
          topic,
          cefrLevel: selectedLevel,
          ageGroup: selectedAgeGroup,
          durationMinutes,
        }
      });

      if (error) throw error;

      if (data?.lesson) {
        // Auto-fill from generated data
        if (data.lesson.title) setTitle(data.lesson.title);
        if (data.lesson.objectives) {
          setObjectives(data.lesson.objectives.join('\n'));
        }
        toast.success('Lesson content generated!');
      }
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast.error('Failed to generate lesson content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      const objectivesArray = objectives
        .split('\n')
        .map(o => o.trim())
        .filter(o => o.length > 0);

      const { error } = await supabase
        .from('interactive_lessons')
        .insert({
          title,
          topic,
          cefr_level: selectedLevel,
          age_group: selectedAgeGroup,
          sequence_number: sequenceNumber,
          duration_minutes: durationMinutes,
          learning_objectives: objectivesArray,
          status: 'draft',
          created_by: user?.id,
        });

      if (error) throw error;

      toast.success('Lesson created successfully!');
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Failed to save lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setTopic('');
    setSequenceNumber(nextSequence);
    setDurationMinutes(30);
    setObjectives('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>

        {/* Quick Create Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Quick Create: Welcome Lesson</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">Pre-A1, ages 5-7, with Benny the Bear</p>
            </div>
            <Button
              onClick={handleQuickCreateWelcome}
              disabled={isCreatingWelcome}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isCreatingWelcome ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              {isCreatingWelcome ? 'Creating...' : 'Create Now'}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or create custom</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CEFR Level</Label>
              <Input value={selectedLevel} disabled />
            </div>
            <div className="space-y-2">
              <Label>Age Group</Label>
              <Input value={selectedAgeGroup} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sequence">Sequence #</Label>
              <Input
                id="sequence"
                type="number"
                min={1}
                value={sequenceNumber}
                onChange={(e) => setSequenceNumber(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Select 
                value={durationMinutes.toString()} 
                onValueChange={(v) => setDurationMinutes(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <div className="flex gap-2">
              <Input
                id="topic"
                placeholder="e.g., Farm Animals, Colors, Family Members"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={handleGenerateWithAI}
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a topic and click the sparkle button to generate with AI
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              placeholder="e.g., Unit 1: Hello and Greetings"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Learning Objectives</Label>
            <Textarea
              id="objectives"
              placeholder="Enter each objective on a new line..."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              One objective per line
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Lesson
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
