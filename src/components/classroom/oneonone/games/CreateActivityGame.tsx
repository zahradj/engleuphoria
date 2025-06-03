
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatedActivity {
  id: string;
  title: string;
  type: string;
  description: string;
  content: any;
  createdAt: Date;
}

export function CreateActivityGame() {
  const [activityTitle, setActivityTitle] = useState("");
  const [activityType, setActivityType] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [words, setWords] = useState<string[]>([""]);
  const [createdActivities, setCreatedActivities] = useState<CreatedActivity[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const activityTypes = [
    { value: "quiz", label: "Quiz Questions" },
    { value: "word-match", label: "Word Matching" },
    { value: "fill-blank", label: "Fill in the Blanks" },
    { value: "story", label: "Story Builder" },
    { value: "conversation", label: "Conversation Practice" }
  ];

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addWord = () => {
    setWords([...words, ""]);
  };

  const updateWord = (index: number, value: string) => {
    const updated = [...words];
    updated[index] = value;
    setWords(updated);
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const createActivity = () => {
    if (!activityTitle || !activityType || !activityDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newActivity: CreatedActivity = {
      id: Date.now().toString(),
      title: activityTitle,
      type: activityType,
      description: activityDescription,
      content: {
        questions: activityType === "quiz" || activityType === "fill-blank" ? questions.filter(q => q.trim()) : [],
        words: activityType === "word-match" ? words.filter(w => w.trim()) : []
      },
      createdAt: new Date()
    };

    setCreatedActivities([newActivity, ...createdActivities]);
    
    // Reset form
    setActivityTitle("");
    setActivityType("");
    setActivityDescription("");
    setQuestions([""]);
    setWords([""]);
    setIsCreating(false);

    toast({
      title: "Activity Created!",
      description: `"${newActivity.title}" has been added to your activities.`,
    });
  };

  const deleteActivity = (id: string) => {
    setCreatedActivities(createdActivities.filter(activity => activity.id !== id));
    toast({
      title: "Activity Deleted",
      description: "The activity has been removed.",
    });
  };

  if (!isCreating && createdActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <Plus size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Create Custom Activities</h3>
          <p className="text-gray-600 mb-4">Design your own interactive learning activities</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-purple-500 hover:bg-purple-600">
          <Plus size={16} className="mr-2" />
          Create New Activity
        </Button>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create New Activity</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(false)}
          >
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Activity Title *</Label>
            <Input
              id="title"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="e.g., Animal Vocabulary Quiz"
            />
          </div>

          <div>
            <Label htmlFor="type">Activity Type *</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            placeholder="Describe what this activity teaches..."
            rows={2}
          />
        </div>

        {(activityType === "quiz" || activityType === "fill-blank") && (
          <div>
            <Label>Questions</Label>
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder={`Question ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addQuestion}>
                <Plus size={14} className="mr-1" />
                Add Question
              </Button>
            </div>
          </div>
        )}

        {activityType === "word-match" && (
          <div>
            <Label>Words/Vocabulary</Label>
            <div className="space-y-2">
              {words.map((word, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={word}
                    onChange={(e) => updateWord(index, e.target.value)}
                    placeholder={`Word ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWord(index)}
                    disabled={words.length === 1}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addWord}>
                <Plus size={14} className="mr-1" />
                Add Word
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={createActivity} className="bg-green-500 hover:bg-green-600">
            <Save size={16} className="mr-2" />
            Create Activity
          </Button>
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Custom Activities</h3>
        <Button
          onClick={() => setIsCreating(true)}
          size="sm"
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus size={16} className="mr-2" />
          Create New
        </Button>
      </div>

      <div className="grid gap-3">
        {createdActivities.map((activity) => (
          <Card key={activity.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{activity.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {activityTypes.find(t => t.value === activity.type)?.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                <div className="text-xs text-gray-500">
                  Created {activity.createdAt.toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm">
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteActivity(activity.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
