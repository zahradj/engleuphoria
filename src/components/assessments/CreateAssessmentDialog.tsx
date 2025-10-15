import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface CreateAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAssessmentDialog({ open, onOpenChange, onSuccess }: CreateAssessmentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assessment_type: "quiz",
    cefr_level: "B1",
    duration_minutes: 30,
    passing_score: 70,
  });

  const [questions, setQuestions] = useState<Array<{
    question_text: string;
    question_type: string;
    points: number;
    options?: string[];
    correct_answer?: string;
  }>>([
    { question_text: "", question_type: "multiple_choice", points: 1, options: ["", "", "", ""] }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          ...formData,
          teacher_id: user.id,
          total_points: questions.reduce((sum, q) => sum + q.points, 0)
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Create questions
      const questionsData = questions.map((q, index) => ({
        assessment_id: assessment.id,
        question_order: index + 1,
        ...q,
        options: q.question_type === 'multiple_choice' ? q.options : null
      }));

      const { error: questionsError } = await supabase
        .from('assessment_questions')
        .insert(questionsData);

      if (questionsError) throw questionsError;

      toast({
        title: "Success",
        description: "Assessment created successfully",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        assessment_type: "quiz",
        cefr_level: "B1",
        duration_minutes: 30,
        passing_score: 70,
      });
      setQuestions([{ question_text: "", question_type: "multiple_choice", points: 1, options: ["", "", "", ""] }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      question_text: "", 
      question_type: "multiple_choice", 
      points: 1,
      options: ["", "", "", ""]
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    if (updated[qIndex].options) {
      updated[qIndex].options![oIndex] = value;
      setQuestions(updated);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment_type">Type</Label>
              <Select
                value={formData.assessment_type}
                onValueChange={(value) => setFormData({ ...formData, assessment_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cefr_level">CEFR Level</Label>
              <Select
                value={formData.cefr_level}
                onValueChange={(value) => setFormData({ ...formData, cefr_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                min="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing Score (%)</Label>
              <Input
                id="passing_score"
                type="number"
                value={formData.passing_score}
                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Button type="button" onClick={addQuestion} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </Button>
            </div>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Label>Question {qIndex + 1}</Label>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="Question text"
                  value={q.question_text}
                  onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                  required
                />

                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={q.question_type}
                    onValueChange={(value) => updateQuestion(qIndex, 'question_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Points"
                    value={q.points}
                    onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                    min="1"
                  />
                </div>

                {q.question_type === 'multiple_choice' && q.options && (
                  <div className="space-y-2">
                    <Label className="text-sm">Options</Label>
                    {q.options.map((option, oIndex) => (
                      <Input
                        key={oIndex}
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        required
                      />
                    ))}
                    <Input
                      placeholder="Correct answer (exact match with an option)"
                      value={q.correct_answer || ''}
                      onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                    />
                  </div>
                )}

                {q.question_type === 'true_false' && (
                  <Select
                    value={q.correct_answer || ''}
                    onValueChange={(value) => updateQuestion(qIndex, 'correct_answer', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="True">True</SelectItem>
                      <SelectItem value="False">False</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assessment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}